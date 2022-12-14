const app = require('./app');
const connection = require('./server/config/db');
const PORT = process.env.PORT || 3000;

connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server is up and running on: http://localhost:${PORT}`);
  });
});
