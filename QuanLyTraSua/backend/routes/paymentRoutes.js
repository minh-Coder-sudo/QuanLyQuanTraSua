import express from 'express';
import payos from '../config/payos.cjs';
import Order from '../models/Order.js'; // 🔥 thêm dòng này

const router = express.Router();

// ================= COD =================
router.post('/checkout', async (req, res) => {
    const { cart, address } = req.body;

    const total = cart.reduce(
        (sum, item) => sum + (item.price || 0) * (item.qty || 1),
        0
    );

    // 🔥 lưu DB luôn
    await Order.create({
        orderCode: Date.now(),
        items: cart,
        total,
        address,
        status: 'COD'
    });

    res.json({
        message: 'Đặt hàng thành công',
        total
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

        const total = cart.reduce(
            (sum, item) => sum + (item.price || 0) * (item.qty || 1),
            0
        );

        console.log('💰 TOTAL:', total);

        if (!total || total < 1000) {
            return res.status(400).json({ error: 'Amount too small' });
        }

        const orderCode = Date.now() + Math.floor(Math.random() * 1000);

        await Order.create({
            orderCode,
            items: cart,
            total,
            address,
            status: 'PENDING'
        });

        const paymentData = {
            orderCode,
            amount: Math.floor(total), // 🔥 FIX
            description: 'Thanh toan tra sua',
            returnUrl: 'http://localhost:5173/payment-success',
            cancelUrl: 'http://localhost:5173/payment-fail'
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

export default router;
