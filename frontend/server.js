const express = require("express")
const path = require("path")

const app  = express();

app.use("/js", express.static(path.resolve(__dirname, "frontend", "js")));
app.use("/css", express.static(path.resolve(__dirname, "frontend", "css")));
app.use("/img", express.static(path.resolve(__dirname, "frontend", "img")));

app.get("/batpong", (req, res) => {
	res.sendFile(path.resolve("frontend", "views", "batpong.html"));
});

app.get("/batcave", (req, res) => {
	res.sendFile(path.resolve("frontend", "views", "batcave.html"));
});

app.get("/batprofile", (req, res) => {
	res.sendFile(path.resolve("frontend", "views", "batprofile.html"));
});

app.get("/*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));