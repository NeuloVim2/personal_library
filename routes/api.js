/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
const Book = require('../db/models/Book');

module.exports = function (app) {
  app
    .route('/api/books')
    .get((req, res) => {
      Book.find({})
        .select('-__v')
        .exec((err, books) => {
          if (err) {
            console.log(err);
          }
          res.json(
            books.map((elem) => {
              const { title, _id } = elem;
              return { title, _id, commentcount: elem.comments.length };
            })
          );
        });
      // response will be array of book objects
      // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post((req, res) => {
      const { title } = req.body;
      if (!title) {
        return res.send('missing required field title');
      }
      return Book.create({ title: title }, (err, doc) => {
        if (err) {
          console.log('unable to save book. Got the error', err);
        }
        res.json({ title: doc.title, _id: doc._id });
      });
      // response will contain new book object including atleast _id and title
    })

    .delete(
      (req, res) =>
        Book.deleteMany({}, (err, count) => {
          if (err) console.log(err);
          // console.log('documents successfuly deleted', count);
          res.send('complete delete successful');
        })
      // if successful response will be 'complete delete successful'
    );

  app
    .route('/api/books/:id')
    .get((req, res) => {
      const bookid = req.params.id;
      // json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post((req, res) => {
      const bookid = req.params.id;
      const { comment } = req.body;
      // json res format same as .get
    })

    .delete((req, res) => {
      const bookid = req.params.id;
      // if successful response will be 'delete successful'
    });
};
