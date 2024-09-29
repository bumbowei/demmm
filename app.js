const express = require('express');
const morgan = require('morgan');

const tourRoute = require('./routes/tourRoutes.js');
const userRoute = require('./routes/userRoutes.js');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
//1) Middle
// console.log(process.env.USERNAME);
// console.log(
//   'Loaded environment variables:',
//   process.env.DATABASE,
//   process.env.DATABASE_PASSWORD,
// );
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.requestTime)
  // console.log(req.headers) it work
  next();
});

// app.use((req, res, next) => {
//     console.log('hello form the middleware')
//     next();
// })

//work on terminal
// var bodyParser = require('body-parser');
// const { get } = require('https');
// app.use(bodyParser.urlencoded())
// app.use(bodyParser.json())

//          handing basic program
// app.get('/', (req, res) => {
//     res.status(200).send('something of shit you can get on here 😒😒');
// })
// app.get('/', (req, res) => {
//     res
//     .status(200)
//     .json({message:'something of shit you can get on here 😒😒', app:' app.js'});
// })
// app.post('/', (req, res) => {
//     res.send('now you can post of shit on this app..😉')
// })

//3) Routes
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find`
  // })
});

app.use(globalErrorHandler);

module.exports = app;
