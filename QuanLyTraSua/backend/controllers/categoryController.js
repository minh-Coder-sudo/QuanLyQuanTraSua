import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Lấy toàn bộ danh mục
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Thêm danh mục mới (Admin)
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    const categoryExists = await Category.findOne({ slug });

    if (categoryExists) {
      return res.status(400).json({ message: 'Slug danh mục đã tồn tại!' });
    }

    const category = new Category({ name, slug, image });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cập nhật danh mục (Admin)
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = req.body.name || category.name;
      category.slug = req.body.slug || category.slug;
      category.image = req.body.image || category.image;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Danh mục không tồn tại!' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Xóa danh mục (Admin)
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
      const productCount = await Product.countDocuments({ category: req.params.id });
      if (productCount > 0) {
        return res.status(400).json({ 
          message: `Không thể xóa! Hiện đang có ${productCount} sản phẩm thuộc danh mục này.` 
        });
      }

      await category.deleteOne();
      res.json({ message: 'Đã xóa danh mục thành công!' });
    } else {
      res.status(404).json({ message: 'Danh mục không tồn tại!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
