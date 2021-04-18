const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("db"));

app.get("/notes", (req, res) =>
	res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
	res.sendFile(path.join(__dirname, "/db/db.json"));
	fs.readFile(__dirname + "/db/db.json", "utf8", (error, listNotes) => {
		if (!error) {
			listNotes = JSON.parse(listNotes);
		} else {
			return console.log(error);
		}
	});
});

app.post("/api/notes", (req, res) => {
	fs.readFile(__dirname + "/db/db.json", "utf8", (error, listNotes) => {
		if (!error) {
			listNotes = JSON.parse(listNotes);
			listNotes.push({
				title: req.body.title,
				text: req.body.text,
				id: listNotes.length + 1,
			});
			fs.writeFile(
				__dirname + "/db/db.json",
				JSON.stringify(listNotes),
				function (error, data) {
					if (!error) {
						res.json(listNotes);
					} else {
						return error;
					}
				}
			);
		} else {
			return console.log(error);
		}
	});
});

app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname, "public/index.html"))
);

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
