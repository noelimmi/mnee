const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");

//Db credentials
const db = require("./config/keys").MongoURI;

//Connect to mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Db connected"))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Routes
app.use("/", require("./routes/home"));
app.use("/user", require("./routes/user"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
