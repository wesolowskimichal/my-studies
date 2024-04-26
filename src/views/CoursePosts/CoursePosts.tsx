import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from './CoursePosts.module.scss'
import attachmentIcon from '../../assets/attachment_icon.svg'
import hidePostIcon from '../../assets/hidePost_icon.png'
import showPostIcon from '../../assets/showPost_icon.png'
import { RepositoryPost, User } from '../../components/interfaces'
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop'
import { context } from '../../services/UserContext/UserContext'
import { TeacherViewCourse } from '../TeacherView/TeacherViewCourse/TeacherViewCourse'

interface CoursePostsProps {
  repositoryId: string
  repositoryPosts: RepositoryPost[]
  setRepositoryPosts: Dispatch<SetStateAction<RepositoryPost[]>>
}

function CoursePosts({ repositoryId, repositoryPosts, setRepositoryPosts }: CoursePostsProps) {
  const [postContentVisibility, setPostContentVisibility] = useState<boolean[]>(
    Array(repositoryPosts?.length).fill(true)
  )
  const [files, setFiles] = useState<File[]>([])
  const [oUser, setOUser] = useState<User | null>(null)

  const { user } = context()

  useEffect(() => {
    setOUser(user)
  }, [user])

  useEffect(() => {
    setPostContentVisibility(Array(repositoryPosts?.length).fill(true))
  }, [repositoryPosts])

  const isTaskDone = (post: RepositoryPost): boolean => {
    return false
  }
  const togglePostContentVisibility = (index: number) => {
    setPostContentVisibility(prevState => prevState.map((value, i) => (i === index ? !value : value)))
  }

  const stringifyDate = (dueDate: Date): string => {
    return dueDate.toString()
  }

  const getCssPostHeaderClass = (repositoryPost: RepositoryPost): string => {
    if (repositoryPost.pinned) {
      return styles.Pinned
    } else if (repositoryPost.isTask) {
      return styles.Task
    }
    return ''
  }

  return oUser && oUser.user_type === 'Teacher' ? (
    <>
      <TeacherViewCourse repositoryId={repositoryId} setRepositoryPosts={setRepositoryPosts}>
        {repositoryPosts && repositoryPosts.length > 0 ? (
          <div className={styles.Wrapper}>
            <div className={styles.SideBar}>
              <h3>Tematy:</h3>
              {repositoryPosts?.map((post, index) => (
                <a href="#" key={index}>
                  {post.title}
                </a>
              ))}
            </div>
            <div className={styles.Content}>
              {repositoryPosts?.map((post, index) => (
                <div key={index} className={styles.Post}>
                  <div className={styles.PostHeader}>
                    <button onClick={() => togglePostContentVisibility(index)}>
                      <img
                        src={`${postContentVisibility[index] ? showPostIcon : hidePostIcon}`}
                        alt="Toggle Post Content"
                      />
                    </button>
                    <h1 className={getCssPostHeaderClass(post)}>{post.title}</h1>
                    {post.isTask && (
                      <div className={styles.PostHeaderFooterTaskInfo}>
                        {/* <h4>Otwarto: {stringifyDate(post.created_at)}</h4>
                        <h4>Wymagane do: {stringifyDate(post.due_to)}</h4> */}
                      </div>
                    )}
                  </div>
                  <div className={`${styles.PostContent} ${postContentVisibility[index] ? '' : styles.Hide}`}>
                    <p>{post.description}</p>
                    {post.attachment && (
                      <>
                        <a href={`${import.meta.env.VITE_APP_API_URL}${post?.attachment}`} target="_blank">
                          <img src={attachmentIcon} alt="Attachment Icon" />
                          Załącznik
                        </a>
                      </>
                    )}
                    {post.isTask &&
                      (isTaskDone(post) ? (
                        <p>as</p>
                      ) : (
                        <>
                          <DragAndDrop onFilesSelected={() => {}} />
                        </>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h1>Brak postów</h1>
        )}
      </TeacherViewCourse>
    </>
  ) : repositoryPosts && repositoryPosts.length > 0 ? (
    <div className={styles.Wrapper}>
      <div className={styles.SideBar}>
        <h3>Tematy:</h3>
        {repositoryPosts?.map((post, index) => (
          <a href="#" key={index}>
            {post.title}
          </a>
        ))}
      </div>
      <div className={styles.Content}>
        {repositoryPosts?.map((post, index) => (
          <div key={index} className={styles.Post}>
            <div className={styles.PostHeader}>
              <button onClick={() => togglePostContentVisibility(index)}>
                <img src={`${postContentVisibility[index] ? showPostIcon : hidePostIcon}`} alt="Toggle Post Content" />
              </button>
              <h1 className={getCssPostHeaderClass(post)}>{post.title}</h1>
              {post.isTask && (
                <div className={styles.PostHeaderFooterTaskInfo}>
                  {/* <h4>Otwarto: {stringifyDate(post.created_at)}</h4>
                  <h4>Wymagane do: {stringifyDate(post.due_to)}</h4> */}
                </div>
              )}
            </div>
            <div className={`${styles.PostContent} ${postContentVisibility[index] ? '' : styles.Hide}`}>
              <p>{post.description}</p>
              {post.attachment && (
                <>
                  <a href={`${import.meta.env.VITE_APP_API_URL}${post?.attachment}`} target="_blank">
                    <img src={attachmentIcon} alt="Attachment Icon" />
                    Załącznik
                  </a>
                </>
              )}
              {post.isTask &&
                (isTaskDone(post) ? (
                  <p>as</p>
                ) : (
                  <>
                    <DragAndDrop onFilesSelected={() => {}} />
                  </>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <h1>Brak postów</h1>
  )
}

export default CoursePosts
