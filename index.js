
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

// CREATE EXPRESS APP
const app = express()

// SET STATIC FOLDER TO 'CLIENT'
app.use(express.static(__dirname + "/client"))


app.use(bodyParser.urlencoded({ extended: true }))

// CONNECT TO MONGODB ATLAS
const mongooseUri = "mongodb+srv://alexajurczak:B%40rr3tt_M%401ch05-@cluster0.stwfu1e.mongodb.net/moviedatabase?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(mongooseUri, { useNewUrlParser: true, useUnifiedTopology: true })

// DEFINE MOVIE SCHEMA AND MODEL
const movieSchema = {
    title: String,
    comments: String
}
const Movie = mongoose.model("movie", movieSchema)

// CREATE - ADD A NEW MOVIE
app.post("/create", (req, res) => {
    const title = req.body.title
    const comments = req.body.comments

    if (!title || !comments) {
        return res.status(400).send("Title and comments are required.")
    }

    const newMovie = new Movie({ title, comments })

    newMovie.save()
        .then(() => {
            console.log("Movie created:", title)
            res.redirect("/read")
        })
        .catch(err => {
            console.error("Error creating movie:", err)
            res.status(500).send("Error saving movie.")
        })
})

// READ - DISPLAY ALL MOVIES
app.get("/read", (req, res) => {
    Movie.find({})
        .then(movies => {
            let output = "Movies Collection:\n\n"
            movies.forEach(movie => {
                output += "Title: " + movie.title + "\n"
                output += "Comments: " + movie.comments + "\n"
                output += "ID:" + movie._id + "\n\n"
            })
            output += "Total Count: " + movies.length
            res.type("text/plain").send(output)
        })
        .catch(err => {
            console.error("Error reading movies:", err)
            res.status(500).send("Error fetching movies.")
        })
})

// UPDATE - UPDATE A MOVIE BY ID
app.post("/update", (req, res) => {
    const movieId = req.body.id
    const newComment = req.body.comment

    if (!movieId || !newComment) {
        return res.status(400).send("ID and new comment are required.")
    }

    Movie.findByIdAndUpdate(movieId, { comments: newComment })
        .then(() => {
            console.log("Movie updated:", movieId)
            res.redirect("/read")
        })
        .catch(err => {
            console.error("Error updating movie:", err)
            res.status(500).send("Error updating movie.")
        })
})

// DELETE - DELETE A MOVIE BY ID
app.post("/delete", (req, res) => {
    const movieId = req.body.id

    if (!movieId) {
        return res.status(400).send("Movie ID is required.")
    }

    Movie.findByIdAndDelete(movieId)
        .then(() => {
            console.log("Movie deleted:", movieId)
            res.redirect("/read")
        })
        .catch(err => {
            console.error("Error deleting movie:", err)
            res.status(500).send("Error deleting movie.")
        })
})

// TEST ROUTE
app.get("/test", (req, res) => {
    res.type("text/plain").send("Node.js and Express running successfully.")
})

// START SERVER
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Server is running at http://localhost:" + port + "/")
})
