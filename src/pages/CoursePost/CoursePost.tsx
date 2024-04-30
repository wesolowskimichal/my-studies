import React, { useEffect, useState } from 'react'
import { Repository, RepositoryPost, RepositoryPostFrame, User } from '../../components/interfaces'
import styles from './CoursePost.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import { CoursePostView } from '../../views/CoursePostView/CoursePostView'
import Page from '../page/Page'

type PageParams = {
  courseId: string
  postId?: string
}

export const CoursePost = () => {
  const navigate = useNavigate()
  const { courseId, postId } = useParams<PageParams>()
  const [post, setPost] = useState<RepositoryPost | null>(null)

  useEffect(() => {
    const getPost = async () => {
      const response = await ApiService.getInstance().getPost(courseId!, postId!)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setPost(response.data)
      }
    }

    if (postId) {
      getPost()
    }
  }, [])

  const handlePostPost = (coursePost: RepositoryPostFrame) => {
    const addCoursePost = async () => {
      const response = await ApiService.getInstance().addPost(coursePost, courseId!)
      if (response.responseCode === ApiResponse.POSITIVE) {
        console.log('posted')
        navigate(`/course/${courseId}`)
      } else {
        console.log('error')
      }
    }

    const changeCoursePost = async () => {
      const response = await ApiService.getInstance().changePost(coursePost, courseId!, postId!)
      if (response.responseCode === ApiResponse.POSITIVE) {
        console.log('post changed')
        navigate(`/course/${courseId}`)
      } else {
        console.log('post not changed')
      }
    }

    postId ? changeCoursePost() : addCoursePost()
  }

  return (
    <Page name="Post">
      <CoursePostView coursePost={post} setCoursePost={handlePostPost} />
    </Page>
  )
}
