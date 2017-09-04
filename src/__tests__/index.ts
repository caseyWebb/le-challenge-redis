import { promisify as pify } from 'util'
import * as redis from 'redis'
import Challenge from '../'

const challenge = Challenge.create()
const client = redis.createClient()

const opts = challenge.getOptions()
const domain = 'example.com'
const token = 'token-id'
const key = 'secret-key'

test('le-challenge-redis', async () => {
  const nativeGet = () => pify(client.get.bind(client))(`letsencrypt-acme-challenge:${domain}:${token}`)
  const get = () => pify(challenge.get.bind(challenge))(opts, domain, token)
  const set = () => pify(challenge.set.bind(challenge))(opts, domain, token, key)
  const remove = () => pify(challenge.remove.bind(challenge))(opts, domain, token)

  await remove()
  await set()
  
  expect(await nativeGet()).toBe(key)
  expect(await get()).toBe(key)

  await remove()
  
  expect(await nativeGet()).toBe(null)
  expect(await get()).toBeUndefined()

  client.quit()
})