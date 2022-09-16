// Imports
const express = require('express');
const mongoose = require('mongoose'); 
const adminRouter = require('./routes/admin');

// Local Imports
const authRouter = require('./routes/auth');

// Initialization
const app = express();
const PORT = 3000;
const DB = "mongodb+srv://Monil:QpOt8mXHmTtLHaym@cluster0.zyqfc.mongodb.net/?retryWrites=true&w=majority"

// Middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);

// Connect to MongoDB
mongoose.connect(DB).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((e) => {
    console.log(e);
});

// Listens to our server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected at port ${PORT} successfully`);
});
