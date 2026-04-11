import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Topping from './models/Topping.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const CATEGORIES = [
    { slug: 'tra-sua', name: 'Trà sữa' },
    { slug: 'tra-trai-cay', name: 'Trà trái cây' },
    { slug: 'matcha-latte', name: 'Matcha / Latte' },
    { slug: 'da-xay', name: 'Đá xay' },
];

const TOPPINGS = [
    { code: 'PEARL', name: 'Trân châu đen', price: 7000 },
    { code: 'GOLD_PEARL', name: 'Trân châu hoàng kim', price: 8000 },
    { code: 'CHEESE', name: 'Kem cheese', price: 10000 },
    { code: 'PUDDING', name: 'Pudding trứng', price: 9000 },
];

const IMAGE_MAP = {
    'Trà sữa Trân châu đường đen': 'BrownBobaTea.png',
    'Trà sữa Matcha sữa tươi': 'MatchaBoba.png',
    'Trà sữa Ô long béo': 'PastelHuesBoba.png',
    'Trà sữa Khoai môn': 'TaroMilkBoba.png',
    'Trà sữa Thái xanh': 'ThaiXanhBoba.png',

    'Trà Đào Cam Sả': 'PeachBoba.png',
    'Trà Vải Nhiệt Đới': 'MixBoba.png',
    'Trà Dâu Tây Đá Tuyết': 'StraberryBoba.png',
    'Trà Xoài Macchiato': 'MangoTea.png',
    'Trà Chanh Dây Hạt Chia': 'LemonLimeTea.png',

    'Matcha Latte Nguyên Bản': 'MatchaBoba.png',
    'Matcha Đậu Đỏ': 'MatchaDauDo.png',
    'Sữa Chua Dâu Tây': 'StraberryBoba.png',
    'Sữa Chua Xoài Chín': 'MangoBubbleBoba.png',
    'Cacao Latte Hạt Dẻ': 'ChoocolateHatDe.png',

    'Oreo Choco Đá Xay': 'ChoocolateMilkBoba.png',
    'Matcha Cookie Đá Xay': 'MatchaBoba.png',
    'Cafe Mocha Đá Xay': 'MochaDaXay.png',
    'Socola Bạc Hà Đá Xay': 'MintMilkTeaBoba.png',
    'Dâu Tây Kem Phô Mai Đá Xay': 'StraberryBoba.png',
};

