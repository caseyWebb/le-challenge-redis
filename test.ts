import { GreenlockRedisChallenge } from './index'

import tester = require('acme-http-01-test')

const challenger = GreenlockRedisChallenge.create({
  redisOptions: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined
  }
})

test('le-challenge-redis / acme-http-01-test', async (): Promise<void> => {
  try {
    await tester.testRecord('http-01', 'example.com', challenger)
  } catch (err) {
    process.exitCode = 1
  }
})
