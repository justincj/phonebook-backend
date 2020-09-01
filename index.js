require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(cors());
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

app.use(express.static("build"));

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((result) => {
      return res.send(`<p>Phonebook has ${result.length} people</p>
    <p>${new Date()}</p>
  `);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((people) => {
      res.json(people);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  morgan.token("logbody", function (req, res) {
    return JSON.stringify(body);
  });

  if (!body.name || !body.numberid) {
    return res.status(400).json({ error: "need both name and numebr field" });
  }

  const person = new Person({
    name: body.name,
    numberid: body.numberid,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    numberid: body.numberid,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      return res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res, next) => {
  res.status(404).json({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error);
  console.log("what is", Error);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "Malformed input" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
