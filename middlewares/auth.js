const jwt = require('jsonwebtoken')
const User = require('../modals/User')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'auth project secret', (err, decodedToken) => {
            if (err) {
                console.log('invalid token')
                res.redirect('/login')
            } else {
                console.log(decodedToken)
                next()
            }
        })
    } else {
        console.log("no token")
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'auth project secret', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null
                next()
            } else {
                try {
                    const user = await User.findById(decodedToken.id)
                    console.log(user)
                    res.locals.user = user
                    next()
                } catch (error) {
                    console.log(error)
                }
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = {requireAuth,checkUser}