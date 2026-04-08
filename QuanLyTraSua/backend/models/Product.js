import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  categorySlug: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  basePrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'OUT_OF_STOCK'],
    default: 'AVAILABLE'
  },
  sizes: [{
    code: { type: String, required: true },
    label: { type: String, required: true },
    extra: { type: Number, default: 0 }
  }],
  toppings: [{
    type: String // Danh sách các Topping codes có sẵn cho sp này
  }],
  sugarLevels: [{
    type: Number,
    default: [0, 50, 100]
  }],
  iceLevels: [{
    type: Number,
    default: [0, 50, 100]
  }],
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
