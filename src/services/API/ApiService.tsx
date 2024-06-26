import {
  Repository,
  RepositoryEnrolment,
  RepositoryPost,
  RepositoryTaskResponse,
  RepositoryTaskResponseComment,
  Token,
  User
} from '../../components/interfaces'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { ApiResponse } from './ApiResponse'
import { jwtDecode } from 'jwt-decode'

interface ApiServiceResponse<T> {
  data: T | null
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
    // @ts-ignore
    return decodedToken.user_id
  }

  private async apiRequest<T>(request: () => Promise<T>): Promise<ApiServiceResponse<T>> {
    try {
      const data = await request()
      return { data: data, responseCode: ApiResponse.POSITIVE }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = (error as AxiosError).response
        const statusCode = axiosError?.status
        return {
          data: null,
          responseCode: this.convertCodeToResponseCode(statusCode)
        }
      }
      return { data: null, responseCode: ApiResponse.BAD_RESPONSE }
    }
  }

  public async getToken(username: string, password: string): Promise<ApiServiceResponse<Token>> {
    const fetchToken = async () => {
      const response = await axios.post('/api/token/', {
        username: username,
        password: password
      })
      return response.data
    }

    return this.apiRequest(fetchToken)
  }

  public async getTeachers(): Promise<ApiServiceResponse<User[]>> {
    const fetchTeachers = async () => {
      const response = await axios.get('/api/teachers/', this.getConfig())
      return response.data
    }

    return this.apiRequest(fetchTeachers)
  }

  public async getEnrollments(repositoryId: Repository['id']): Promise<ApiServiceResponse<RepositoryEnrolment[]>> {
    const fetchEnrollments = async () => {
      const response = await axios.get(`/api/repository/${repositoryId}/members/`, this.getConfig())
      return response.data
    }

    return this.apiRequest(fetchEnrollments)
  }

  // not working, be urls should be fixed
  public async getEnrolledMembers(repositoryId: Repository['id']): Promise<ApiServiceResponse<RepositoryEnrolment[]>> {
    const fetchEnrolledMembers = async () => {
      const response = await axios.get(`/api/repository/${repositoryId}/members/True/`, this.getConfig())
      return response.data
    }

    return this.apiRequest(fetchEnrolledMembers)
  }

  public async changeEnrollment(
    repositoryId: Repository['id'],
    userId: User['id']
  ): Promise<ApiServiceResponse<RepositoryEnrolment[]>> {
    const chgEnrollment = async () => {
      const bodyParameters = {}
      const response = await axios.post(
        `/api/repository/${repositoryId}/member/${userId}`,
        bodyParameters,
        this.getConfig()
      )
      return response.data
    }

    return this.apiRequest(chgEnrollment)
  }

  public async sendTaskResponse(
    repositoryId: string,
    postId: string,
    attachment: File
  ): Promise<ApiServiceResponse<RepositoryTaskResponse>> {
    const postTaskResponse = async () => {
      const requestData = new FormData()
      requestData.append('attachment', attachment)
      const response = await axios.post(
        `/api/repository/${repositoryId}/post/${postId}/response`,
        requestData,
        this.getConfig(true)
      )
      return response.data
    }

    return this.apiRequest(postTaskResponse)
  }

  public async updateTaskResponse(
    repositoryId: string,
    postId: string,
    attachment: File
  ): Promise<ApiServiceResponse<RepositoryTaskResponse>> {
    const putTaskResponse = async () => {
      const requestData = new FormData()
      requestData.append('attachment', attachment)
      const response = await axios.put(
        `/api/repository/${repositoryId}/post/${postId}/response`,
        requestData,
        this.getConfig(true)
      )
      return response.data
    }

    return this.apiRequest(putTaskResponse)
  }

  public async getTaskResponseComment(
    repositoryId: string,
    postId: string,
    responseId: string
  ): Promise<ApiServiceResponse<RepositoryTaskResponseComment[]>> {
    const getComments = async () => {
      const response = await axios.get(
        `/api/repository/${repositoryId}/post/${postId}/response/${responseId}/comments`,
        this.getConfig()
      )
      return response.data
    }

    return this.apiRequest(getComments)
  }

  public async getTaskResponses(
    repositoryId: string,
    postId: string
  ): Promise<ApiServiceResponse<RepositoryTaskResponse[]>> {
    const getResponses = async () => {
      const response = await axios.get(`/api/repository/${repositoryId}/post/${postId}/responses`, this.getConfig())
      return response.data
    }

    return this.apiRequest(getResponses)
  }

  public async sendTaskResponseComment(
    repositoryId: string,
    postId: string,
    responseId: string,
    comment: string
  ): Promise<ApiServiceResponse<RepositoryTaskResponseComment>> {
    const postComment = async () => {
      const response = await axios.post(
        `/api/repository/${repositoryId}/post/${postId}/response/${responseId}/comments`,
        {
          comment: comment
        },
        this.getConfig()
      )
      return response.data
    }

    return this.apiRequest(postComment)
  }

  public async getTaskResponse(
    repositoryId: string,
    postId: string
  ): Promise<ApiServiceResponse<RepositoryTaskResponse>> {
    const fetchResponse = async () => {
      const response = await axios.get(`/api/repository/${repositoryId}/post/${postId}/response`, this.getConfig())
      return response.data
    }

    return this.apiRequest(fetchResponse)
  }

  public async setGRadeToTaskResponse(
    repositoryId: string,
    postId: string,
    responseId: string,
    mark: number
  ): Promise<ApiServiceResponse<RepositoryTaskResponse>> {
    const postGrade = async () => {
      const response = await axios.post(
        `/api/repository/${repositoryId}/post/${postId}/responses/${responseId}`,
        { mark: mark },
        this.getConfig()
      )
      return response.data
    }

    return this.apiRequest(postGrade)
  }

  public async changeRepository(repository: Repository): Promise<ApiServiceResponse<Repository>> {
    const putRepository = async () => {
      const requestData = new FormData()
      requestData.append('name', repository.name)

      repository.owners.forEach((owner, index) => {
        requestData.append('owners', owner.id)
      })

      if (repository.newPicture) {
        requestData.append('picture', repository.newPicture)
      }

      const response = await axios.put(`/api/teacher/repository/${repository.id}/`, requestData, this.getConfig(true))

      return response.data
    }

    return this.apiRequest(putRepository)
  }

  public async getPost(
    repositoryId: Repository['id'],
    postId: RepositoryPost['id']
  ): Promise<ApiServiceResponse<RepositoryPost>> {
    const fetchPost = async () => {
      const resposnse = await axios.get(`/api/repository/${repositoryId}/post/${postId}`, this.getConfig())
      return resposnse.data
    }

    return this.apiRequest(fetchPost)
  }

  public async createRepository(repository: Repository): Promise<ApiServiceResponse<Repository>> {
    const postRepository = async () => {
      const requestData = new FormData()
      requestData.append('name', repository.name)
      if (repository.newPicture) {
        requestData.append('picture', repository.newPicture)
      }
      repository.owners.forEach((owner, index) => {
        requestData.append('owners', owner.id)
      })
      const response = await axios.post(`/api/repositories/list/`, requestData, this.getConfig(true))

      return response.data
    }

    return this, this.apiRequest(postRepository)
  }

  public async changePost(
    post: RepositoryPost,
    repositoryId: Repository['id'],
    postId: RepositoryPost['id']
  ): Promise<ApiServiceResponse<RepositoryPost>> {
    const putPost = async () => {
      const requestData = new FormData()
      requestData.append('title', post.title)
      requestData.append('description', post.description)
      requestData.append('pinned', post.pinned ? 'True' : 'False')
      requestData.append('isTask', post.isTask ? 'True' : 'False')
      requestData.append('due_to', post.due_to.toISOString())

      if (post.attachment instanceof File) {
        requestData.append('attachment', post.attachment)
        console.log(post.attachment)
      }

      const response = await axios.put(
        `/api/repository/${repositoryId}/post/${postId}`,
        requestData,
        this.getConfig(true)
      )
      return response.data
    }
    return this.apiRequest(putPost)
  }

  public async addPost(
    post: RepositoryPost,
    repositoryId: Repository['id']
  ): Promise<ApiServiceResponse<RepositoryPost>> {
    const postPost = async () => {
      const requestData = new FormData()
      requestData.append('title', post.title)
      requestData.append('description', post.description)
      requestData.append('pinned', post.pinned ? 'True' : 'False')
      requestData.append('isTask', post.isTask ? 'True' : 'False')
      requestData.append('due_to', post.due_to.toISOString())

      if (post.attachment instanceof File) {
        requestData.append('attachment', post.attachment)
      }

      const response = await axios.post(`/api/repository/${repositoryId}/posts/`, requestData, this.getConfig(true))

      return response.data
    }

    return this.apiRequest(postPost)
  }

  public sendEnrollmentRequest = (id: string): Promise<ApiServiceResponse<any>> => {
    const postEnrollment = async () => {
      const bodyParameters = {}
      const response = await axios.post(`/api/repository/${id}/`, bodyParameters, this.getConfig())
      return response.data
    }

    return this.apiRequest(postEnrollment)
  }

  public async getTokenRegister(
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string
  ): Promise<ApiServiceResponse<Token>> {
    const fetchToken = async (): Promise<Token> => {
      const response = await axios.post('/api/register/', {
        username: username,
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password
      })
      return response.data
    }

    const registerResponse = await this.apiRequest(fetchToken)
    if (registerResponse.responseCode === ApiResponse.POSITIVE) {
      return this.getToken(username, password)
    }

    return registerResponse
  }

  public async getTokenFromRefresh(): Promise<ApiServiceResponse<Token>> {
    const refreshToken = async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        return { data: null, responseCode: ApiResponse.UNAUTHORIZED }
      }
      const response = await axios.post(
        '/api/token/refresh/',
        {
          refresh: refreshToken
        },
        this.getConfig()
      )
      return response.data
    }
    return this.apiRequest(refreshToken)
  }

  public async getUser(): Promise<ApiServiceResponse<User>> {
    const fetchUser = async () => {
      const response = await axios.get('/api/user/', this.getConfig())
      return response.data
    }

    return this.apiRequest(fetchUser)
  }

  public async deletePost(repositoryId: Repository['id'], postId: string): Promise<ApiServiceResponse<null>> {
    const delPost = async () => {
      const response = await axios.delete(`/api/repository/${repositoryId}/post/${postId}`, this.getConfig())
      return response.data
    }

    return this.apiRequest(delPost)
  }

  public async getUserById(id: string): Promise<ApiServiceResponse<User>> {
    const fetchUser = async () => {
      const response = await axios.get(`/api/user/${id}`)
      return response.data
    }

    return this.apiRequest(fetchUser)
  }

  public async getRepositories(): Promise<ApiServiceResponse<Repository[]>> {
    const fetchRepositories = async () => {
      const response = await axios.get('/api/repositories/list/')
      return response.data
    }

    return this.apiRequest(fetchRepositories)
  }

  // public async getStudentRepositories(): Promise<ApiServiceResponse<RepositoryEnrolment[]>> {
  //   const fetchStudentRepositories = async (): Promise<RepositoryEnrolment[]> => {
  //     const response = await axios.get('/api/user/repositories/', this.getConfig())
  //     return response.data
  //   }
  //   return this.apiRequest(fetchStudentRepositories)
  // }

  // public async getTeacherRepositories(): Promise<ApiServiceResponse<Repository[]>> {
  //   const fetchTeacherRepositories = async (): Promise<Repository[]> => {
  //     const response = await axios.get('/api/teacher/repositories/', this.getConfig())
  //     return response.data
  //   }
  //   return this.apiRequest(fetchTeacherRepositories)
  // }

  public async getMyRepositories(userType: User['user_type']): Promise<ApiServiceResponse<Repository[]>> {
    const fetchStudentRepositories = async (): Promise<RepositoryEnrolment[]> => {
      const response = await axios.get('/api/user/repositories/', this.getConfig())
      return response.data
    }

    const fetchTeacherRepositories = async (): Promise<Repository[]> => {
      const response = await axios.get('/api/teacher/repositories/', this.getConfig())
      return response.data
    }

    if (userType === 'Student') {
      const repositoryEnrolmentsResponse = await this.apiRequest(fetchStudentRepositories)
      if (repositoryEnrolmentsResponse.responseCode === ApiResponse.POSITIVE) {
        const repositories =
          repositoryEnrolmentsResponse.data &&
          repositoryEnrolmentsResponse.data
            .filter(repositoryEnrolment => repositoryEnrolment.status)
            .map(repositoryEnrolment => repositoryEnrolment.repository)
        return { data: repositories, responseCode: ApiResponse.POSITIVE }
      }
    }

    return this.apiRequest(fetchTeacherRepositories)
  }

  public async changeUser(user: User): Promise<ApiServiceResponse<User>> {
    const putUser = async () => {
      const requestData = new FormData()
      requestData.append('username', user.username)
      requestData.append('email', user.email)
      requestData.append('first_name', user.first_name)
      requestData.append('last_name', user.last_name)
      requestData.append('user_type', user.user_type)
      if (user.newPicture) {
        requestData.append('picture', user.newPicture)
      }

      const response = await axios.put('/api/user/', requestData, this.getConfig(true))
      return response.data
    }

    return this.apiRequest(putUser)
  }

  public async getRepository(id: string): Promise<ApiServiceResponse<Repository>> {
    const fetchRepository = async () => {
      const response = await axios.get(`/api/repository/${id}/`)
      return response.data
    }

    return this.apiRequest(fetchRepository)
  }

  public async getRepositoryPosts(repositoryId: string): Promise<ApiServiceResponse<RepositoryPost[]>> {
    const fetchRepositoryPosts = async () => {
      const response = await axios.get(`/api/repository/${repositoryId}/posts/`, this.getConfig())
      return response.data
    }

    return this.apiRequest(fetchRepositoryPosts)
  }

  private getConfig(mutliplatformFormData = false): AxiosRequestConfig<any> | undefined {
    const accessToken = localStorage.getItem('accessToken')
    if (this.isTokenExpired()) {
      return undefined
    }
    if (mutliplatformFormData) {
      return {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    }
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  }

  private convertCodeToResponseCode(statusCode: Number | undefined): ApiResponse {
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
