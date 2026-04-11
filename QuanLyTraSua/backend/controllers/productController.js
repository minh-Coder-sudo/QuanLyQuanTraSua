import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Topping from '../models/Topping.js';

// @desc    Lấy toàn bộ sản phẩm
// @route   GET /api/products
export const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        const query = {};

        if (category && category !== 'all') {
            query.categorySlug = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).populate('category').populate('toppings');

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lấy chi tiết 1 sản phẩm
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('toppings');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Thêm sản phẩm mới (Admin)
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();

        const populatedProduct = await Product.findById(createdProduct._id).populate('category').populate('toppings');

        res.status(201).json(populatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Cập nhật sản phẩm (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            Object.assign(product, req.body);
            await product.save();

            const updatedProduct = await Product.findById(product._id).populate('category').populate('toppings');

            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Xóa sản phẩm (Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Đã xóa sản phẩm thành công!' });
        } else {
            res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
