import ReactDOM from 'react-dom'
import Alert from '../../components/Alert/Alert'
import router from '../../router'
import ApiService from '../API/ApiService'
import { ApiResponse } from '../API/ApiResponse'
import TokenManagerServiceWrapper from './TokenManagerServiceWrapper'

class TokenManagerService {
  private static instance: TokenManagerService
  private exp: number
  private interval: any
  private initTime = 60 * 2
  private timeToRefresh = this.initTime

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
    const passed = this.exp - currentTime
    if (passed <= this.initTime) {
      this.timeToRefresh = passed
      return true
    }
    return false
    // return currentTime + this.timeToRefresh >= this.exp - 1180
  }

  private showTokenExpiredAlert() {
    const customAlert = document.createElement('div')
    document.body.appendChild(customAlert)

    const closeAlert = (clearStorage = true) => {
      if (clearStorage) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
      document.body.removeChild(customAlert)
    }

    const onClose = () => {
      closeAlert()
      router.navigate('/login', { state: { sessionTimeOut: true } })
    }

    const onRefresh = () => {
      const obtainToken = async () => {
        const newAccessToken = await ApiService.getInstance().getTokenFromRefresh()
        if (newAccessToken.responseCode !== ApiResponse.POSITIVE) {
          console.error('Nie udalo sie odswiezyc sesji')
        } else {
          localStorage.setItem('accessToken', newAccessToken.data?.access!)
          closeAlert(false)
          TokenManagerServiceWrapper.launch().setTokenManagerService()
        }
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
  }

  public static getInstance(exp: number): TokenManagerService {
    TokenManagerService.instance = new TokenManagerService(exp)
    return TokenManagerService.instance
  }
}

export default TokenManagerService
