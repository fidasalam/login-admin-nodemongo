// Load environment variables
require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');


//Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));


app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    next();
  });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes setup
const indexRouter = require('./routes/index.js');
app.use('/route', indexRouter);

app.get('/', (req, res) => {
    res.render('base');
});

// Other app configurations

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Listening to request on http://localhost:${PORT}`);
});
