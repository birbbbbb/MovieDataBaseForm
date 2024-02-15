//Libraries
const path = require('path');
const express = require('express');
const multer  = require('multer');
const {check, checkSchema, validationResult} = require('express-validator');

//Setup defaults for script
const app = express();
const storage = multer.diskStorage({
    //Logic where to upload the file
    destination: (request, file, callback) => {
        callback(null, 'uploads/');
    },
    //Logic to name the file when uploaded
    filename: (request, file, callback) => {
        callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.parse(file.originalname).ext);
    }
});
//Multer is a middleware that handles file uploads
const upload = multer({
    storage: storage,
    //Validation for file upload
    fileFilter: (request, file, callback) => {
        const allowedFileMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
        callback(null, allowedFileMimeTypes.includes(file.mimetype));
    }
});
const port = 80 //Default port to http server

//The * in app.* needs to match the method type of the request
app.post(
    '/',
    //Should be the name of the 'poster' field in the request
    upload.fields([{ name: 'poster', maxCount: 1 }, {name: 'video', maxCount: 1}]),
    //Validation for 'name' field in request
    check('title', 'Please enter a movie title').isLength({ min: 1 }),
    //Validation for 'genre' field in request
    check('genre', "Please select a genre.")
        .isIn(['action', 'comedy', 'horror', 'romance', 'sifi']),
    //Validation for 'rating' field in request
    check('rating', 'Please enter a rating between 1 and 5.')
        .isInt({ min: 1, max: 5 }),
    //Validation for 'date' field in request
    check('date', 'Please enter a valid date.')
        .isISO8601(),
    //Validation for 'runtime' field in request
    check('runtime', 'Please enter a valid runtime.')
        .isInt({ min: 1 }),
    //Validation for 'director' field in request
    check('director', 'Please enter a director.')
        .isLength({ min: 1 }),
    //Validation for 'actors' field in request
    check('actors', 'Please enter at least one actor.')
        .isLength({ min: 1 }),
    //Validation for 'summary' field in request
    check('summary', 'Please enter a summary.')
        .isLength({ min: 1 }),
    //Validation for 'trailer' field in request
    check('trailer', 'Please enter a valid URL.')
        .isURL(),

    //Validation for 'poster' field in request
    checkSchema({
        'poster': {
            custom: {
                options: (value, { req, path }) => !!req.files[path],
                errorMessage: 'Please upload an image file.',
            },
        },
        'video': {
            custom: {
                options: (value, { req, path }) => !!req.files[path],
                errorMessage: 'Please upload a video file.',
            },
        },
    }),
    (request, response) => {
        //Validate request; If there any errors, send 400 response back
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response
                .status(400)
                .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                });
        } else{
            //Default response object
            return response
            .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
            .json({ message: 'Request fields and files are valid.', data: [request.body], files: request.files});
        }

        
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})