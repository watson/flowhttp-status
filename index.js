'use strict';

var http = require('http');
var util = require('util');
var PassThrough = require('stream').PassThrough;

// A PassThrough stream that takes a list of valid status codes. The
// supplied status codes will act as a whilelist of allowed HTTP
// response codes. If a HTTP reponse is received which doens't conform
// to the whilelist, an error event is emitted.
var Status = function () {
  var self = this;
  PassThrough.call(this);

  if (arguments.length > 0)
    var codes = Array.prototype.slice.call(arguments);

  // Listen for the special `response` event emitted by the flowHttp
  // module
  this.once('response', function (res) {
    // Forward the `response` event down the pipe-line
    self._forwardFlowHttpResponse(res);
    var code = res.statusCode;
    if (codes && codes.indexOf(code) === -1) {
      var err = new Error('Unexpected response: ' + code + ' ' + http.STATUS_CODES[code]);
      err.method = self._src.req.method;
      err.path = self._src.req.path;
      self.emit('error', err);
    }
  });

  // Record the source of the pipe to be used above
  this.once('pipe', function (src) {
    self._src = src;
  });
};

util.inherits(Status, PassThrough);

module.exports = Status;
