import express from 'express';
import crypto from 'crypto';
import payos from '../config/payos.cjs';
import Order, { ORDER_STATUS } from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔥 HELPER: Validate & recalculate order items từ database
const validateAndCalculateOrderTotal = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Giỏ hàng trống!');
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
        if (!item.productId && !item._id) {
            throw new Error('Sản phẩm phải có ID');
        }

        const productId = item.productId || item._id;
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error(`Sản phẩm ${productId} không tồn tại`);
        }

        // 🔥 SECURITY: Kiểm tra sản phẩm còn hàng
        if (product.status !== 'AVAILABLE') {
            throw new Error(`Sản phẩm "${product.name}" đã hết hàng`);
        }

        const qty = Math.max(1, parseInt(item.qty || item.quantity || 1));

        // 🔥 SECURITY: Lấy giá từ DB, không tin giá từ client
        const basePrice = Number(product.basePrice) || 0;
        const sizeExtra = item.size?.extra ? Number(item.size.extra) : 0;
        const finalPrice = basePrice + sizeExtra;

        if (finalPrice <= 0) {
            throw new Error(`Giá sản phẩm "${product.name}" không hợp lệ`);
        }

        const itemTotal = finalPrice * qty;
        calculatedTotal += itemTotal;

        validatedItems.push({
            ...item,
            productId: product._id,
            name: product.name,
            basePrice,
            finalPrice,
            qty,
            subtotal: itemTotal,
        });
    }

    if (calculatedTotal < 1000) {
        throw new Error('Tổng tiền đơn hàng phải >= 1000 VNĐ');
    }

    return { validatedItems, calculatedTotal };
};

// ================= COD (Cash On Delivery) =================
router.post('/checkout', protect, async (req, res) => {
    try {
        const { cart, address } = req.body;

        // 🔥 SECURITY: Validate & recalculate từ DB
        const { validatedItems, calculatedTotal } = await validateAndCalculateOrderTotal(cart);

        // 🔥 SECURITY: Lấy user từ token, không tin req.body
        const user = req.user ? req.user._id : null;

        await Order.create({
            orderCode: Date.now() + Math.floor(Math.random() * 10000),
            user,
            items: validatedItems,
            total: calculatedTotal,
            address,
            status: ORDER_STATUS.COD,
        });

        res.json({
            message: 'Đặt hàng thành công',
            total: calculatedTotal,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ================= PAYOS Payment Link =================
router.post('/payos', protect, async (req, res) => {
    try {
        const { cart, address } = req.body;

        console.log('🔥 PAYOS REQUEST:', { cart, address });

        if (!address || !address.address || address.address.trim() === '') {
            return res.status(400).json({ error: 'Vui lòng nhập địa chỉ giao hàng' });
        }

        // 🔥 SECURITY: Validate & recalculate từ DB
        const { validatedItems, calculatedTotal } = await validateAndCalculateOrderTotal(cart);

        // 🔥 SECURITY: Lấy user từ token
        const user = req.user ? req.user._id : null;

        const orderCode = Date.now() + Math.floor(Math.random() * 10000);

        // Tạo order với status PENDING (chưa thanh toán)
        await Order.create({
            orderCode,
            user,
            items: validatedItems,
            total: calculatedTotal,
            address,
            status: ORDER_STATUS.PENDING,
        });

        const paymentData = {
            orderCode,
            amount: Math.floor(calculatedTotal),
            description: 'Thanh toan tra sua',
            returnUrl: 'http://localhost:5173/payment-success',
            cancelUrl: 'http://localhost:5173/cart',
        };

        console.log('💰 PAYOS AMOUNT:', calculatedTotal);

        const result = await payos.createPaymentLink(paymentData);

        res.json({ checkoutUrl: result.checkoutUrl });
    } catch (err) {
        console.error('❌ PAYOS ERROR:', err);
        res.status(500).json({ error: err.message || 'PayOS error' });
    }
});

// ================= PAYOS Webhook Verification =================
// 🔥 Verify PayOS webhook signature
const verifyPayOSSignature = (payload, signature) => {
    try {
        // PayOS signature verification: sort payload, create signature
        const secret = process.env.PAYOS_WEBHOOK_SECRET || '';

        // Tạo chuỗi signature từ payload
        const dataStr = JSON.stringify(payload, Object.keys(payload).sort());

        // Nếu có PAYOS_WEBHOOK_SECRET, verify nó
        if (secret) {
            const expectedSignature = crypto.createHmac('sha256', secret).update(dataStr).digest('hex');

            return expectedSignature === signature;
        }

        // Tạm thời: nếu chưa có secret config, chấp nhận (TODO: set PAYOS_WEBHOOK_SECRET)
        console.warn('⚠️ PAYOS_WEBHOOK_SECRET not configured - webhook signature verification skipped');
        return true;
    } catch (error) {
        console.error('❌ Signature verification error:', error);
        return false;
    }
};

router.get('/payos-webhook', (req, res) => {
    res.send('Webhook OK');
});

// ================= PAYOS Webhook Handler =================
router.post('/payos-webhook', async (req, res) => {
    try {
        const payload = req.body;
        const signature = req.headers['x-payos-signature'];

        console.log('🔥 WEBHOOK RECEIVED:', { payload, signature });

        // 🔥 SECURITY: Verify webhook signature
        if (!verifyPayOSSignature(payload, signature)) {
            console.error('❌ Invalid webhook signature!');
            return res.status(401).json({ ok: false, error: 'Invalid signature' });
        }

        // 🔥 SECURITY: Kiểm tra code = '00' (thành công) và có data
        if (payload.code !== '00' || !payload.data) {
            console.log('⚠️ Webhook rejected - not successful payment');
            return res.json({ ok: true }); // Still return ok to prevent retry
        }

        const orderCode = payload.data.orderCode;
        if (!orderCode) {
            console.error('❌ Missing orderCode in webhook');
            return res.json({ ok: true });
        }

        // 🔥 UPDATE order status: PENDING -> PAID
        const updatedOrder = await Order.updateOne({ orderCode }, { status: ORDER_STATUS.PAID });

        if (updatedOrder.matchedCount === 0) {
            console.warn(`⚠️ Order ${orderCode} not found`);
        } else {
            console.log(`✅ Order ${orderCode} updated to PAID`);
        }

        res.json({ ok: true });
    } catch (err) {
        console.error('❌ WEBHOOK ERROR:', err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// ================= VietQR QR Code Generator =================
router.post('/vietqr', (req, res) => {
    try {
        const { amount, orderCode } = req.body;

        if (!amount || amount < 1000) {
            return res.status(400).json({ error: 'Số tiền không hợp lệ' });
        }

        // Config BIDV
        const BANK_ID = '970418';
        const ACCOUNT_NO = '1490324262';
        const ACCOUNT_NAME = 'TEA MONGO';

        const addInfo = `TeaMango${orderCode || Date.now()}`;

        const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${Math.floor(amount)}&addInfo=${encodeURIComponent(addInfo)}`;

        res.json({
            qrUrl,
            amount: Math.floor(amount),
            addInfo,
            bankId: BANK_ID,
            accountNo: ACCOUNT_NO,
            accountName: ACCOUNT_NAME,
        });
    } catch (err) {
        console.error('❌ VIETQR ERROR:', err);
        res.status(500).json({ error: 'Lỗi tạo QR' });
    }
});

export default router;
