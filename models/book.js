const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({

  bookname: {
    type: String,
    required: true,
  },
  authorname: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    required: true,
    default: Date.now,
  },
  mark: {
    type: Boolean,
    required: true,
  }
  
});

module.exports = mongoose.model("books", bookSchema);
