const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    dropDups: true,
    required: 'This field is required',
  },
  email: {
    type: String,
    unique: true,
    dropDups: true,
    required: 'This field is required',
  },
  password: {
    type: String,
    unique: true,
    dropDups: true,
    required: 'This field is required',
  },
  isAdmin: { type: Boolean, default: false },
  favorites: [{ type: refType, ref: 'Product' }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
