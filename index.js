require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const Tutorial = require('./models/Tutorial');

app.get('/api/tutorials', (req, res) => {
    if (req.query.title) {
        Tutorial.find({}).then(tutorials => {
            res.json(tutorials.filter(tutorial => tutorial.title.includes(req.query.title)));
        })
    } else {
        Tutorial.find({}).then(tutorials => {
            res.json(tutorials);
        })
    }
})

app.get('/api/tutorials/:id', (req, res) => {
    if (!req.params.id === "published") {
        Tutorial.findById(req.params.id).then(tutorial => {
            res.json(tutorial);
        })
    } else {
        Tutorial.find({ published: true }).then(tutorials => {
            res.json(tutorials);
        })
    }
})


app.post('/api/tutorials', (req, res) => {
    if (!req.body.title || !req.body.published) {
        res.send('insufficient data- missing title or published');
    } else {
        new Tutorial({ title: req.body.title, published: req.body.published }).save().then(result => {
            res.send('tutorial added successfully');
            mongoose.connection.close()
        }).catch(error => res.send(error));
    }
})

app.put('/api/tutorials/:id', (req, res) => {
    if (!req.body.title || !req.body.published) {
        res.send('insufficient data- missing title or published');
    } else {
        Tutorial.findByIdAndUpdate(req.params.id, { title: req.body.title, published: req.body.published }, (err, docs) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Updated User: " + docs);
            }
        })
    }
})

app.delete('/api/tutorials/:id', (req, res) => {
    Tutorial.findByIdAndDelete(req.params.id).then(result => {
        res.send("tutorial successfully deleted");
        mongoose.connection.close()
    })
})

app.delete('/api/tutorials', (req, res) => {
    Tutorial.deleteMany({}).then(result => {
        res.send('all tutorials deleted');
        mongoose.connection.close()
    })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})