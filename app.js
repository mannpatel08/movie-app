const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const movieRoutes = require('./routes/movieRoutes');
app.use('/', movieRoutes);

const PORT = process.env.PORT || 8300;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});