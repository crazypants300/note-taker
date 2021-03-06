const express = require('express');
const fs = require('fs');
const path = require('path');
const db = './db/db.json';
const app = express();
const PORT = 3000;

var data = fs.readFileSync(db);
var jsonData = JSON.parse(data);

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

//catchall get
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
    // return index.html
});

// get all notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
    // return notes.html
});

// get all the notes in the db file
app.get('/api/notes', (req,res) => {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) {
            console.log('File read failed: ', err);
            return;
        }
        dataArray = JSON.parse(data);
        
        res.json(dataArray);

    })
});

// add a new note to the db
app.post('/api/notes', ({ body }, res) => {
    console.log("body: ", body);
    jsonData.push(body);

    jsonData[jsonData.length - 1].id = jsonData.length - 1;
    var newData = JSON.stringify(jsonData, null, 2);

    fs.writeFile(db, newData, err => {
        if (err) throw err;
    
        console.log("New data added");
    })
});

// delete a note
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    for (let i = 0; i < jsonData.length; i++) {
        const note = jsonData[i];

        if (JSON.stringify(note.id) === id) {
            if (jsonData.length > 1) {
                jsonData.splice(id, 1);
            }
            else {
                jsonData = [];
            }
            var newData = JSON.stringify(jsonData, null, 2);
            fs.writeFile(db, newData, err => {
                if (err) throw err;
                console.log('note removed and file updated!');
            })
        };
    };

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
