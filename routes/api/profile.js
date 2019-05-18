const express =  require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')

// @route         GET api/profile/me
// @desc          Get current user's profile
// @access        Private
router.get('/me', auth, async (req, res)=>{
    try {

        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar'])

        if(!profile){
            return res.status(400).json({msg: 'This has no profile yet'})
        }
        res.json(profile)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
})


module.exports = router