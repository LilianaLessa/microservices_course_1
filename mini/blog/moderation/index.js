const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

async function handleCommentCreated(data) {
    const { content } = data;

    const status = content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
            ...data,
            status,
        }
    }); 
}


app.post('/events',  async (req, res) => {
    console.log('Received Event:', req.body.type);
    
    const {type, data} = req.body;

    switch (type) {
        case 'CommentCreated': 
            await handleCommentCreated(data);
            break;
        default: break;
    }

    res.send({});
});


app.listen(4003, () => {
    console.log('Listening on 4003');
});

