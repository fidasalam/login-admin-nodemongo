const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup route
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);

// Login route
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

// Logout route
router.get('/logout', userController.logout);

// Admin home route
router.get('/adminhome', userController.adminHome);

// Search route
router.get('/search', userController.getSearch);
router.post('/search', userController.postSearch);

// Add user route
router.get('/adduser', userController.getAddUser);
router.post('/adduser', userController.postAddUser);

// Update user route
router.get('/updateuser/:id', userController.getUpdateUser);
router.post('/updateuser', userController.postUpdateUser);

// Delete user route
router.get('/delete/:id', userController.deleteUser);

// Admin logout route
router.get('/adminlogout', userController.adminLogout);

// Error route
router.get('/error', userController.errorPage);

router.get('/logout-success', userController.logoutsuccess);

module.exports = router;
