import React, { useEffect, useState } from 'react'
import { Repository, RepositoryPost, User } from '../../components/interfaces'
import styles from './CoursePost.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import { CoursePostView } from '../../views/CoursePostView/CoursePostView'
import Page from '../page/Page'
import CoursePosts from '../../views/CoursePosts/CoursePosts'
import { usePopup } from '../../hooks/usePopup'
import trashIcon from '../../assets/trash_icon.svg'

type PageParams = {
  courseId: string
  postId?: string
}

export const CoursePost = () => {
  const navigate = useNavigate()
  const { setMessage, setPopupType, setTime, setTrigger, handleError, popup } = usePopup()

  const { courseId, postId } = useParams<PageParams>()
  const [post, setPost] = useState<RepositoryPost>({
    title: '',
    description: '',
    isTask: false,
    pinned: false,
    attachment: null,
    due_to: new Date()
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getPost = async () => {
      const response = await ApiService.getInstance().getPost(courseId!, postId!)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setPost(response.data!)
        setLoading(false)
      }
    }

    if (postId) {
      getPost()
    }
  }, [])

  const handlePostPost = (coursePost: RepositoryPost) => {
    const addCoursePost = async () => {
      const response = await ApiService.getInstance().addPost(coursePost, courseId!)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setPopupType('Info')
        setMessage('Pomyślnie dodano post')
        setTime(4)
        setTrigger(true)
      } else {
        setPopupType('Warning')
        setTime(4)
        handleError(response.responseCode)
      }
    }

    const changeCoursePost = async () => {
      const response = await ApiService.getInstance().changePost(coursePost, courseId!, postId!)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setPopupType('Info')
        setMessage('Pomyślnie zaktualizowano post')
        setTime(4)
        setTrigger(true)
      } else {
        setPopupType('Warning')
        setTime(4)
        handleError(response.responseCode)
        setTrigger(true)
      }
    }

    postId ? changeCoursePost() : addCoursePost()
  }

  const handleDeletePost = () => {
    const deletePost = async () => {
      const response = await ApiService.getInstance().deletePost(courseId!, postId!)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setPopupType('Info')
        setMessage('Pomyślnie usunięto post')
        setTime(4)
        setTrigger(true)
      } else {
        setPopupType('Warning')
        setTime(4)
        handleError(response.responseCode)
        setTrigger(true)
      }
    }

    if (courseId && postId) deletePost()
  }

  const { content, postValue } = CoursePostView({ coursePost: post, onSubmit: handlePostPost })

  return (
    <>
      <Page name="Post" teacherOnly={true}>
        {loading ? (
          <div className="centeredLoader"></div>
        ) : (
          <div className={styles.Wrapper}>
            <div className={styles.EditView}>
              {postId && (
                <button onClick={() => handleDeletePost()}>
                  <img src={trashIcon} alt="Usuń" />
                </button>
              )}
              <h1>{postId ? <>Edycja wpisu</> : <>Tworzenie wpisu</>}:</h1>
              {content}
            </div>
            <div className={styles.PreviewView}>
              <CoursePosts
                post={postValue}
                postContentVisibility={true}
                togglePostContentVisibility={() => {}}
                repositoryId={courseId!}
                asView={true}
              />
            </div>
          </div>
        )}
      </Page>
      {popup}
    </>
  )
}
