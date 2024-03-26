export interface AccountType {
  id: Number
  type: string
}

export interface User {
  id: Number
  first_name: string
  last_name: string
  user_type: AccountType
  picture: string
}

export interface Repository {
  id: Number
  name: string
  picture: string
  owners: User[]
  url: string
}

export interface RepositoryEnrolment {
  id: Number
  user: User
  repository: Repository
  status: boolean
}

export interface RepositoryPost {
  id: Number
  owner: User
  repository: Repository
  title: string
  description: string
  attachment: File
  isTask: boolean
  pinned: boolean
  due_to: Date
  created_at: Date
}

export interface RepositoryTaskResponse {
  id: Number
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
