import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, 'Vui lòng cung cấp email hợp lệ'],
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        password: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['ADMIN', 'CLIENT', 'EMPLOYEE'],
            default: 'CLIENT',
        },
        avatar: {
            type: String,
            default: '',
        },
        forgotPasswordCode: {
            type: String,
            default: '',
        },
        forgotPasswordCodeExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', userSchema);
export default User;
