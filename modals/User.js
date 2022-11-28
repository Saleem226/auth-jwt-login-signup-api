const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        minlength: [6, 'Minimum password length is 6']
    }
})
userSchema.post('save', function (doc, next) {
    console.log("new user created", doc);
    next()
})

userSchema.pre('save', async function (next) {
    const hashpassword = await bcrypt.hash(this.password, 10)
    this.password = hashpassword
    console.log(this)
    next()
})


// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.model('user').findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };


const User = mongoose.model('user', userSchema)

module.exports = User