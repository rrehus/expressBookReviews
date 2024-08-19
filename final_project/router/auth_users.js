const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}


const authenticatedUser = (username,password) => {
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    })
    if (validUsers.length > 0) {
        return true
    } else {
        return false
    }
}

regd_users.post("/login",function (req,res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message:"Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({data:password},"access",{expiresIn:60*60})
        req.session.authorization = {accessToken,username};
        return res.status(200).send("User successfully logged in"); 
    } else {
        return res.status(208).json({"message":"Invalid login. Check username and password"});
    }
}
)

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let review = req.query.review;
    let isbn = req.params.isbn;
    let user = req.session.authorization.username;
    let reviews = books[isbn]["reviews"]
    reviews[user] = review;
    res.send(books);
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let user = req.session.authorization.username;
    let reviews = books[isbn]["reviews"];
    delete reviews[user];
    ///reviews = reviews.filter((review) => {
    ///    if (review.username!=user) {
    ///        return review
    ///    }
    ///  });
    res.send(books);  
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
