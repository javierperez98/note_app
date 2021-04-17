const express = require("express");
const path = require("path");
var fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) =>
	res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname, "public/index.html"))
);

app.post("/api/notes", function (req, res) {
	fs.readFile(__dirname + "/db/db.json", "utf8", function (error, notes) {
		if (error) {
			return console.log(error);
		}
		notes = JSON.parse(notes);

		var newNote = { title: req.body.title, text: req.body.text };
		var userNote = notes.concat(newNote);

		fs.writeFile(
			__dirname + "/db/db.json",
			JSON.stringify(userNote),
			function (error, data) {
				if (error) {
					return error;
				}
				res.json(userNote);
			}
		);
	});
});

app.get("/api/notes", function (req, res) {
	fs.readFile(__dirname + "/db/db.json", "utf8", function (error, data) {
		if (error) {
			return console.log(error);
		}
		res.json(JSON.parse(data));
	});
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
