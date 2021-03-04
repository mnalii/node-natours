const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  aliasTopTours,
  uploadTourImages,
  resizeTourImages,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistance,
  updateTour,
  deleteTour
} = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id');
router.use('/:tourId/reviews', reviewRouter);

// Aliasing API: top 5 best tour with cheap price
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
//  /tours-distance?distance=233&center=-40,45,unit=miles
//  /tours-distance/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(getDistance);
router
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    createTour
  );

router
  .route('/:id')
  .get(getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/94887fda

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
