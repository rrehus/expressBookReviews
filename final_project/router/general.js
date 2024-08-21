const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

var existingUsernames = users.filter(function (user) {
    return user.username
  });


const doesExist= (username) => {
    let existingUsers = existingUsernames;
    return existingUsers.includes(username);
}


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message:"User successfully registered"});  
    } else {
        return res.status(404).json({message:"User already exists"});
    }
  } else {
    return res.status(404).json({message:"Please provide both a username and a password to register"});
  }

  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    return res.send(JSON.stringify(books,null));
  });



const connectToURL = async (url) => {
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (error) {
        console.error(error.toString());
    }
}

connectToURL('https://ernore66-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');



public_users.get('/users',function (req, res) {
    //Write your code here
    return res.send(users);
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let values = Object.values(books);
  booksWithSameAuthor = values.filter((book) => {
    return book["author"] == author;
  })
  return res.send(JSON.stringify(booksWithSameAuthor,null));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let values = Object.values(books);
  booksWithSameTitle = values.filter((book) => {
    return book.title === title;
  })
  return res.send(booksWithSameTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let reviews = books[isbn].reviews;
    return res.send(reviews);
});

module.exports.general = public_users;
