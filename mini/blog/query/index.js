const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}

app.get('/posts', (req, res) => {
    const normalizedPosts = {};

    for (const postId in posts) {
        normalizedPosts[postId] = {
            ...posts[postId],
            comments: Array.from(posts[postId].comments.values()),
        }
    }

    res.send(normalizedPosts);
});

function handlePostCreated(data) {
    const { id, title } = data;
    posts[id] = {
        id,
        title,
        comments: new Map(),
    };
}

function handleCommentCreated(data) {
    const { id, postId } = data;

    posts[postId]?.comments.set(id, data);
}

function handleCommentUpdated(data) {
    const { id, postId } = data;
    //console.log(data);
   
    posts[postId]?.comments.set(id, data);
}


function handleEvent (type, data) {
    switch (type) {
        case 'PostCreated': 
            handlePostCreated(data);
            break;
        case 'CommentCreated': 
            handleCommentCreated(data);
            break;
        case 'CommentUpdated': 
            handleCommentUpdated(data);
            break;
        default: break;
    }
}


app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type);
    const {type, data} = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening on 4002');

    try {
        const res = await axios.get("http://localhost:4005/events");
     
        for (let event of res.data) {
          console.log("Processing event:", event.type);
     
          handleEvent(event.type, event.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    
});