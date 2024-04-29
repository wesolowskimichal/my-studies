import { jwtDecode } from 'jwt-decode'
import TokenManagerService from './TokenManagerService'

class TokenManagerServiceWrapper {
  private static instance: TokenManagerServiceWrapper
  private serviceTkm?: TokenManagerService

  private constructor() {}

  public static launch(): TokenManagerServiceWrapper {
    if (!TokenManagerServiceWrapper.instance) {
      TokenManagerServiceWrapper.instance = new TokenManagerServiceWrapper()
    }
    return TokenManagerServiceWrapper.instance
  }

  public setTokenManagerService(): void {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return
    try {
      const decodedToken = jwtDecode(accessToken)
      this.serviceTkm = TokenManagerService.getInstance(decodedToken.exp!)
    } catch (error) {
      console.error(error)
      return
    }
  }

  public getTokenManagerService(): TokenManagerService | undefined {
    return this.serviceTkm
  }
}

export default TokenManagerServiceWrapper
