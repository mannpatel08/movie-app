const Movie = require('../models/movieModel');
const path = require('path');
const fs = require('fs');

exports.getHome = async (req, res) => {
    try {
        const movies = await Movie.find().limit(10).sort({ createdAt: -1 });
        res.render('home', {
            movies,
            title: 'Netflix India – Watch TV Shows Online, Watch Movies Online'
        });
    } catch (error) {
        console.error(error);
        res.render('home', {
            movies: [],
            title: 'Netflix'
        });
    }
};

exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.render('index', {
            movies,
            title: 'Netflix - Browse'
        });
    } catch (error) {
        console.error('Controller Error:', error);
        res.render('index', {
            movies: [],
            title: 'Netflix - Browse'
        });
    }
};

exports.addMovieForm = (req, res) => {
    res.render('addMovie', { title: 'Netflix - Add Movie' });
};

exports.createMovie = async (req, res) => {
    try {
        const { title, description, genre, rating, releaseYear } = req.body;

        if (!req.file) {
            return res.status(400).send('Please upload an image');
        }

        const newMovie = new Movie({
            title,
            description,
            genre,
            rating,
            releaseYear,
            image: req.file.filename
        });

        await newMovie.save();
        res.redirect('/browse');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding movie');
    }
};

exports.editMovieForm = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        res.render('editMovie', {
            movie,
            title: 'Netflix - Edit Movie'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const { title, description, genre, rating, releaseYear } = req.body;

        let updateData = {
            title,
            description,
            genre,
            rating,
            releaseYear
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        await Movie.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/browse');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating movie');
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        const imagePath = path.join(__dirname, '../public/assets/uploads', movie.image);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Movie.findByIdAndDelete(req.params.id);
        res.redirect('/browse');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting movie');
    }
};