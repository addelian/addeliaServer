const express = require('express');
const bodyParser = require('body-parser');
const Article = require('../models/article');

const authenticate = require('../authenticate');

const articleRouter = express.Router();

articleRouter.use(bodyParser.json());

articleRouter.route('/')
.get((req, res, next) => {
    Article.find()
    .populate('comments.author')
    .then(articles => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(articles);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Article.create(req.body)
    .then(article => {
        console.log('Article Created ', article);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(article);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /articles');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Article.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

articleRouter.route('/:articleId')
.get((req, res, next) => {
    Article.findById(req.params.articleId)
    .populate('comments.author')
    .then(article => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(article);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /articles/${req.params.articleId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Article.findByIdAndUpdate(req.params.articleId, {
        $set: req.body
    }, { new: true })
    .then(article => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(article);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Article.findByIdAndDelete(req.params.articleId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

articleRouter.route('/:articleId/comments')
.get((req, res, next) => {
    Article.findById(req.params.articleId)
    .populate('comments.author')
    .then(article => {
        if (article) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(article.comments);
        } else {
            err = new Error(`Article ${req.params.articleId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Article.findById(req.params.articleId)
    .then(article => {
        if (article) {
            req.body.author = req.user._id;
            article.comments.push(req.body);
            article.save()
            .then(article => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(article);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Article ${req.params.articleId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /articles/${req.params.articleId}/comments`);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Article.findById(req.params.articleId)
    .then(article => {
        if (article) {
            for (let i = (article.comments.length-1); i >= 0; i--) {
                article.comments.id(article.comments[i]._id).remove();
            }
            article.save()
            .then(article => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(article);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Article ${req.params.articleId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

articleRouter.route('/:articleId/comments/:commentId')
.get((req, res, next) => {
    Article.findById(req.params.articleId)
    .populate('comments.author')
    .then(article => {
        if (article && article.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(article.comments.id(req.params.commentId));
        } else if (!article) {
            err = new Error(`Article ${req.params.articleId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /articles/${req.params.articleId}/comments/${req.params.commentId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Article.findById(req.params.articleId)
    .then(article => {
        if (article && article.comments.id(req.params.commentId)) {
            if (req.body.rating) {
                article.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.text) {
                article.comments.id(req.params.commentId).text = req.body.text;
            }
            article.save()
            .then(article => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(article);
            })
            .catch(err => next(err));
        } else if (!article) {
            err = new Error(`Article ${req.params.articleId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Article.findById(req.params.articleId)
    .then(article => {
        if (article && article.comments.id(req.params.commentId)) {
            article.comments.id(req.params.commentId).remove();
            article.save()
            .then(article => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(article);
            })
            .catch(err => next(err));
        } else if (!article) {
            err = new Error(`Article ${req.params.articleId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = articleRouter;