import { createClient, RedisClientOptions, RedisClientType } from 'redis'

export interface GreenlockRedisChallengeOptions {
  prefix?: string
  redisOptions?: RedisClientOptions<any, any>
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
    return this._exec(challenge, async (id, client) =>
      challenge.keyAuthorization === null
        ? client.del(id).then(() => null)
        : client.set(id, challenge.keyAuthorization).then(() => null)
    )
  }

  public get({
    challenge
  }: ACMEChallengerMethodArgs): Promise<{ keyAuthorization: string } | null> {
    return this._exec<{ keyAuthorization: string } | null>(
      challenge,
      async (id, client) => {
        const keyAuthorization = await client.get(id)
        return keyAuthorization ? { keyAuthorization } : null
      }
    )
  }

  public remove({ challenge }: ACMEChallengerMethodArgs): Promise<null> {
    return this._exec(challenge, (id, client) =>
      client.del(id).then(() => null)
    )
  }

  private async _exec<T = null>(
    challenge: ACMEChallenge,
    fn: (id: string, client: RedisClientType<any, any>) => Promise<T>
  ): Promise<T> {
    const id = this._getId(challenge)
    const client = this._createClient()
    const ret = await fn(id, client)
    client.quit()
    return ret
  }

  private _getId({ identifier: { value }, token }: ACMEChallenge): string {
    return `${this._options.prefix}:${value}:${token}`
  }

  private _createClient(): RedisClientType<any, any> {
    return createClient(this._options.redisOptions)
  }

  public static create(
    opts: GreenlockRedisChallengeOptions = {}
  ): GreenlockRedisChallenge {
    return new GreenlockRedisChallenge(opts)
  }
}
