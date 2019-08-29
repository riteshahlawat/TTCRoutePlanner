require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(
    express.static(path.join(__dirname, "public"), {
      extensions: ["html"]
    })
);
// APIS
app.use("/api", require("./routes/apis/apis"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});