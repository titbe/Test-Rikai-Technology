const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");

const companyRoute = require("./routes/companyRoute");
const userRoute = require("./routes/userRoute");

const app = express();
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/companies", companyRoute);
app.use("/users", userRoute);

// Default route
app.get("/", (req, res) => res.redirect("/companies"));

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
