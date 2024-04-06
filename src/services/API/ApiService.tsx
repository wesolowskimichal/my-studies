import { Repository, RepositoryPost, User } from '../../components/interfaces'
import axios, { AxiosRequestConfig } from 'axios'

class ApiService {
  private static instance: ApiService

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  public async getUser(): Promise<User | ApiResponse> {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        return ApiResponse.UNAUTHORIZED
      }
      const response = await axios.get('/api/user/', this.getConfig())
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        return this.handleError(statusCode)
      }
      return ApiResponse.BAD_RESPONSE
    }
  }

  public async getRepository(id: string): Promise<Repository | ApiResponse> {
    try {
      const response = await axios.get(`/api/repository/${id}/`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        return this.handleError(statusCode)
      }
      return ApiResponse.BAD_RESPONSE
    }
  }

  public async getRepositoryPosts(repositoryId: string): Promise<RepositoryPost[] | ApiResponse> {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        return ApiResponse.UNAUTHORIZED
      }
      const response = await axios.get(`/api/repository/${repositoryId}/posts/`, this.getConfig())
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        // to do: when user has is not enrolled should return 403 not 401
        if (error.message === 'Incorrect authentication credentials.') {
          return ApiResponse.FORBIDDEN
        }
        return this.handleError(statusCode)
      }
      return ApiResponse.BAD_RESPONSE
    }
  }

  private getConfig(): AxiosRequestConfig<any> | undefined {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
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
