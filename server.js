const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLER EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  console.error(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_TEST.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

console.log(DB);

// if (process.env.NODE_ENV === 'development') {
//   DB = process.env.DATABASE_LOCAL;
// }

const app = require('./app');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then((con) => {
    console.log(con.connection.host);
    console.log('Database connected');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(
    `App is running on port ${port} in mode: ${process.env.NODE_ENV}`
  );
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
