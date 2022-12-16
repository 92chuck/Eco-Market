const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    dropDups: true,
    required: 'username is required',
    min: [4, 'Must be at least 4, got {VALUE}'],
    max: [10, 'Must be less than 10, got {VALUE}'],
  },
  email: {
    type: String,
    unique: true,
    dropDups: true,
    required: 'email is required',
    min: [10, 'Must be at least 4, got {VALUE}'],
    max: [40, 'Must be less than 10, got {VALUE}'],
  },
  password: {
    type: String,
    unique: true,
    dropDups: true,
    required: 'password is required',
    min: [4, 'Must be at least 4, got {VALUE}'],
    max: [12, 'Must be less than 10, got {VALUE}'],
  },
  isAdmin: { type: Boolean, default: false },
  favorites: [{ type: refType, ref: 'Product' }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
