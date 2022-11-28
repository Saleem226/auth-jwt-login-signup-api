const User = require('../modals/User')
const jwt = require('jsonwebtoken')

class AuthController {
    static handleErrors = (err) => {
        console.log(err.message, err.code)
        let error = { email: '', password: '' }


        if(err.message==='incorrect password'){
            error.password = 'incorrect password'
        }
        if(err.message==='incorrect email'){
            error.email = 'incorrect email'
        }

        if (err.code === 11000) {
            error.email = 'That email is already exists'
        }

        //validation errors
        if (err.message.includes('user validation failed')) {
            Object.values(err.errors).forEach(({ properties }) => {
                error[properties.path] = properties.message
            })
        }
        console.log(error)
        return error;
    }
    maxAge = 3 * 24 * 60 * 60
    static createToken = (id) => {

        return jwt.sign({ id }, 'auth project secret', {
            expiresIn: 3 * 24 * 60 * 60
        })

    }
    static login_get = async (req, res) => {
        res.render('login',{title:'Login'})
    }
    static signup_get = async (req, res) => {
        res.render('signup',{title:'Sign-Up'})
    }

    static login_post = async (req, res) => {
        const {email,password}=req.body
       try {
        const user=await User.login(email,password)
        const token = this.createToken(user._id)
        res.cookie('jwt',token,{httpOnly:true,maxAge:3 * 24 * 60 * 60*1000})
        res.status(200).json({user:user._id})
       } catch (error) {
        const errors = this.handleErrors(error)
        res.status(400).json({ errors })
       }
    }


    static signup_post = async (req, res) => {

        const { email, password } = req.body
        try {
            const user = await User.create({ email, password })
            const token = this.createToken(user._id)
            res.cookie('jwt',token,{httpOnly:true,maxAge:3 * 24 * 60 * 60*1000})
            res.status(201).json({user:user._id})

        } catch (error) {
            const errors = this.handleErrors(error)
            res.status(400).json({ errors })
        }

    }

    static logout = async (req, res) => {
        res.cookie('jwt','',{maxAge:1})
        res.redirect('/')
        // res.send("Logout post request")
    }

}
module.exports = AuthController