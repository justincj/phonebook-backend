const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());

app.use(
  morgan("tiny", {
    skip: function (req, res) {
      return req.method === "POST";
    },
  })
);

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time  ms :logbody",
    {
      skip: function (req, res) {
        return req.method !== "POST";
      },
    }
  )
);

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
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  res.status(204).end();
});

const generateid = () => {
  return Math.round(Math.random() * 10000);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  morgan.token("logbody", function (req, res) {
    return JSON.stringify(body);
  });

  if (!body.name || !body.numberid) {
    return res.status(400).json({ error: "need both name and numebr field" });
  }

  if (persons.some((person) => person.name === body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    numberid: body.numberid,
    id: generateid(),
  };
  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
