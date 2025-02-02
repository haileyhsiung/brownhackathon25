const mongoose = require('mongoose'); //mongoose allows us to create schemas. mongo DB alone is schema-less

const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  bannerID: { type: String, required: true, unique: true },
  totalBoxes: { type: Number, required: true, default: 0 }, 
  totalPoints: { type: Number, required: true, default: 0 }, 
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema); //applies the schema to a model 
module.exports = Student; //exports the model 