const SEED_PRODUCTS = [
    {
        name: 'Trà sữa Trân châu đường đen',
        categorySlug: 'tra-sua',
        description: 'Đậm đà vị đường đen, béo ngậy.',
        basePrice: 35000,
        likes: 950,
    },
    {
        name: 'Trà sữa Matcha sữa tươi',
        categorySlug: 'tra-sua',
        description: 'Matcha Nhật Bản kết hợp sữa tươi.',
        basePrice: 42000,
        likes: 420,
    },
    {
        name: 'Trà sữa Ô long béo',
        categorySlug: 'tra-sua',
        description: 'Trà ô long thơm ngất ngây.',
        basePrice: 40000,
        likes: 310,
    },
    {
        name: 'Trà sữa Khoai môn',
        categorySlug: 'tra-sua',
        description: 'Hương vị khoai môn đặc trưng.',
        basePrice: 38000,
        likes: 215,
    },
    {
        name: 'Trà sữa Thái xanh',
        categorySlug: 'tra-sua',
        description: 'Màu xanh bắt mắt, vị trà thơm.',
        basePrice: 35000,
        likes: 560,
    },

    {
        name: 'Trà Đào Cam Sả',
        categorySlug: 'tra-trai-cay',
        description: 'Món trà quốc dân thanh mát.',
        basePrice: 39000,
        likes: 1100,
    },
    {
        name: 'Trà Vải Nhiệt Đới',
        categorySlug: 'tra-trai-cay',
        description: 'Vải thiều ngọt thanh cực đã.',
        basePrice: 38000,
        likes: 450,
    },
    {
        name: 'Trà Dâu Tây Đá Tuyết',
        categorySlug: 'tra-trai-cay',
        description: 'Dâu tây đỏ mọng đầy vitamin C.',
        basePrice: 41000,
        likes: 380,
    },
    {
        name: 'Trà Xoài Macchiato',
        categorySlug: 'tra-trai-cay',
        description: 'Lớp kem béo trên nền trà xoài.',
        basePrice: 45000,
        likes: 670,
    },
    {
        name: 'Trà Chanh Dây Hạt Chia',
        categorySlug: 'tra-trai-cay',
        description: 'Giúp giải nhiệt mùa hè.',
        basePrice: 32000,
        likes: 290,
    },

    {
        name: 'Matcha Latte Nguyên Bản',
        categorySlug: 'matcha-latte',
        description: 'Bột matcha xay mịn đậm đà.',
        basePrice: 48000,
        likes: 520,
    },
    {
        name: 'Matcha Đậu Đỏ',
        categorySlug: 'matcha-latte',
        description: 'Kết hợp đậu đỏ ngọt bùi.',
        basePrice: 52000,
        likes: 340,
    },
    {
        name: 'Sữa Chua Dâu Tây',
        categorySlug: 'matcha-latte',
        description: 'Sữa chua tốt cho tiêu hóa.',
        basePrice: 45000,
        likes: 410,
    },
    {
        name: 'Sữa Chua Xoài Chín',
        categorySlug: 'matcha-latte',
        description: 'Xoài cát hòa quyện sữa chua.',
        basePrice: 45000,
        likes: 280,
    },
    {
        name: 'Cacao Latte Hạt Dẻ',
        categorySlug: 'matcha-latte',
        description: 'Chocolate hạt dẻ béo nồng.',
        basePrice: 42000,
        likes: 190,
    },

    {
        name: 'Oreo Choco Đá Xay',
        categorySlug: 'da-xay',
        description: 'Món đá xay yêu thích của giới trẻ.',
        basePrice: 45000,
        likes: 890,
    },
    {
        name: 'Matcha Cookie Đá Xay',
        categorySlug: 'da-xay',
        description: 'Matcha giòn tan cùng cookie.',
        basePrice: 49000,
        likes: 310,
    },
    {
        name: 'Cafe Mocha Đá Xay',
        categorySlug: 'da-xay',
        description: 'Vị đắng cafe kết hợp đá tuyết.',
        basePrice: 47000,
        likes: 430,
    },
    {
        name: 'Socola Bạc Hà Đá Xay',
        categorySlug: 'da-xay',
        description: 'Mát lạnh sảng khoái cực độ.',
        basePrice: 48000,
        likes: 370,
    },
    {
        name: 'Dâu Tây Kem Phô Mai Đá Xay',
        categorySlug: 'da-xay',
        description: 'Dâu tây thơm béo cùng phô mai.',
        basePrice: 55000,
        likes: 720,
    },
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Product.deleteMany();
        await Category.deleteMany();
        await Topping.deleteMany();
        await User.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);

        await User.create({
            username: 'admin',
            email: 'admin@teamango.com',
            password: adminPassword,
            fullname: 'Admin Tea Mango',
            role: 'ADMIN',
        });

        const createdCategories = await Category.insertMany(CATEGORIES);
        const createdToppings = await Topping.insertMany(TOPPINGS);

        const categoryMap = {};
        createdCategories.forEach((c) => {
            categoryMap[c.slug] = c._id;
        });

        const toppingMap = {};
        createdToppings.forEach((t) => {
            toppingMap[t.code] = t._id;
        });

        const defaultToppings = [toppingMap.PEARL, toppingMap.GOLD_PEARL, toppingMap.CHEESE, toppingMap.PUDDING].filter(
            Boolean,
        );

        const productsToInsert = SEED_PRODUCTS.map((p) => ({
            ...p,
            category: categoryMap[p.categorySlug],
            image: `/uploads/${IMAGE_MAP[p.name]}`,
            status: 'AVAILABLE',
            sizes: [
                { code: 'S', label: 'Small', extra: -5000 },
                { code: 'M', label: 'Medium', extra: 0 },
                { code: 'L', label: 'Large', extra: 10000 },
            ],
            toppings: defaultToppings,
            sugarLevels: [0, 30, 50, 70, 100],
            iceLevels: [0, 30, 50, 70, 100],
        }));

        await Product.insertMany(productsToInsert);

        console.log('✨ Database Updated with categories, toppings and 20+ products!');
        process.exit();
    } catch (error) {
        console.error(`❌ Seed Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
