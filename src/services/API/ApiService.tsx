import { Repository, RepositoryPost, Token, User } from '../../components/interfaces'
import axios, { AxiosRequestConfig } from 'axios'
import { ApiResponse } from './ApiResponse'
import { jwtDecode } from 'jwt-decode'
import { useUser } from '../UserContext/UserContext'

interface ApiServiceResponse<T> {
  data?: T
  responseCode: ApiResponse
}

class ApiService {
  private static instance: ApiService

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  public isTokenExpired(): Boolean {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        return true
      }
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000
      return decodedToken.exp! < currentTime
    } catch (error) {
      return true
    }
  }

  public getUserId(): string | undefined {
    if (this.isTokenExpired()) {
      return undefined
    }
    const token = localStorage.getItem('accessToken')
    const decodedToken = jwtDecode(token!)
    return decodedToken.user_id
  }

  public async getToken(username: string, password: string): Promise<ApiServiceResponse<Token>> {
    try {
      const response = await axios.post('/api/token/', {
        username: username,
        password: password
      })
      return { data: response.data, responseCode: ApiResponse.POSITIVE }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        return { data: undefined, responseCode: this.handleError(statusCode) }
      }
      return { data: undefined, responseCode: ApiResponse.BAD_RESPONSE }
    }
  }

  public async getTokenFromRefresh(): Promise<ApiServiceResponse<Token>> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        return { data: undefined, responseCode: ApiResponse.UNAUTHORIZED }
      }
      const response = await axios.post('/api/token/refresh/')
      return { data: { access: response.data, refresh: refreshToken }, responseCode: ApiResponse.POSITIVE }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        return { data: undefined, responseCode: this.handleError(statusCode) }
      }
      return { data: undefined, responseCode: ApiResponse.BAD_RESPONSE }
    }
  }

  public async getUser(): Promise<ApiServiceResponse<User>> {
    try {
      if (this.isTokenExpired()) {
        return { data: undefined, responseCode: ApiResponse.UNAUTHORIZED }
      }
      const response = await axios.get('/api/user/', this.getConfig())
      return { data: response.data, responseCode: ApiResponse.POSITIVE }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        return { data: undefined, responseCode: this.handleError(statusCode) }
      }
      return { data: undefined, responseCode: ApiResponse.BAD_RESPONSE }
    }
  }

  public async getUserById(id: string): Promise<ApiServiceResponse<User>> {
    try {
      const response = await axios.get(`/api/user/${id}`)
      return { data: response.data, responseCode: ApiResponse.POSITIVE }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        return { data: undefined, responseCode: this.handleError(statusCode) }
      }
      return { data: undefined, responseCode: ApiResponse.BAD_RESPONSE }
    }
  }

  public async getRepositories(): Promise<ApiServiceResponse<Repository[]>> {
    try {
      const response = await axios.get('/api/repositories/list/')
      return { data: response.data, responseCode: ApiResponse.POSITIVE }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        return { data: undefined, responseCode: this.handleError(statusCode) }
      }
      return { data: undefined, responseCode: ApiResponse.BAD_RESPONSE }
    }
  }

  public async getMyRepositories(): Promise<ApiServiceResponse<Repository[]>> {
    if (this.isTokenExpired()) {
      return { data: undefined, responseCode: ApiResponse.UNAUTHORIZED }
    }
    const getStudentRepositories = async (): Promise<Repository[]> => {
      try {
        const response = await axios.get('/api/user/repositories/', this.getConfig())
        return response.data
      } catch (error) {
        throw error
      }
    }

    const getTeacherRepositories = async (): Promise<Repository[]> => {
      try {
        const response = await axios.get('/api/teacher/repositories/', this.getConfig())
        return response.data
      } catch (error) {
        throw error
      }
    }

    try {
      // console.log(useUser().user)
      const repositories = await getTeacherRepositories()
      // useUser().user?.user_type.toLowerCase() == 'student'
      // ? await getStudentRepositories()
      // : await getTeacherRepositories()
      return { data: repositories, responseCode: ApiResponse.POSITIVE }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        return { data: undefined, responseCode: this.handleError(statusCode) }
      }
      return { data: undefined, responseCode: ApiResponse.BAD_RESPONSE }
    }
  }

  public async getRepository(id: string): Promise<ApiServiceResponse<Repository>> {
    try {
      const response = await axios.get(`/api/repository/${id}/`)
      return { data: response.data, responseCode: ApiResponse.POSITIVE }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        return { data: undefined, responseCode: this.handleError(statusCode) }
      }
      return { data: undefined, responseCode: ApiResponse.BAD_RESPONSE }
    }
  }

  public async getRepositoryPosts(repositoryId: string): Promise<ApiServiceResponse<RepositoryPost[]>> {
    try {
      if (this.isTokenExpired()) {
        return { data: undefined, responseCode: ApiResponse.UNAUTHORIZED }
      }
      const response = await axios.get(`/api/repository/${repositoryId}/posts/`, this.getConfig())
      return { data: response.data, responseCode: ApiResponse.POSITIVE }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.message)
        const statusCode = error.response?.status
        // to do: when user has is not enrolled should return 403 not 401
        if (error.message === 'Incorrect authentication credentials.') {
          return { data: undefined, responseCode: ApiResponse.FORBIDDEN }
        }
        return { data: undefined, responseCode: this.handleError(statusCode) }
      }
      return { data: undefined, responseCode: ApiResponse.BAD_RESPONSE }
    }
  }

  private getConfig(): AxiosRequestConfig<any> | undefined {
    const accessToken = localStorage.getItem('accessToken')
    if (this.isTokenExpired()) {
      return undefined
    }
    return {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  }

  private handleError(statusCode: Number | undefined): ApiResponse {
    switch (statusCode) {
      case 400:
        return ApiResponse.BAD_RESPONSE
      case 401:
        return ApiResponse.UNAUTHORIZED
      case 403:
        return ApiResponse.FORBIDDEN
      case 404:
        return ApiResponse.NOT_FOUND
      case 408:
        return ApiResponse.TIMEOUT
      case 500:
        return ApiResponse.INTERNAL_SERVER
      case 502:
        return ApiResponse.BAD_GATEWAY
      case 504:
        return ApiResponse.GATEWAY_TIMEOUT
      default:
        return ApiResponse.BAD_RESPONSE
    }
  }
}

export default ApiService
