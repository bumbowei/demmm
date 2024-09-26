// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

const CatchAsync = require('../utils/catchAsync')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// const { query } = require('express');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'false',
//       message: 'Invalid ID😘👌',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price ne',
//     });
//   }
//   next();
// };

exports.getAllTours = CatchAsync(async (req, res) => {
    console.log(req.query);

    //built query
    //1) filtering
    /**
     * req.query do client gửi về server(gồm key'page', 'sort', 'limit', 'fields'),
     * queryObj = { ...req.query } là bản sao của req.query, nên khi
     * queryObj xóa (gồm key'page', 'sort', 'limit', 'fields') thì sẽ k lien đới req.query(gốc)
     */
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // //2)advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // let query = Tour.find(JSON.parse(queryStr));

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // const tours = await Tour.find({
    //   duration: 5,
    //   price: 397,
    // });

    //2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   //   console.log(sortBy)
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }
    // //3) Field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }
    // //4)Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }

    /**
     * EXECUTE QUERY
     */
    const features = new APIFeatures(Tour.find(), req.query) //EXECUTE QUERY
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    // const tours = await query;


    //SEND RES
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } 
  // catch (error) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
);

exports.getTour = CatchAsync(async (req, res) => {
  //   const id = req.params.id * 1;

  //   const tour = tours.find((el) => el.id === id); //true
  //   if (!tour)
  //     return res.status(404).json({
  //       status: 'false',
  //       message: 'Invalid ID😘👌',
  //     });

  //   res.status(200).json({
  //     status: 'success 😁',
  //     data: {
  //       tour,
  //     },
  //   });

    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id: req.params.id})
    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
      status: 'success 😁',
      data: {
        tour,
      },
    });
  
  // catch (error) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

exports.createNewTour = CatchAsync(async (req, res) => {
  //   const newID = tours[tours.length - 1].id + 1;
  //   // eslint-disable-next-line prefer-object-spread
  //   const newTours = Object.assign({ id: newID }, req.body);
  //   tours.push(newTours);
  //   fs.writeFile(
  //     `${__dirname}/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {
  //       res.status(201).json({
  //         status: 'success',
  //         data: {
  //           tour: newTours,
  //         },
  //       });
  //     },
  //   );

  //   const newTour = new Tour{()};
  //   newTour.save();
    const newTour = await Tour.create(req.body);

    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

exports.updateTour = CatchAsync(async (req, res) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});
exports.deleteTour = CatchAsync(async (req, res) => {

    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});
