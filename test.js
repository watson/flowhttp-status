'use strict';

var assert = require('assert');
var http = require('http');
var PassThrough = require('stream').PassThrough;
var fh = require('flowhttp');
var Status = require('./index');

var noop = function () {};

fh.agent = false; // opt out of connection pooling - makes the tests fail

describe('Status', function () {
  it('should be a PassThrough stream', function () {
    assert(Status.prototype instanceof PassThrough, 'The Stream object should be an instance of stream.PassThrough');
  });
});

describe('status', function () {
  var url = 'http://localhost:5000';
  var server;

  before(function (done) {
    server = http.createServer(function (req, res) {
      res.writeHead(404);
      res.end();
    });
    server.listen(5000, done);
  });

  after(function () {
    server.close();
  });

  it('should not filter anything if no whitelist have been provided', function (done) {
    assert.doesNotThrow(function () {
      fh(url)
        .pipe(new Status())
        .on('data', noop) // kick it into flowing mode
        .on('end', done);
    });
  });

  it('should allow 404 if it is the only whitelisted status code', function (done) {
    assert.doesNotThrow(function () {
      fh(url)
        .pipe(new Status(404))
        .on('data', noop) // kick it into flowing mode
        .on('end', done);
    });
  });

  it('should allow 404 if it is one of may whitelisted status codes', function (done) {
    assert.doesNotThrow(function () {
      fh(url)
        .pipe(new Status(200, 404))
        .on('data', noop) // kick it into flowing mode
        .on('end', done);
    });
  });

  it('should emit an error saying that 404 isn\'t a valid response if 404 isn\'t whitelisted', function (done) {
    fh(url)
      .pipe(new Status(200))
      .on('data', noop) // kick it into flowing mode
      .on('error', function (err) {
        assert.equal(err.message, 'Unexpected response: 404 Not Found');
        done();
      });
  });
});
