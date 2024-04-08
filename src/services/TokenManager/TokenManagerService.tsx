class TokenManagerService {
  private static instance: TokenManagerService
  private exp: number

  private constructor(exp: number) {
    this.exp = exp
    this.startTokenExpirationCheck()
  }

  // todo:
  //    1) ustawic na roznice miedzy exp a curr
  //    2) dodac sprawdzanie usuniecie tokenu oraz wystapienie api resonse unauthorized
  //    3) stop na wylogowaniu
  private startTokenExpirationCheck() {
    setInterval(() => {
      if (this.isTokenExpired()) {
        this.showTokenExpiredAlert()
      }
    }, 1000)
  }

  private isTokenExpired(): boolean {
    const currentTime = Math.floor(Date.now() / 1000)
    return currentTime >= this.exp
  }

  private showTokenExpiredAlert() {
    alert('Token wygasł! Zaloguj się ponownie.')
  }

  public static getInstance(exp: number): TokenManagerService {
    if (!TokenManagerService.instance) {
      TokenManagerService.instance = new TokenManagerService(exp)
    }
    return TokenManagerService.instance
  }
}

export default TokenManagerService
