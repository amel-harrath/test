const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const kioskRoutes = require("./routes/kiosk");


var app = express();
app.use(bodyParser.json());

//Routes
app.use("/users", userRoutes);
app.use("/kiosk", kioskRoutes);

app.get('/', function (req, res) {
  res.send('Hi!')
})

// setting server port 
const PORT = process.env.PORT || 5000


//Establish server Connection
app.listen(PORT, function () {
  console.log('Server running at localhost: ' + PORT)
});
 
