const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ajurczak:Barryboy10-@cluster0.stwfu1e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('CONNECTED TO MONGODB ATLAS'))
    .catch((err) => console.error('MONGODB CONNECTION ERROR:', err));

// DEFINE MOVIE SCHEMA AND MODEL
const movieSchema = new mongoose.Schema({
    title: String,
    comments: String
});

const Movie = mongoose.model('Movie', movieSchema);

// CREATE - ADD NEW MOVIE
app.post('/create', (req, res) => {
    const { title, comments } = req.body;
    const newMovie = new Movie({ title, comments });

    newMovie.save()
        .then(() => {
            console.log("Movie created.");
            res.redirect('/read');
        })
        .catch(err => {
            console.error("Error creating movie:", err);
            res.status(500).send("Error saving movie.");
        });
});

// READ - DISPLAY ALL MOVIES
app.get('/read', (req, res) => {
    Movie.find({})
        .then(movies => {
            let output = "Movies Collection:\n\n";
            movies.forEach(movie => {
                output += `Title: ${movie.title}\n`;
                output += `Comments: ${movie.comments}\n`;
                output += `ID: ${movie._id}\n\n`;
            });
            output += `Total Count: ${movies.length}`;
            res.type('text/plain').send(output);
        })
        .catch(err => {
            console.error("Error reading movies:", err);
            res.status(500).send("Error fetching movies.");
        });
});

// UPDATE - UPDATE A MOVIE BY ID
app.post('/update', (req, res) => {
    const { id, newComment } = req.body;

    if (!id || !newComment) {
        return res.status(400).send("ID and new comment are required.");
    }

    Movie.findByIdAndUpdate(id, { comments: newComment })
        .then(() => res.send("Movie updated."))
        .catch(err => {
            console.error("Error updating movie:", err);
            res.status(500).send("Error updating movie.");
        });
});

// DELETE - DELETE A MOVIE BY ID
app.post('/delete', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send("ID is required.");
    }

    Movie.findByIdAndDelete(id)
        .then(() => res.send("Movie deleted."))
        .catch(err => {
            console.error("Error deleting movie:", err);
            res.status(500).send("Error deleting movie.");
        });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
