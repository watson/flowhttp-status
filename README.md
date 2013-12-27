# flowHttp-status

A [flowHttp](https://github.com/watson/flowhttp) extension used for
whitelisting HTTP status codes.

[![build
status](https://secure.travis-ci.org/watson/flowhttp-status.png)](http://travis-ci.org/watson/flowhttp-status)

## Install

```
npm install flowhttp-status
```

## Usage

Use this module to create a `PassThrough` stream that will emit an
`error` event if the response from the
[flowHttp](https://github.com/watson/flowhttp) module doesn't validate
against a specified whitelist of HTTP status codes.

E.g. only allow the two HTTP status codes 200 and 204. If the GET
request for example.com returns anything other than those two status
codes, an `error` event will be emitted on the stream:

```javascript
var flowHttp = require('flowhttp');
var ValidCodes = require('flowhttp-status');

flowHttp('http://example.com')
  .pipe(new ValidCodes(200, 204))
  .pipe(process.stdout);
```

## License

MIT
