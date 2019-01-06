const express = require('express');;
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
// load profile model
const Profile = require('../../models/Profile');

// load user moderl
const User = require('../../models/User');



router.get('/test', (req, res) => {
    res.json({
        msg: "User profile"
    })
});

//@route GET api/profile
//@desc get current user
//@access private

router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            if (!profile) {
                return res.status(404).json({
                    noprofile: "there is no profile"
                })
            }
            res.json(profile)
        }).catch(err => res.status(404).json(err))
})

//@route Post api/profile
//@desc create current user
//@access private

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.company) profileFields.company = req.body.company
    if (req.body.website) profileFields.website = req.body.website
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.status) profileFields.status = req.body.status
    if (req.body.bio) profileFields.bio = req.body.bio
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    Profile.findOne({
            user: req.user.id //loged in user
        })
        .then(profile => {
            if (profile) {
                //if profile exist then update the profile
                Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                }).then(profile => res.json(proflie)).catch(err => {
                    console.log("error is "+ err);
                });
            } else {
                // Create profile

                new Profile(profileFields).save().then(profile => {
                    res.json(profile)

                })
            }
        })
});
router.post('/education', passport.authenticate('jwt', {
    session: false
}))
router.delete(
    '/',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        Profile.findOneAndRemove({
            user: req.user.id
        }).then(() => {
            User.findOneAndRemove({
                _id: req.user.id
            }).then(() =>
                res.json({
                    success: true
                })
            );
        });
    }
);
module.exports = router;