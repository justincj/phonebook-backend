const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.jkxgz.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  numberid: String,
});
const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
  console.log("Phonebook");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.numberid}`);
    });
    mongoose.connection.close();
  });
} else {
  const [name, numberid] = process.argv.slice(3, 5);
  console.log(name, numberid);
  const person = new Person({
    name: name,
    numberid: numberid,
  });
  person.save().then((result) => {
    console.log(result);
    console.log(`added ${name} ${numberid} to phonbook`);
    mongoose.connection.close();
  });
}
