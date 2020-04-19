//const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

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

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  
  next();
};

exports.getAllTours = catchAsync( async (req, res) => {

    // EXCUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
      
    const tours = await features.query;
    
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
});

exports.getTour = catchAsync(async (req, res) => {

    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });

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
});

exports.createTour = catchAsync(async (req, res, next) => {
  
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'succees',
    data: {
      tour: newTour,
    },
  });
  
  // try {
  //   // const newTour = new Tour({});
  //   // newTour.save();

   
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }

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
});

exports.updateTour = catchAsync( async (req, res) => {

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

});

exports.deleteTour = catchAsync( async (req, res) => {

    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
 
});

exports.getTourStats = catchAsync( async (req, res) => {
  
    const stats = await Tour.aggregate([
      {
        $match: {ratingsAverage: { $gte: 4.5}}
      },
      {
        $group: {
          _id: {$toUpper: '$difficulty'},
          //_id: '$difficulty',
          numTour: {$sum: 1},
          numRatings: { $sum: '$ratingsQuantity'},
          avgRating: { $avg : '$ratingsAverage'},
          avgPrice: { $avg:  '$price'},
          minPrice: { $min: '$price'},
          maxPrice: { $max: '$price'},
        }
      },
      {
        $sort: { avgPrice: 1}
      },
      // {
      //   $match: { _id: { $ne: 'EASY'}}
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data:{
        stats
      }
    });

  });

exports.getMonthlyPlan = catchAsync( async (req, res) => {

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match:{
          startDates: { 
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group :{
          _id: {$month: '$startDates'},
          numTourStarts: {$sum:1},
          tours: { $push: '$name'}

        }
      },
      {
        $addFields: { month: '$_id' } 
      },
      {
        $project  : {_id : 0}
      },
      {
        $sort :{ numTourStarts: -1 }
      },
      {
        $limit : 6
      }
    ]);

    res.status(200).json({
      status:'success',
      data: {
        plan
      }
    });

});