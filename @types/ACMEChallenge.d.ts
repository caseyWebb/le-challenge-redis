interface ACMEChallenge {
  identifier: { value: string }
  token: string
  keyAuthorization: string | null
}

interface ACMEChallengerMethodArgs {
  challenge: ACMEChallenge
}

interface ACMEChallenger {
  set(opts: ACMEChallengerMethodArgs): Promise<null>
  get(
    defaults: ACMEChallengerMethodArgs
  ): Promise<{ keyAuthorization: string } | null>
  remove(defaults: ACMEChallengerMethodArgs): Promise<null>
}
