// Here we are going to code the API!!!!
// REST application
// Our API works over HTTP
// Using request from the HTTP verbs:
// - POST
// - GET
// - PATCH / PUT
// - DELETE

// Here we are going to code the API!!!!
// REST application
// Our API works over HTTP
// Using request from the HTTP verbs:
// - POST
// - GET
// - PATCH / PUT
// - DELETE

// For the routes
let express = require('express');
let isbnValidator = require('isbn-validate');
let cors = require('cors');
let router = express.Router();
// For the Data Model
let BookSchema = require('../models/books');
const db = require("http");

var IsIsbnValid = function(str) {

    var sum,
        weight,
        digit,
        check,
        i;

    str = str.replace(/[^0-9X]/gi, '');

    if (str.length != 10 && str.length != 13) {
        return false;
    }

    if (str.length == 13) {
        sum = 0;
        for (i = 0; i < 12; i++) {
            digit = parseInt(str[i]);
            if (i % 2 == 1) {
                sum += 3*digit;
            } else {
                sum += digit;
            }
        }
        check = (10 - (sum % 10)) % 10;
        return (check == str[str.length-1]);
    }

    if (str.length == 10) {
        weight = 10;
        sum = 0;
        for (i = 0; i < 9; i++) {
            digit = parseInt(str[i]);
            sum += weight*digit;
            weight--;
        }
        check = (11 - (sum % 11)) % 11
        if (check == 10) {
            check = 'X';
        }
        return (check == str[str.length-1].toUpperCase());
    }
}




function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.post('/', (request, response, next) => {
    let newBook = request.body;
    if (!newBook.title || !newBook.author || !newBook.isbn || !newBook.price){
        HandleError(response, 'Missing Info', 'Form data missing', 500);
    }else if(!IsIsbnValid(newBook.isbn)){
        HandleError(response, 'Invalid Data', 'Invalid ISBN', 500);
    }else{
        let book = new BookSchema({
            title: newBook.title,
            author: newBook.author,
            isbn: newBook.isbn,
            price: newBook.price
        });
        book.save((error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send({"id": book.id});
            }
        });
    }
});
router.get('/', (request, response, next) => {
    let name = request.query['author'];
    if (name){
        BookSchema
            .find({"author": name})
            .exec( (error, books) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);

                }
            });
    }else{
        BookSchema
            .find()
            .exec( (error, books) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }
} );

router.get('/:isbn', (request, response, next) =>{
    BookSchema
        .findOne({"isbn": request.params.isbn}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }
            if (result){
                response.send(result);
            }else{
                response.status(404).send({"isbn": request.params.isbn, "error":  "Not Found"});
            }

        });
});

//PATCH by isbn
//PATCH by isbn
router.patch('/:isbn', (request, response, next) =>{
    console.log("request  " + JSON.stringify(request.body));
    BookSchema
        .findOne({"isbn": request.body.isbn}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body.isbn){
                    delete request.body.isbn;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, book)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(book);
                });
            }else{
                response.status(404).send({"isbn": request.body.isbn, "error":  "Not Found"});
            }

        });
});

router.delete('/:isbn', (request, response, next) =>{
    BookSchema
        .findOne({"isbn": request.params.isbn}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedBook": request.params.isbn});
                });
            }else{
                response.status(404).send({"id": request.params.isbn, "error":  "Not Found"});
            }
        });
});
module.exports = router;