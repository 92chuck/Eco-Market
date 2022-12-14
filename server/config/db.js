const mongoose = require('mongoose');
const { MONGO_URL } = process.env;
mongoose.set('strictQuery', true);

mongoose.connect(MONGO_URL, (error) => {
  if (error) console.log(error);
  else console.log('Connected to DB.');
});

module.exports = mongoose.connection;
