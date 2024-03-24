const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect("mongodb+srv://sarpalkunal7:kunal1234@cluster1.pc6dcst.mongodb.net/pintrest");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,x
  },
  password: {
    type: String
  },
  posts:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }],
  dp: {
    type: String, // Assuming dp is a URL or a reference to an image
   
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    trim: true,
  },
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);

