const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  name: {
    type: String,
    required: 'This field is required',
  },
});

const Type = mongoose.model('Type', TypeSchema);

module.exports = Type;
