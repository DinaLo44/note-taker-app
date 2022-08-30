//Requiring dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const notes = require('./db/db.json');
const uuid = require('uuid');

//Setting up the app and ports
const app = express();
const PORT = process.env.PORT || 3001;

//Middleware for parsing the application
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Seeting up the static middleware
app.use(express.static("public"));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

//Setting up the API route/ GET method
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'))
}
);

//API route / POST method
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    newNote.id = uuid.v4()
    console.log(newNote)
    notes.push(newNote)
    fs.writeFileSync('./db/db.json', JSON.stringify(notes))
    res.sendFile(path.join(__dirname, './db/db.json'))
});


// DELETE Method
app.delete("/api/notes/:id", (req, res) => {
const deleteId = req.params.id;

for(let i = 0; i < notes.length; i++) {
    console.log(notes[i].id, deleteId)
    if (notes[i].id === deleteId) {
        notes.splice(i, 1);
    
    }
}
console.log(notes);

fs.writeFileSync('./db/db.json', JSON.stringify(notes), error => {
    if (error) throw error;
   
});
res.json(notes);
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);


app.listen(PORT, () =>
    console.log(`Serving Note Taker app on port ${PORT}`));