import TokenManagerService from './TokenManagerService'

class TokenManagerServiceWrapper {
  private static instance: TokenManagerServiceWrapper
  private serviceTkm?: TokenManagerService

  private constructor() {}

  public static getInstance(): TokenManagerServiceWrapper {
    if (!TokenManagerServiceWrapper.instance) {
      TokenManagerServiceWrapper.instance = new TokenManagerServiceWrapper()
    }
    return TokenManagerServiceWrapper.instance
  }

  public setTokenManagerService(exp: number): void {
    this.serviceTkm = TokenManagerService.getInstance(exp)
  }

  public getTokenManagerService(): TokenManagerService | undefined {
    return this.serviceTkm
  }
}

export default TokenManagerServiceWrapper
