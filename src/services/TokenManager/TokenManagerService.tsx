class TokenManagerService {
  private static instance: TokenManagerService
  private exp: number
  private interval: any

  private constructor(exp: number) {
    this.exp = exp
    this.startTokenExpirationCheck()
  }

  private startTokenExpirationCheck() {
    this.interval = setInterval(() => {
      console.log('a')
      if (this.isTokenExpired()) {
        this.showTokenExpiredAlert()
        clearInterval(this.interval)
      } else if (!localStorage.getItem('accessToken')) {
        clearInterval(this.interval)
      }
    }, 1000)
  }

  private isTokenExpired(): boolean {
    const currentTime = Math.floor(Date.now() / 1000)
    return currentTime >= this.exp
  }

  private showTokenExpiredAlert() {
    alert('Token wygasł! Zaloguj się ponownie.')
    localStorage.removeItem('accessToken')
  }

  public static getInstance(exp: number): TokenManagerService {
    if (!TokenManagerService.instance) {
      TokenManagerService.instance = new TokenManagerService(exp)
    }
    return TokenManagerService.instance
  }
}

export default TokenManagerService
