const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: {
    type: String,
    required: 'This field is required',
  },
});

const Brand = mongoose.model('Brand', BrandSchema);

module.exports = Brand;
