const Book = require('../db/models/Book');

const getBooks = (req, res) =>
  Book.find({})
    .select('-__v')
    .then((books) =>
      res.json(
        books.map((elem) => {
          const { title, _id } = elem;
          return { title, _id, commentcount: elem.comments.length };
        })
      )
    )
    .catch((err) => console.log(err));

const addBook = (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.send('missing required field title');
  }
  return Book.create({ title: title })
    .then((doc) => res.json({ title: doc.title, _id: doc._id }))
    .catch((err) => console.log('unable to save book. Got the error', err));
};

const deleteAllBooks = (req, res) =>
  Book.deleteMany({})
    .then(() => res.send('complete delete successful'))
    .catch((err) => console.log(err));

const getBook = (req, res) => {
  const bookid = req.params.id;
  return Book.findById(bookid)
    .select('-__v')
    .then((book) => {
      if (!book) {
        return res.send('no book exists');
      }
      return res.json(book);
    })
    .catch((err) => {
      console.log(err);
    });
};

const addBookComment = (req, res) => {
  const bookid = req.params.id;
  const { comment } = req.body;
  if (comment) {
    return Book.findById(bookid)
      .then((book) => {
        if (book) {
          book.comments.push(comment);
          return book
            .save()
            .then((savedDoc) => {
              const { _id, title, comments } = savedDoc;
              return res.json({ _id, title, comments });
            })
            .catch((err) => console.log(err));
        }
        return res.send('no book exists');
      })
      .catch((err) => console.log(err));
  }
  return res.send('missing required field comment');

  // json res format same as .get
};

const deleteBook = (req, res) => {
  const bookid = req.params.id;
  Book.findById(bookid)
    .then((doc) => {
      if (doc) {
        return Book.deleteOne(doc)
          .then(() => res.send('delete successful'))
          .catch((err) => console.log(err));
      }
      return res.send('no book exists');
    })
    .catch((err) => console.log(err));
  // if successful response will be 'delete successful'
};

module.exports = {
  getBooks,
  addBook,
  deleteAllBooks,
  getBook,
  addBookComment,
  deleteBook,
};
