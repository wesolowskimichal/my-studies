import ReactDOM from 'react-dom'
import Alert from '../../components/Alert/Alert'
import router from '../../router'
import ApiService from '../API/ApiService'
import { ApiResponse } from '../API/ApiResponse'

class TokenManagerService {
  private static instance: TokenManagerService
  private exp: number
  private interval: any
  private timeToRefresh = 60 * 2

  private constructor(exp: number) {
    this.exp = exp
    this.startTokenExpirationCheck()
  }

  private startTokenExpirationCheck() {
    this.interval = setInterval(() => {
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
    return currentTime + this.timeToRefresh >= this.exp
  }

  private showTokenExpiredAlert() {
    const customAlert = document.createElement('div')
    document.body.appendChild(customAlert)

    const closeAlert = () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user-data')
      document.body.removeChild(customAlert)
    }

    const onClose = () => {
      router.navigate('/login', { state: { sessionTimeOut: true } })
      closeAlert()
    }

    const onRefresh = () => {
      const obtainToken = async () => {
        const newAccessToken = await ApiService.getInstance().getTokenFromRefresh()
        if (newAccessToken.responseCode !== ApiResponse.POSITIVE) {
          console.error('Nie udalo sie odswiezyc sesji')
          onClose()
        }
        localStorage.setItem('accessToken', newAccessToken.data?.access!)
      }

      obtainToken()
    }

    ReactDOM.render(
      <Alert
        message="Sesja zaraz straci ważność!"
        onClose={onClose}
        timeToRefresh={this.timeToRefresh}
        onRefresh={onRefresh}
      />,
      customAlert
    )

    setTimeout(() => {
      closeAlert()
    }, this.timeToRefresh * 1000)
  }

  public static getInstance(exp: number): TokenManagerService {
    if (!TokenManagerService.instance) {
      TokenManagerService.instance = new TokenManagerService(exp)
    }
    return TokenManagerService.instance
  }
}

export default TokenManagerService
