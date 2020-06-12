const express = require('express');
const bodyParser = require('body-parser');

const tourRouter = express.Router();

tourRouter.use(bodyParser.json());

tourRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Populate with list of all tour dates');
})
.post((req, res) => {
    res.end(`Will add the tour date: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /tour');
})
.delete((req, res) => {
    res.end('Deleting all tour dates');
});
// Note that delete will only be allowed by admin
module.exports = tourRouter;