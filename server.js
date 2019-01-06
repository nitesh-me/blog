const express = require('express');
const passport = require('passport')
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
// DB config
const db = require('./config/keys').mongoURI;
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const comment = require('./routes/api/comments')
// connect to mongodb
mongoose.connect(db,{ useNewUrlParser: true })
    .then(()=>console.log("mongodb connected"))
    .catch(err=>{console.log(err);
    });
// passport middleware
app.use(passport.initialize());
//passport config
require('./config/passport')(passport);

const port = process.env.PORT || 5000
app.get('/',(req,res)=>{
    res.send("hello ")
});
// Use routes
app.use('/api/users',users)
app.use('/api/profile',profile)
app.use('/api/posts',posts)
app.use('/api/post', comment)


app.listen(port,()=>{
    console.log("listening to port "+ port);
})