const express = require('express');
const bodyParser = require('body-parser');
const Tour = require('../models/tour');
const authenticate = require('../authenticate');

const tourRouter = express.Router();

tourRouter.use(bodyParser.json());

tourRouter.route('/')
.get((req, res, next) => {
    Tour.find()
    .then(tour => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tour);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Tour.create(req.body)
    .then(tour => {
        console.log('Tour Date Created ', tour);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tour);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /tour');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Tour.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

tourRouter.route('/:tourId')
.get((req, res, next) => {
    Tour.findById(req.params.tourId)
    .then(tour => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tour);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /tour/${req.params.tourId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Tour.findByIdAndUpdate(req.params.tourId, {
        $set: req.body
    }, { new: true })
    .then(tour => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(tour);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Tour.findByIdAndDelete(req.params.tourId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Note that delete will only be allowed by admin

module.exports = tourRouter;