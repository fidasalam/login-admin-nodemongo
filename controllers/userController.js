const collection = require('../models/userModel');
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();
const { render } = require("ejs");

const SALT_ROUNDS = 10;

const userController = {
    getSignup: (req, res) => {
        res.render('signup');
    },

    postSignup: async (req, res) => {
        const data = {
            firstname: req.body.firstname.trim(),
            lastname: req.body.lastname.trim(),
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        };

        try {
            const existingUser = await collection.findOne({ email: data.email });

            if (existingUser) {
                return res.render('signup', { result: "User with this email already exists." });
            }

            const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
            data.password = hashedPassword;

            await collection.insertMany([data]);
            req.session.data = data.email;
            res.render('index', { data: req.session.data });

        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: "Error signing up." });
        }
    },

    getLogin: (req, res) => {
        res.render('base');
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            req.session.user = email;

            const foundUser = await collection.findOne({ email });

            if (foundUser) {
                // Regular user found in the database
                const match = await bcrypt.compare(password, foundUser.password);

                if (match) {
                    res.cookie('sessionId', req.sessionID, {
                        maxAge: 3600000,
                        httpOnly: true
                    });
                    res.render('index', { data: req.session.user });
                    return;
                }
            }

            const admins = [
                { email: 'admin1@example.com', password: 'admin1' },
                { email: 'admin2@example.com', password: 'admin2' }
            ];

            const foundAdmin = admins.find(admin => admin.email === email && admin.password === password);

            if (foundAdmin) {
                const userlist = await collection.find();
                res.render('adminhome', { users: userlist, admin: req.session.user });
                return;
            }

            res.render('base', { error: "Invalid credentials." });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: "Error during login." });
        }
    },
    logout: (req, res) => {
        try {
            if (req.session) {
                // Destroy the session
                req.session.destroy((err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error");
                    } else {
                        // Clear the session cookie
                        res.clearCookie('sessionId');
                        res.render('base', { title: "Express", logout: "Logout Successfully..!" });
                    }
                });
            } else {
                // If there is no session, consider the user as logged out and render the base page
                res.render('base', { title: "Express", logout: "Logout Successfully..!" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Error");
        }
    },

    adminHome: async (req, res) => {
        try {
            const userlist = await collection.find();
            res.render('adminhome', { users: userlist, admin: req.session.user });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: "Error fetching admin home." });
        }
    },
    getSearch: async (req, res) => {
        try {
            res.render('search', { admin: req.session.user });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: "Error rendering search page." });
        }
    },

    postSearch: async (req, res) => {
        const username = req.body.user;

        try {
            const foundUser = await collection.findOne({ firstname: { $regex: new RegExp(username, 'i') } });

            if (foundUser) {
                res.render('search', { result: foundUser });
            } else {
                res.render('search', { result: 'User not found.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: "Error searching user." });
        }
    },

    getAddUser: (req, res) => {
        res.render('adduser', { admin: req.session.user });
    },

    postAddUser: async (req, res) => {
        try {
            const data = {
                firstname: req.body.firstname.trim(),
                lastname: req.body.lastname.trim(),
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password
            };

            const existingUser = await collection.findOne({ email: data.email });

            if (existingUser) {
                return res.render('adduser', { result: "User with this email already exists." });
            }

            const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
            data.password = hashedPassword;

            await collection.insertMany([data]);

            res.render('adduser', { result: "User Added" });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: "Error adding user." });
        }
    },
    getUpdateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await collection.findById(userId);
            res.render('updateuser', { user, admin: req.session.user });
        } catch (error) {
            console.log('Error:', error);
            res.status(500).render('error', { error: "Error fetching user for update." });
        }
    },

    postUpdateUser: async (req, res) => {
        const { userId, email, firstname, lastname, phone } = req.body;

        try {
            const user = await collection.findOne(userId);

            if (!user) {
                return res.render('updateuser', { result: "User not found." });
            }


           
            const existingUserWithEmail = await collection.findOne({ email });

            if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
                return res.render('updateuser', {user, result: "Email already exists for another user." });
            }

            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.phone = phone;

            await user.save();

            res.render('updateuser', { user, result: "User information updated successfully!" });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { error: "Error updating user information." });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            await collection.findByIdAndDelete(userId);
            res.redirect('/route/adminhome');
        } catch (error) {
            console.log("Error:", error);
            res.status(500).render('error', { error: "Error deleting user." });
        }
    },

    adminLogout: (req, res) => {
        try {
            if (req.session) {
                // Destroy the session
                req.session.destroy((err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error");
                    } else {
                        // Clear the session cookie
                        res.clearCookie('sessionId');
                        res.render('base', { title: "Express", logout: "Logout Successfully..!" });
                    }
                });
            } else {
                // If there is no session, consider the user as logged out and render the base page
                res.render('base', { title: "Express", logout: "Logout Successfully..!" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Error");
        }
    },

    errorPage: (req, res) => {
        res.render('error', { error: "An error occurred." });
    },
    
    logoutsuccess: (req, res) => {
        res.render('logout-success');
    }
};



module.exports = userController;