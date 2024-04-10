const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const mongoose=require('mongoose');
const {jwtAuthMiddleware} = require('./jwt');

app.use(express.static('uploads'));
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // req.body

const PORT = process.env.PORT || 8000;


app.set("view engine", "ejs");
app.set("views", "./views");



app.use(jwtAuthMiddleware);


app.use("/", require("./routes"));

app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});




app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT} `);
})