const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] ?? []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] ?? [];
    const newComment = {id: commentId, content, status: 'pending'};
    comments.push(newComment);
    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            postId: req.params.id,
            ...newComment
        }
    });

    res.status(201).send(comments);
});


async function handleCommentModerated (data) {

    const { postId, id, status } = data;

    const comment = commentsByPostId[postId]?.find(c => c.id = id);

    comment.status = status;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentUpdated',
        data: {
            ...comment,
            postId,
        }
    });
}

app.post('/events', async (req, res) => {
    console.log('Received Event:', req.body.type);

    const {type, data} = req.body;

    switch (type) {
        case 'CommentModerated': 
            await handleCommentModerated(data);
            break;
        default: break;
    }
    res.send({});
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});