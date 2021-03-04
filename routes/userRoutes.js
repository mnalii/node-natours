const express = require('express');
// const multer = require('multer');
const {
  getAllUsers,
  createUser,
  getUser,
  uploadUserPhoto,
  resizeUserPhoto,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe
} = require('../controllers/userController');
const authController = require('../controllers/authController');

// const upload = multer({ dest: 'public/img/users' });

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
// router.patch('/updateMe', upload.single('photo'), updateMe);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

router.use(authController.restrictTo('admin'));

router.get('/me', getMe, getUser);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
