/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const _data = require("../lib/data");
const helpers = require("../lib/helpers");

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      _data.list("books", async (err, data) => {
        if (!err) {
          const newData = await data.map(d=>({
            _id: d._id,
            title: d.title,
            commentcount: d.comments.length
          }))
          res.json(newData);
        } else {
          console.log(err)
          res.send("An error occurred while reading the data")
        }
      })
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      
      try {
        let title =
        typeof req.body?.title === "string" &&
        req.body?.title.trim().length > 0
          ? req.body?.title.trim()
          : false;
        //response will contain new book object including atleast _id and title
        if(!title){
          return res.send("missing required field title")
        }
  
        let _id = helpers.createRandomString(24)
        _data.read("books", _id, function (err, data){
          if(err) {
            let book = {
              _id,
              title,
              comments: []
            }
  
            _data.create("books", _id, book, (err)=> {
              if(!err) {
                const returnedData = {
                  ...book,
                  comments: undefined,
                }
                res.json(returnedData)
              } else {
                console.log(err)
                return res.send("Could not create book")
              }
            })
  
          } else {
            return res.send("Internal Server Error")
          }
        })
      } catch (err) {
        console.log(err)
        return res.send("Internal Server Error")
      }


    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      _data.list("books", async function(err, books){
        if(!err) {
          await books.forEach((d)=> {
             _data.delete("books", d._id, function(err){
            })
          
          });
          return res.send("complete delete successful")
        } else {
          return res.send("could not read books")
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      _data.read("books", bookid, function (err, data){
        if(!err) {
          res.json(data)
        } else {
          res.send("no book exists")
        }
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.send("missing required field comment")
      }
      _data.read("books", bookid, function (err, bookData){
        if(!err) {
          const newBookData = {
            ...bookData,
            comments: [...bookData.comments, comment]
          }
          _data.update("books", bookid, newBookData, (err, bookData) => {
            if(!err) {
              res.send(newBookData)
            } else {
              return res.send("could not update book")
            }
          })
        } else {
          res.send("no book exists")
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      _data.read("books", bookid, function(err, bookData){
        if(!err) {
          _data.delete("books", bookid, function(err){
            if(!err) {
              res.send("delete successful")
            } else {
              res.send("could not delete book")
            }
          })
        } else {
          res.send("no book exists")
        }
      })

    });

};
