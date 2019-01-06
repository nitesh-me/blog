const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

/** 
 * Dummy api endpoint to be deleted
 */
router.get('/test', (req, res) => res.json({
  msg: 'Posts Works'
}));


/**
 * api endpoint for posts/
 * returns array of posts sorted by descending order of their published date
 */
router.get('/', (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
      nopostsfound: 'No posts found'
    }));
});

/**
 * 
 */
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({
          nopostfound: 'No post found with that ID'
        })
      }
    })
    .catch(err =>
      res.status(404).json({
        nopostfound: 'No post found with that ID'
      })
    );
});


router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    user: req.user.id
  })
  newPost.save().then(post => res.json(post));
})


router.delete(
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => { 
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({
                notauthorized: 'User not authorized'
              });
          }

          // Delete
          post.remove().then(() => res.json({
            success: true
          }));
        })
        .catch(err => res.status(404).json({
          postnotfound: 'No post found'
        }));
    });
  }
);


module.exports = router;