const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//Comments Model

const Post = require('../../models/Post');
const Comment = require('../../models/Comments');

router.get('/comment/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Post.findById(req.param.id).then((post) => res.status(200).send(post)).catch(err => console.log(err))
})


router.post('/comment/:id', passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        var user = req.user.id;
        console.log(user);
        Post.findById(req.params.id)
        

    });


module.exports = router;