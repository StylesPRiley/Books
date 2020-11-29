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
let cors = require('cors');
let router = express.Router();
// For the Data Model
let BookSchema = require('../models/books');
const db = require("http");



function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.post('/', (request, response, next) => {
    let newBook = request.body;
    //console.log(request.body);
    if (!newBook.title || !newBook.author || !newBook.isbn || !newBook.price){
        HandleError(response, 'Missing Info', 'Form data missing', 500);
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

router.get('/', (request, response, next) =>{
    let name = request.query['isbn'];
    if (name){
        BookSchema
            .find({"isbn": name})
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

//PATCH by isbn
router.patch('/:isbn', (request, response, next) =>{
    BookSchema
        .findById(request.params.isbn, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body.isbn){
                    delete request.body.isbn;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, friend)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(friend);
                });
            }else{
                response.status(404).send({"isbn": request.params.isbn, "error":  "Not Found"});
            }

        });
});

router.delete('/:isbn', (request, response, next) =>{
    let result = request.query['isbn'];
    if (error) {
        response.status(500).send(error);
    }else if (result){
        result.remove((error)=>{
            if (error){
                response.status(500).send(error);
            }
            response.send({"deletedISBN": result});
        });
    }else{
        response.status(404).send({"isbn": result, "error":  "Not Found"});
    }
});
module.exports = router;