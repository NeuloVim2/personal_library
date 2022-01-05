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
const Utils = require('../utils');
const server = require('../server');
const Book = require('../db/models/Book');

chai.use(chaiHttp);

const testData = [
  {
    title: 'Test Book Title 1',
    comments: ['comment 1 for test data 1'],
  },
  { title: 'Test Book Title 2', comments: ['comment 1 for test data 2'] },
];

let testDataId = '';

suite('Functional Tests', () => {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test('#example Test GET /api/books', (done) => {
  //   chai
  //     .request(server)
  //     .get('/api/books')
  //     .end((err, res) => {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(
  //         res.body[0],
  //         'commentcount',
  //         'Books in array should contain commentcount'
  //       );
  //       assert.property(
  //         res.body[0],
  //         'title',
  //         'Books in array should contain title'
  //       );
  //       assert.property(
  //         res.body[0],
  //         '_id',
  //         'Books in array should contain _id'
  //       );
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  before('Create one record in db', (done) => {
    Book.create(testData[1], (err, doc) => {
      if (err) {
        console.log(err);
      }
      console.log('doc is created ', doc);
    });
    done();
  });

  suite('Routing tests', () => {
    suite(
      'POST /api/books with title => create book object/expect book object',
      () => {
        test('Test POST /api/books with title', (done) => {
          chai
            .request(server)
            .post('/api/books')
            .type('form')
            .send({ title: testData[0].title })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.hasAllKeys(
                res.body,
                ['title', '_id'],
                'Book should contain title'
              );
              assert.strictEqual(
                res.body.title,
                testData[0].title,
                "books' title is not vallid"
              );
              testDataId = res.body._id;
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
              assert.isString(res.text, 'response should be a string');
              assert.strictEqual(
                res.text,
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
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.hasAllKeys(
              res.body[Utils.getRandomNumInRange(0, res.body.length)],
              ['title', '_id', 'commentcount'],
              'one or more properties are not presented in the object'
            );
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', (done) => {
        chai
          .request(server)
          .get('/api/books/61ca25e90299926defdad920')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.strictEqual(
              res.text,
              'no book exists',
              'response should contain "no book exists" error message'
            );
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai
          .request(server)
          .get(`/api/books/${testDataId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an array');
            assert.hasAllKeys(
              res.body,
              ['title', '_id', 'comments'],
              'one or more properties are not presented in the object'
            );
            assert.strictEqual(
              testDataId,
              res.body._id,
              "_id' should be equel"
            );
            done();
          });
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      () => {
        test('Test POST /api/books/[id] with comment', (done) => {
          chai
            .request(server)
            .post(`/api/books/${testDataId}`)
            .type('form')
            .send({ comment: testData[0].comments[0] })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.hasAllKeys(
                res.body,
                ['title', '_id', 'comments'],
                'Book should contain title'
              );
              assert.strictEqual(
                testDataId,
                res.body._id,
                "_id' should be equel"
              );
              assert.isTrue(
                res.body.comments.includes(testData[0].comments[0]),
                `comment: '${testData[0].comment}' should be in comments`
              );
              done();
            });
        });

        test('Test POST /api/books/[id] without comment field', (done) => {
          chai
            .request(server)
            .post(`/api/books/${testDataId}`)
            .type('form')
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isString(res.text, 'response should be a string');
              assert.strictEqual(
                res.text,
                'missing required field comment',
                'response should contain "missing required field comment" error message'
              );
              done();
            });
        });

        test('Test POST /api/books/[id] with comment, id not in db', (done) => {
          chai
            .request(server)
            .post('/api/books/61d4d15f07f539ef65bf264e')
            .type('form')
            .send({ comment: testData[0].comments[0] })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isString(res.text, 'response should be a string');
              assert.strictEqual(
                res.text,
                'no book exists',
                'response should contain "no book exists" error message'
              );
              done();
            });
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book object id', () => {
      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai
          .request(server)
          .delete(`/api/books/${testDataId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.strictEqual(
              res.text,
              'delete successful',
              'response should contain "delete successful" error message'
            );
            done();
          });
      });

      test('Test DELETE /api/books', (done) => {
        chai
          .request(server)
          .delete('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.strictEqual(
              res.text,
              'complete delete successful',
              'response should contain "complete delete successful" error message'
            );
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        chai
          .request(server)
          .delete('/api/books/61d4d15f07f539ef65bf264e')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.strictEqual(
              res.text,
              'no book exists',
              'response should contain "no book exists" error message'
            );
            done();
          });
      });
    });
  });
});
