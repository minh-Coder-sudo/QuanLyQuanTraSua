import express from 'express';
import payos from '../config/payos.cjs';
import Order from '../models/Order.js'; // 🔥 thêm dòng này

const router = express.Router();

// ================= COD =================
router.post('/checkout', async (req, res) => {
    const { cart, address } = req.body;

    const total = cart.reduce((sum, item) => {
        const price = Number(item.finalPrice ?? item.price ?? item.basePrice ?? 0) || 0;
        const qty = item.qty || item.quantity || 1;
        return sum + price * qty;
    }, 0);

    // 🔥 lưu DB luôn
    await Order.create({
        orderCode: Date.now(),
        user: req.body.user || null, // 🔥 LƯU VẾT USER
        items: cart,
        total,
        address,
        status: 'PENDING',
    });

    res.json({
        message: 'Đặt hàng thành công',
        total,
    });
});

// ================= PAYOS =================
router.post('/payos', async (req, res) => {
    try {
        const { cart, address } = req.body;

        console.log('🔥 PAYOS BODY:', req.body);

        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: 'Cart empty' });
        }

        if (!address || !address.address || address.address.trim() === '') {
            return res.status(400).json({ error: 'Missing address' });
        }

        const total = cart.reduce((sum, item) => {
            const price = Number(item.finalPrice ?? item.price ?? item.basePrice ?? 0) || 0;
            const qty = item.qty || item.quantity || 1;
            return sum + price * qty;
        }, 0);

        console.log('💰 TOTAL:', total);

        if (!total || total < 1000) {
            return res.status(400).json({ error: 'Amount too small' });
        }

        const orderCode = Date.now() + Math.floor(Math.random() * 1000);

        await Order.create({
            orderCode,
            user: req.body.user || null, // 🔥 LƯU VẾT USER
            items: cart,
            total,
            address,
            status: 'PENDING',
        });

        const paymentData = {
            orderCode,
            amount: Math.floor(total), // 🔥 FIX
            description: 'Thanh toan tra sua',
            returnUrl: 'http://localhost:5173/payment-success',
            cancelUrl: 'http://localhost:5173/cart',
        };

        const result = await payos.createPaymentLink(paymentData);

        res.json({ checkoutUrl: result.checkoutUrl });
    } catch (err) {
        console.error('❌ PAYOS ERROR:', err);
        res.status(500).json({ error: 'PayOS error' });
    }
});
// ================= FIX PAYOS TEST =================
router.get('/payos-webhook', (req, res) => {
    res.send('Webhook OK');
});

// ================= PAYOS WEBHOOK =================
router.post('/payos-webhook', async (req, res) => {
    try {
        const payload = req.body;

        console.log('🔥 WEBHOOK:', payload);

        if (payload.code === '00') {
            const orderCode = payload.data.orderCode;

            // 🔥 UPDATE DB
            await Order.updateOne({ orderCode }, { status: 'PAID' });

            console.log('✅ Đã cập nhật đơn hàng:', orderCode);
        }

        res.json({ ok: true });
    } catch (err) {
        console.error('❌ WEBHOOK ERROR:', err);
        res.json({ ok: true });
    }
});

// ================= VIETQR =================
router.post('/vietqr', (req, res) => {
    try {
        const { amount, orderCode } = req.body;

        if (!amount || amount < 1000) {
            return res.status(400).json({ error: 'Số tiền không hợp lệ' });
        }

        // Config BIDV - cập nhật số tài khoản và tên chủ tài khoản
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
