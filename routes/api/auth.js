const express =  require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs')
const config = require('config')

const User = require('../../models/User')

// @route GET     api/auth
// @desc          Test route
// @access        Private
router.get('/', auth, async (req, res)=>{
    try {   
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
})

// @router POST     api/auth
// @ desc           Authenticate User & get a token
// @access          Public
router.post(
    '/',
    [
     check('email', 'Please provide a valid email address').isEmail(),
     check('password', 'Password required').exists()
    ],
    async (req, res)=>{
        const err = validationResult(req)

        if(!err.isEmpty()){
         return res.status(400).json({ errors:err.array() })
        }

        const { email, password } = req.body        

        try {
            // See if the user exists. 
            let user = await User.findOne({ email })
            if(!user){
               return res.status(400).json({errors: [{ msg: 'Invalid credentials.' }]})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch){
                return res.status(400).json({errors: [{ msg: 'Invalid credentials.' }]})
            }

            // Return jsonwebtoken
            const jwtPayload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                jwtPayload,
                config.get('jwtSecret'),
                { expiresIn: 36000000 }, 
                (err, token)=>{
                    if(err) throw err

                    res.json({ token })
                })
        } catch (error) {
            console.error(error.message)
            res.status(500).send('Server error')
        }

})


module.exports = router