/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
const BookControllers = require('../controllers/BookControllers');

module.exports = function (app) {
  app
    .route('/api/books')
    .get(BookControllers.getBooks)
    .post(BookControllers.addBook)
    .delete(BookControllers.deleteAllBooks);

  app
    .route('/api/books/:id')
    .get(BookControllers.getBook)
    .post(BookControllers.addBookComment)
    .delete(BookControllers.deleteBook);
};
