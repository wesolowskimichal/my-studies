export interface AccountType {
  id: string
  type: string
}

export interface Token {
  access: string
  refresh: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
  user_type: 'Student' | 'Teacher'
  picture: string
  email: string
}

export interface Repository {
  id: string
  name: string
  picture: string
  owners: User[]
  url: string
}

export interface RepositoryEnrolment {
  id: string
  user: User
  repository: Repository
  status: boolean
}

export interface RepositoryPost {
  id: string
  owner: User
  repository: Repository
  title: string
  description: string
  attachment?: string
  isTask: boolean
  pinned: boolean
  due_to: Date
  created_at: Date
}

export interface RepositoryTaskResponse {
  id: string
  owner: User
  task: RepositoryPost
  attachment: File
  uploaded_at: Date
  mark: Number
}

export interface RepositoryTaskResponseComment {
  owner: User
  repository_task_response: RepositoryTaskResponse
  comment: string
}

export interface Notification {
  owner: User
  is_read: boolean
  message: string
  sent_at: Date
}
