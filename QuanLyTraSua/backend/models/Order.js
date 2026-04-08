import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Khách lẻ không cần đăng nhập
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    priceAtPurchase: Number,
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    selectedSize: {
      code: String,
      label: String,
      extra: Number
    },
    selectedToppings: [{
      code: String,
      name: String,
      price: Number
    }],
    sugar: Number,
    ice: Number
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'BANK_TRANSFER', 'E_WALLET'],
    default: 'CASH'
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
    default: 'COMPLETED' // Mặc định là Hoàn thành khi bán tại quầy
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
