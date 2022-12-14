const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: 'This field is required',
  },
  brand: { type: refType, ref: 'Brand' },
  type: { type: refType, ref: 'Type' },
});

const Product = mongoose.model('Product', ProductSchema);

ProductSchema.index({ name: 'text' });

module.exports = Product;
