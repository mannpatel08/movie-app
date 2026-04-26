const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
    }
});

router.get('/', movieController.getHome);
router.get('/browse', movieController.getMovies);
router.get('/add', movieController.addMovieForm);
router.post('/add', upload.single('image'), movieController.createMovie);
router.get('/edit/:id', movieController.editMovieForm);
router.post('/update/:id', upload.single('image'), movieController.updateMovie);
router.get('/delete/:id', movieController.deleteMovie);

module.exports = router;
