const express = require('express')
const router = express.Router()
const {
    check,
    validationResult
} = require('express-validator/check')


const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')

// @route         GET api/profile/me
// @desc          Get current user's profile
// @access        Private
router.get('/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({
                msg: 'This has no profile yet'
            })
        }
        res.json(profile)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
})

// @route POST    api/profile
// @desc          Create or update a looged-in users profile
// @access        Private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills field is required').not().isEmpty()
]], async (req, res) => {

    const err = validationResult(req)
    if (!err.isEmpty()) {
        return res.status(400).json({
            errors: err.array()
        })
    }

    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        instagram,
        linkedin
    } = req.body

    //Build the profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (status) profileFields.status = status
    if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim())
    if (bio) profileFields.bio = bio
    if (githubusername) profileFields.githubusername = githubusername


    //Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (instagram) profileFields.social.instagram = instagram
    if (linkedin) profileFields.social.linkedin = linkedin


    try {
        let profile = await Profile.findOne({
            user: req.user.id
        })

        if (profile) {
            profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            })

            return res.json(profile)
        }

        profile = new Profile(profileFields)

        await profile.save()
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }

})

// @route         GET api/profile
// @desc          Get all profiles
// @access        Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        return res.json(profiles)
    } catch (error) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route         GET api/profile/user/:user_id
// @desc          Get all profile by User_ID
// @access        Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar'])
        if (!profile) return res.json({
            msg: 'Profile not found'
        })
        return res.json(profile)
    } catch (error) {
        console.error(error.message)
        if (error.kind == 'ObjectId') res.json({
            msg: 'Profile not found'
        })
        res.status(500).send('Server error')
    }

})

// @route         DELETE api/profile
// @desc          Delete profile, user and posts
// @access        Private

router.delete('/', auth, async (req, res) => {
    try {
        // Remove profile
        await Profile.findOneAndRemove({
            user: req.user.id
        })
        // Remove User
        await User.findOneAndRemove({
            _id: req.user.id
        })
        res.json({
            msg: 'User deleted'
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})
module.exports = router