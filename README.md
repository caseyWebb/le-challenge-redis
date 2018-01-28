le-challenge-redis
=====

[![NPM][npm-shield]][npm]
[![License][license-shield]][license]
[![Build][travis-ci-shield]][travis-ci]
[![Coverage][codecov-shield]][codecov]
[![Dependencies][greenkeeper-shield][greenkeeper]

A [Redis][] strategy for [node-letsencrypt][] for setting, retrieving,
and clearing ACME challenges issued by the ACME server

* Safe to use on ephemeral services (AWS Lambda, Google Cloud Functions, et al.)

Install
-------

```bash
$ yarn add le-challenge-redis
```

Usage
-----

```javascript
const LE = require('letsencrypt')

const redisChallengeStrategy = require('le-challenge-redis').create({
  /**
   * Prefix to use for redis key
   */
  prefix: 'letsencrypt-acme-challenge',
  /**
   * Redis Client Options
   * 
   * https://www.npmjs.com/package/redis#rediscreateclient
   */
  redisOptions: {}
})

LE.create({
  server: LE.stagingServerUrl,
  challenge: redisChallengeStrategy
})
```

NOTE: If you request a certificate with 6 domains listed,
it will require 6 individual challenges.

Exposed Methods
---------------

For ACME Challenge:

* `set(opts, domain, key, val, done)`
* `get(defaults, domain, key, done)`
* `remove(defaults, domain, key, done)`

For node-letsencrypt internals:

* `getOptions()` returns the user supplied options, if any (no effect)


[Redis]: https://redis.io/
[node-letsencrypt]: https://www.npmjs.com/package/letsencrypt

[npm]: https://npmjs.com/package/le-challenge-redis
[npm-shield]: https://img.shields.io/npm/v/le-challenge-redis.svg

[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/le-challenge-redis.svg

[travis-ci]: https://travis-ci.org/caseyWebb/le-challenge-redis/
[travis-ci-shield]: https://img.shields.io/travis/caseyWebb/le-challenge-redis/master.svg

[codecov]: https://codecov.io/gh/caseyWebb/le-challenge-redis
[codecov-shield]: https://img.shields.io/codecov/c/github/caseyWebb/le-challenge-redis.svg

[greenkeeper]: https://greenkeeper.io/
[greenkeeper-shield]: https://badges.greenkeeper.io/caseyWebb/le-challenge-redis.svg
