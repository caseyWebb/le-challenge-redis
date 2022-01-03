# le-challenge-redis

[![NPM][npm-shield]][npm]
[![License][license-shield]][license]
[![Build][build-status-shield]][build-status]
[![Coverage][codecov-shield]][codecov]

A [Redis][] strategy for [greenlock][] for setting, retrieving,
and clearing ACME challenges issued by the ACME server

- Safe to use on ephemeral / load-balanced services (AWS Lambda, Google Cloud Functions, et al.)

## Install

```bash
$ yarn add le-challenge-redis@3.x
```

## Usage

```javascript
const Greenlock = require('greenlock')
const { GreenlockRedisChallenge } = require('le-challenge-redis')

const challenge = GreenlockRedisChallenge.create({
  /**
   * Prefix to use for redis key
   */
  prefix: 'greenlock-acme-challenge',
  /**
   * Redis Client Options
   *
   * https://www.npmjs.com/package/redis#rediscreateclient
   */
  redisOptions: {}
})

const greenlock = Greenlock.create({
  challenges: {
    'http-01': challenge
  }
})
```

> See [greenlock's documentation][greenlock] for further usage information

## Exposed Methods

For ACME Challenge:

- `set(opts): Promise<null>`
- `get(opts): Promise<{ keyAuthorization: string }>`
- `remove(opts): Promise<null>`

For greenlock internals:

- `getOptions()` returns the user supplied options, if any (no effect)

> Built with [Greenlock](https://git.rootprojects.org/root/greenlock.js) (a [Root](https://rootprojects.org) project).

[redis]: https://redis.io/
[greenlock]: https://www.npmjs.com/package/greenlock
[npm]: https://npmjs.com/package/le-challenge-redis
[npm-shield]: https://img.shields.io/npm/v/le-challenge-redis.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/le-challenge-redis.svg
[build-status]: https://github.com/caseyWebb/le-challenge-redis/actions/workflows/test.yml
[build-status-shield]: https://img.shields.io/github/workflow/status/caseyWebb/le-challenge-redis/Node%20CI/master
[codecov]: https://codecov.io/gh/caseyWebb/le-challenge-redis
[codecov-shield]: https://img.shields.io/codecov/c/github/caseyWebb/le-challenge-redis.svg
