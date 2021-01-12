const express = require('express');
const Post = require('../db-helpers');

const router = express.Router();

// curl -d '{"title": "This Title", "contents": "my contents"}' -H 'Content-Type: application/json' -X POST http://localhost:5000/api/posts
router.post('/', async (req, res) => {
    const post = req.body;
    if (!post.title || !post.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        try {
            const newPostId = await Post.insert(post);
            const createdPost = await Post.findById(newPostId.id);
            res.status(201).json(createdPost);
        } catch (err) {
            res.status(500).json({ errorMessage: "There was an error while saving the post to the database" });
        }
    }
});

// curl -d '{"text": "my comment"}' -H 'Content-Type: application/json' -X POST http://localhost:5000/api/posts/:id/comments
router.post('/:id/comments', async (req, res) => {
    const id = req.params.id;
    const comment = {...req.body, post_id: id};

    if (!comment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    } else {
        try {
            const post = await Post.findById(id);
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
            else {
                const newCommentId = await Post.insertComment(comment);
                const createdComment = await Post.findCommentById(newCommentId.id);
                res.status(201).json(createdComment);
            }
            
        } catch (err) {
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        }
    }
});

// curl -X GET http://localhost:5000/api/posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts); 
    } catch (err) {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    }
});

// curl -X GET http://localhost:5000/api/posts/:id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findById(id);
        if (post.length === 0) res.status(404).json({ message: "The post with the specified ID does not exist." });
        else res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: "The post information could not be retrieved." });
    }
});

// curl -X GET http://localhost:5000/api/posts/:id/comments
router.get('/:id/comments', async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findById(id);
        if (post.length === 0) res.status(404).json({ message: "The post with the specified ID does not exist." });
        else {
            const comments = await Post.findPostComments(id);
            res.status(200).json(comments);
        }
    } catch (err) {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
});

// curl -X DELETE http://localhost:5000/api/posts/:id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findById(id);
        if (post.length === 0) res.status(404).json({ message: "The post with the specified ID does not exist." });
        else {
            const deleted = await Post.remove(id);
            res.status(204).end();
        }
    } catch (err) {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
});

router.put('/:id', (req, res) => {
    
});

module.exports = router;