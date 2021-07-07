const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const dbService = require("./dbService");
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));


// Create/Insert
app.post("/insert", (req, res) => {
    const db = dbService.getDBServiceInstance();

    const result = db.insertNewName(req.body.name);

    result
    .then(data => res.json(data))
    .catch(error => console.log(error));
});


// get all the names from database
// Read
app.get("/getAll", (req, res) => {
    const db = dbService.getDBServiceInstance();

    const results = db.getAllNames();

    results
    .then(data => res.json(data))
    .catch(error => console.log(error));
});

// get one row by name
app.get("/search/:name", (req, res) => {
    const { name } = req.params;
    const db = dbService.getDBServiceInstance();

    const results = db.getName(name);

    results
    .then(data => res.json(data))
    .catch(error => console.log(error));
});

    
// Update
app.patch("/update", (req, res) => {
    const {id, name} = req.body;
    const db = dbService.getDBServiceInstance();

    const result = db.updateNameById(id, name);

    result
    .then(data => res.json({success: data}))
    .catch(error => { 
        console.log(error);
        res.data.json({success: false});
    });
});

// Delete
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    const db = dbService.getDBServiceInstance();

    const result = db.deleteNameById(id);

    result
    .then(data => res.json({success: data}))
    .catch(error => console.log(error));
});


// start the server and listen on port
app.listen(process.env.PORT, () => console.log("Server started at " + process.env.PORT));