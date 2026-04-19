import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        orderCode: Number,

        items: Array, // 🔥 đơn giản luôn

        total: Number, // 🔥 dùng total (không phải totalPrice)

        address: {
            name: String,
            phone: String,
            address: String
        },

        status: {
            type: String,
            default: 'PENDING'
        }
    },
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
