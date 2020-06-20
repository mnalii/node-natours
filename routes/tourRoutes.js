const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  updateTour,
  deleteTour
} = require('../controllers/tourController');

const router = express.Router();

// router.param('id');

// Aliasing API: top 5 best tour with cheap price
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
