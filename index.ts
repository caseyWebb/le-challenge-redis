import * as redis from 'redis'

export interface GreenlockRedisChallengeOptions {
  prefix?: string
  redisOptions?: redis.ClientOpts
}

export class GreenlockRedisChallenge implements ACMEChallenger {
  private _options: GreenlockRedisChallengeOptions = {
    prefix: 'letsencrypt-acme-challenge'
  }

  private constructor(opts: GreenlockRedisChallengeOptions) {
    Object.assign(this._options, opts)
  }

  public getOptions(): GreenlockRedisChallengeOptions {
    return this._options
  }

  public init(): null {
    return null
  }

  public set({ challenge }: ACMEChallengerMethodArgs): Promise<null> {
    return this._exec(challenge, (id, client, done): void => {
      client.set(id, challenge.keyAuthorization as string, (err): void =>
        done(err, null)
      )
    })
  }

  public get({
    challenge
  }: ACMEChallengerMethodArgs): Promise<{ keyAuthorization: string } | null> {
    return this._exec<{ keyAuthorization: string } | null>(
      challenge,
      (id, client, done): void => {
        client.get(id, (err, keyAuthorization): void =>
          done(err, keyAuthorization ? { keyAuthorization } : null)
        )
      }
    )
  }

  public remove({ challenge }: ACMEChallengerMethodArgs): Promise<null> {
    return this._exec(challenge, (id, client, done): void => {
      client.del(id, (err): void => done(err, null))
    })
  }

  private _exec<T = null>(
    challenge: ACMEChallenge,
    fn: (
      id: string,
      client: redis.RedisClient,
      done: (err: Error | null, ret: T) => void
    ) => void
  ): Promise<T> {
    const id = this._getId(challenge)
    const client = this._createClient()
    return new Promise((resolve, reject): void => {
      fn(id, client, (err, ret): void => {
        client.quit()
        if (err) {
          reject(err)
        } else {
          resolve(ret)
        }
      })
    })
  }

  private _getId({ identifier: { value }, token }: ACMEChallenge): string {
    return `${this._options.prefix}:${value}:${token}`
  }

  private _createClient(): redis.RedisClient {
    return redis.createClient(this._options.redisOptions)
  }

  public static create(
    opts: GreenlockRedisChallengeOptions = {}
  ): GreenlockRedisChallenge {
    return new GreenlockRedisChallenge(opts)
  }
}
