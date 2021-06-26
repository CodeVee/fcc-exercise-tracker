const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  log: [{
    description: String,
    duration: Number,
    date: Date
  }]
});

const User = mongoose.model("User", userSchema);

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route('/api/users')
.get((req, res) => {
  User.find()
      .select({log: 0, __v: 0})
      .exec((err, data) => {
        if (err) return res.json({error: err});
        res.json(data);
      })
})
.post((req, res) => {
  const user = new User({username: req.body.username});
  user.save((err, data) => {
    if (err) return res.json({error: err});
    
    res.json({"username": data.username, "_id": data._id});
  });
});

app.post('/api/users/:_id/exercises', (req, res) => {
  
  
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
