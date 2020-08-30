const express = require("express");
const app = express();

const persons = [
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

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
