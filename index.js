const express = require("express");
const app = express();

let persons = [
  {
    name: "Arto hellas",
    numberid: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    numberid: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    numberid: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Popperndieck",
    numberid: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.filter(
    (person) => person.id === Number(req.params.id)
  );
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  res.status(204).end();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
