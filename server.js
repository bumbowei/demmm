const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app.js');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {})
  .then((con) => {
    // console.log(con.connection);
    // console.log('DB connection successful!');
  })
  .catch((err) => console.log('DB connection error:', err));

// const testTour = new Tour({
//   name: 'End tasks',
//   rating: 4.3,
//   price: 54,
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('Error 💥:', err);
//   });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // console.log(process.argv);
  console.log(`App running in ${process.env.NODE_ENV} mode on port ${port}...`);
});
