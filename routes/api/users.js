const express = require('express');;
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys');
const passport = require('passport')
const User = require('../../models/User');
//@route GET api/users/test
//@desc test use route
//@access public

router.get('/test', (req, res) => {
    res.json({
        msg: "User works"
    })
});

//@route GET api/users/register
//@desc  use register route
//@access public

router.post('/register', (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    email: "Email alreadyexist"
                })
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))

                    })
                })
            }
        })

})
//@route GET api/users/login
//@desc login user
//@access public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(password);
    //find user by email
    User.findOne({
            email
        })
        .then(user => {
            //check for user
            if (!user) {
                return res.status(404).json({
                    email: "User is not registered"
                })

            }
            //check for password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // user matched
                        // creating payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                        }
                        //sign token
                        jwt.sign(payload, keys.secretOrKey, {
                                expiresIn: 360000
                            },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            })

                    } else {
                        return res.status(400).json({
                            password: "password incorrect"
                        })
                    }
                });
        });
});


router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})


module.exports = router;