const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("db"));

app.get("/", (req, res) =>
	res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
	res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) =>
	res.sendFile(path.join(__dirname, "/db/db.json"))
);

app.post("/api/notes", function (req, res) {
	fs.readFile(__dirname + "/db/db.json", "utf8", function (error, addNote) {
		if (error) {
			return console.log(error);
		}
		addNote = JSON.parse(addNote);

		var i = addNote.length;
		const newNote = { title: req.body.title, text: req.body.text, id: i };
		const userNote = addNote.concat(newNote);

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
	fs.readFile(__dirname + "/db/db.json", "utf8", function (error, addNote) {
		if (error) {
			return console.log(error);
		}
		addNote = JSON.parse(addNote);
	});
});

app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname, "public/index.html"))
);

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
