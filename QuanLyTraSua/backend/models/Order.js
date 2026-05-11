import mongoose from 'mongoose';

// 🔥 ENUM statuses để tránh lạc đề
const ORDER_STATUS = {
    PENDING: 'PENDING', // 💳 Chờ xác nhận từ khách
    PAID: 'PAID', // ✅ Đã thanh toán (PayOS/VietQR confirmed)
    COMPLETED: 'COMPLETED', // 🎉 Hoàn thành, giao cho khách
    DELIVERED: 'DELIVERED', // 📦 Giao hàng thành công
    CANCELLED: 'CANCELLED', // ❌ Huỷ đơn
    COD: 'COD', // 💰 Thanh toán khi nhận hàng
};

const orderSchema = new mongoose.Schema(
    {
        orderCode: {
            type: Number,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },

        items: {
            type: Array,
            validate: {
                validator: function (v) {
                    return Array.isArray(v) && v.length > 0;
                },
                message: 'Đơn hàng phải có ít nhất 1 sản phẩm',
            },
        },

        total: {
            type: Number,
            required: true,
            validate: {
                validator: function (v) {
                    return v > 0;
                },
                message: 'Tổng tiền phải lớn hơn 0',
            },
        },

        address: {
            name: String,
            phone: String,
            address: String,
        },

        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING,
        },
    },
    { timestamps: true },
);

export default mongoose.model('Order', orderSchema);
export { ORDER_STATUS };
