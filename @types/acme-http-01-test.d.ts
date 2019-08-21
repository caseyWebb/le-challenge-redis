declare module 'acme-http-01-test' {
  type ACMETestType = 'http-01' | 'dns-01'
  class ACMETester {
    public static testRecord(
      type: ACMETestType,
      record: string,
      challenger: ACMEChallenger
    ): Promise<void>
  }
  export = ACMETester
}
