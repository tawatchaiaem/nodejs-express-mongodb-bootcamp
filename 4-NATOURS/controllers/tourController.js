//const fs = require('fs');
const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//   );

// exports.checkID = (req, res,  next, val) =>{
//   console.log(`Tour is id: ${val}`);

//   if(req.params.id * 1 > tours.length){
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// }

// exports.checkBody = (req, res, next) => {
//   if(!req.body.name || !req.body.price){
//     return res.status(400).json({
//       status:'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// }

exports.getAllTours = async (req, res) => {
  try {

    // BUILD QUERY
    // 1A) Filtering
    const queryObject = { ...req.query };
    const exculdedFields = ['page', 'sort', 'limit', 'fields'];
    exculdedFields.forEach(el => delete queryObject[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(req.query.sort);
    }else{
      query = query.sort('-createdAt')
    }

    // 3) Field limiting
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }else{
      query = query.select('-__v');
    }

    // 4) Pagination
    const page = req.query.page *1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;0

    query = query.skip(skip).limit(limit);

    if(req.query.page){
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error('This page does not exits');
    }

    // { difficulty: 'easy', duration: { $gte: 5 } }
    // { difficulty: 'easy', duration: { gte: '5' } }
        // { difficulty: 'easy', duration: { gte: '5' } }

    // EXCUTE QUERY
    
    const tours = await query;

    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status().json({
      status: 'fail',
      message: err,
    });
  }
  // console.log(req.params);
  // const id = req.params.id * 1;

  // const tour = tours.find(el => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   results: tours.length,
  //   data: {
  //     tours: tour
  //   }
  // });
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'succees',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }

  // //console.log(req.body);

  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);

  // tours.push(newTour);

  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   err => {
  //     res.status(201).json({
  //       status: 'succees',
  //       data: {
  //         tour: newTour
  //       }
  //     });
  //   }
  // );
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
