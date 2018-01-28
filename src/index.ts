import * as redis from 'redis'

export interface ILetsEncryptRedisChallengeOptions {
  prefix?: string
  redisOptions?: redis.ClientOpts
}

export class LetsEncryptRedisChallenge {
  private _options: ILetsEncryptRedisChallengeOptions = {
    prefix: 'letsencrypt-acme-challenge'
  }

  private constructor(opts: ILetsEncryptRedisChallengeOptions) {
    Object.assign(this._options, opts)
  }

  public getOptions() {
    return this._options
  }

  public set(args, domain, token, secret, done) {
    const client = this._createClient()
    client.set(`${this._options.prefix}:${domain}:${token}`, secret, (err) => {
      client.quit()
      done(err)
    })
  }

  public get(defaults, domain, token, done) {
    const client = this._createClient()
    client.get(`${this._options.prefix}:${domain}:${token}`, (err, secret) => {
      client.quit()
      // strict null check
      if (secret === null) {
        return done()
      } else {
        done(null, secret)
      }
    })
  }

  public remove(defaults, domain, token, done) {
    const client = this._createClient()
    client.del(`${this._options.prefix}:${domain}:${token}`, (err) => {
      client.quit()
      done(err)
    })
  }

  private _createClient() {
    return redis.createClient(this._options.redisOptions)
  }

  public static create(opts = {}) {
    return new LetsEncryptRedisChallenge(opts)
  }
}