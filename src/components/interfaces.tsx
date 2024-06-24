export interface AccountType {
  id: string
  type: string
}

export interface Token {
  access: string
  refresh: string
}

export interface User {
  username: string
  id: string
  first_name: string
  last_name: string
  user_type: 'Student' | 'Teacher'
  picture: string
  newPicture?: File | null
  email: string
}

export interface Repository {
  id: string
  name: string
  picture: string
  newPicture?: File | null
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
  id?: string
  owner?: User
  repository?: Repository
  title: string
  description: string
  attachment: File | null
  maxMark?: number
  localAttachment?: string
  isTask: boolean
  pinned: boolean
  due_to: Date
  created_at?: Date
}

export interface RepositoryTaskResponse {
  id?: string
  owner: User
  task: RepositoryPost
  attachment: File | string
  uploaded_at: Date
  mark: Number | null
}

export interface RepositoryTaskResponseComment {
  owner: User
  comment: string
  repository_task_response: RepositoryTaskResponse
  created_at: Date
  edited_at: Date
}

export interface Notification {
  owner: User
  is_read: boolean
  message: string
  sent_at: Date
}
