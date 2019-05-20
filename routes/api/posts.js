const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {
    check,
    validationResult
} = require('express-validator/check')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route  POST   api/posts 
// @desc          Create a post
// @access        Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }).populate('user', ['name', 'avatar'])

        const post = await newPost.save()
        return res.json(post)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }


})

// @route         GET api/posts 
// @desc          Get all posts
// @access        Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({
            date: -1
        })
        return res.json(posts)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

// @route         GET api/posts/:id
// @desc          Get posts by id
// @access        Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) return res.status(404).json({
            msg: 'Post not found'
        })
        return res.json(post)
    } catch (error) {
        console.error(error.message)
        if (error.kind === 'ObjectId') return res.status(400).json({
            msg: 'Invalid Request. Post not found'
        })

        res.status(500).send('Server error')
    }
})

// @route         DELETE api/posts/:id
// @desc          Delete a post
// @access        Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({
            msg: 'Post not found'
        })
        if (req.user.id === post.user.toString()) {
            await Post.findByIdAndRemove(req.params.id)
            return res.status(200).json({
                msg: 'Post deleted successfully'
            })
        }

        return res.status(401).json({
            msg: 'Only authors can delete posts'
        })


    } catch (error) {
        console.error(error.message)
        if (error.kind === 'ObjectId') return res.status(400).json({
            msg: 'Invalid Request. Post not found'
        })

        res.status(500).send('Server error')
    }
})

// @route         PUT api/posts/like/:id
// @desc          Like a post
// @access        Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({
            msg: 'Post not found'
        })

        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0 || post.user.toString() === req.user.id) {
            return res.status(400).json('Cannot like own posts or post have already been liked by you')
        }
        post.likes.unshift({
            user: req.user.id
        })
        await post.save()
        return res.json(post.likes)

    } catch (error) {
        console.error(error.message)
        if (error.kind === 'ObjectId') return res.status(400).json({
            msg: 'Invalid Request. Post not found'
        })

        res.status(500).send('Server error')
    }
})

// @route         PUT api/posts/unlike/:id
// @desc          Un-Like a post
// @access        Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({
            msg: 'Post not found'
        })

        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0 || post.user.toString() === req.user.id) {
            return res.status(400).json('You havent liked this post and can not unlike it')
        }
        const like = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(like, 1)
        await post.save()
        return res.json(post.likes)

    } catch (error) {
        console.error(error.message)
        if (error.kind === 'ObjectId') return res.status(400).json({
            msg: 'Invalid Request. Post not found'
        })

        res.status(500).send('Server error')
    }
})

module.exports = router