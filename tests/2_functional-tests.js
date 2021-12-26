/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');

const { assert } = chai;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', (done) => {
    chai
      .request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount'
        );
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title'
        );
        assert.property(
          res.body[0],
          '_id',
          'Books in array should contain _id'
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', () => {
    suite(
      'POST /api/books with title => create book object/expect book object',
      () => {
        test('Test POST /api/books with title', (done) => {
          chai
            .request(server)
            .post('/api/books')
            .type('form')
            .send({ title: 'Test Book Title' })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'title', 'Book should contain title');
              assert.property(
                res.body,
                'title',
                'Books in array should contain title'
              );
              assert.property(res.body, '_id', 'Book should contain _id');
              done();
            });
        });

        test('Test POST /api/books with no title given', (done) => {
          chai
            .request(server)
            .post('/api/books')
            .type('form')
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isString(res.body, 'response should be a string');
              assert.strictEqual(
                res.body,
                'missing required field title',
                'response should contain "missing required field title" error message'
              );
              done();
            });
        });
      }
    );

    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', (done) => {
        // done();
      });
    });

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', (done) => {
        // done();
      });

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        // done();
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      () => {
        test('Test POST /api/books/[id] with comment', (done) => {
          // done();
        });

        test('Test POST /api/books/[id] without comment field', (done) => {
          // done();
        });

        test('Test POST /api/books/[id] with comment, id not in db', (done) => {
          // done();
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book object id', () => {
      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        // done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        // done();
      });
    });
  });
});
