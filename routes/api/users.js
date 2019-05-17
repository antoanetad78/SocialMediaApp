const express =  require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')


const User = require('../../models/User')



// @route POST    api/users 
// @desc          Register user
// @access        Public
router.post(
    '/',
    [
     check('name', 'Name is required').not().isEmpty(),
     check('email', 'Please provide a valid email address').isEmail(),
     check('password', 'Password should be 6 or more characters long').isLength({ min: 6 })
    ],
    async (req, res)=>{
        const err = validationResult(req)

        if(!err.isEmpty()){
         return res.status(400).json({ errors:err.array() })
        }

        const { name, email, password } = req.body

        try {
            // See if the user exists. We don't want duplicate emails
            let user = await User.findOne({ email })
            if(user){
               return res.status(400).json({errors: [{ msg: 'User already exists' }]})
            }
            // Get user's gravatar from the email
            const avatar = gravatar.url(email, {
                s: 200,
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })

            // Encrypt password and save the user
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
            await user.save()           

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