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

// @route         PUT api/experience
// @desc          ADD experience to profile
// @access        Private

router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'Starting date is required').not().isEmpty()
]], async (req, res) => {
    const errors = await validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        if (!profile) {
            res.status(404).json({
                msg: 'Profile not found'
            })
        }

        profile.experience.unshift(newExp)

        await profile.save()

        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }

})

// @route         DELETE api/experience/exp_id
// @desc          DELETE experience from profile
// @access        Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        if (!profile) {
            return res.status(404).json({
                msg: 'Profile not found'
            })
        }
        // Get the remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex, 1)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.error(error.mesasge)
        res.status(500).send('Server error')
    }
})

// @route         PUT api/education
// @desc          ADD education to profile
// @access        Private

router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'Starting date is required').not().isEmpty()
]], async (req, res) => {
    const errors = await validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        if (!profile) {
            res.status(404).json({
                msg: 'Profile not found'
            })
        }

        profile.education.unshift(newEdu)

        await profile.save()

        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }

})

// @route         DELETE api/education/edu_id
// @desc          DELETE education from profile
// @access        Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        if (!profile) {
            return res.status(404).json({
                msg: 'Profile not found'
            })
        }
        // Get the remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeIndex, 1)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.error(error.mesasge)
        res.status(500).send('Server error')
    }
})
module.exports = router