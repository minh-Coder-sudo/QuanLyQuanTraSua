import mongoose from 'mongoose';

// 🔥 SCHEMA CHO 1 ITEM CART
const cartItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    name: String,
    price: Number,
    qty: {
        type: Number,
        default: 1
    },
    image: String,

    // 🔥 THÊM SIZE
    size: {
        code: String,
        label: String,
        extra: Number
    },

    // 🔥 THÊM TOPPING
    toppings: [
        {
            name: String,
            price: Number
        }
    ]
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, 'Vui lòng cung cấp email hợp lệ']
        },

        phone: {
            type: String,
            trim: true,
            default: ''
        },

        password: {
            type: String,
            required: true
        },

        fullname: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ['ADMIN', 'CLIENT', 'EMPLOYEE'],
            default: 'CLIENT'
        },

        avatar: {
            type: String,
            default: ''
        },

        forgotPasswordCode: {
            type: String,
            default: ''
        },

        forgotPasswordCodeExpires: {
            type: Date,
            default: null
        },

        // 🔥 CART CHUẨN
        cart: [cartItemSchema],

        // 🔥 ADDRESS
        addresses: [
            {
                name: String,
                phone: String,
                address: String
            }
        ]
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User;
