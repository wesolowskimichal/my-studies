import React, { useEffect, useState } from 'react'
import { RepositoryPost, User } from '../../../components/interfaces'
import { context } from '../../../services/UserContext/UserContext'
import ApiService from '../../../services/API/ApiService'
import { ApiResponse } from '../../../services/API/ApiResponse'
import { AddCoursePost } from '../../AddCoursePost/AddCoursePost'

type TeacherViewCoursePorps = {
  repositoryId: string
  setRepositoryPosts: React.Dispatch<React.SetStateAction<RepositoryPost[]>>
  children: React.ReactNode
}

export const TeacherViewCourse = ({ repositoryId, setRepositoryPosts, children }: TeacherViewCoursePorps) => {
  const { user } = context()
  const [oUser, setOUser] = useState<User | null>(user)

  useEffect(() => {
    setOUser(user)
  }, [user])

  const handlePostPost = (coursePost: RepositoryPost) => {
    const addCoursePost = async () => {
      if (oUser) {
        const response = await ApiService.getInstance().addPost(oUser.user_type, coursePost, repositoryId)
        if (response.responseCode === ApiResponse.POSITIVE) {
          setRepositoryPosts(prevRepositoryPosts => [...prevRepositoryPosts, coursePost])
        } else {
          console.log('error')
        }
      } else {
        console.log('no oUser')
      }
    }

    addCoursePost()
  }

  return (
    <>
      <nav>
        <AddCoursePost setCoursePost={handlePostPost} />
      </nav>
      {children}
    </>
  )
}
