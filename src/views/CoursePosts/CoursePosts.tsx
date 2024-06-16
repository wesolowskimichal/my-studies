import { useEffect, useRef, useState } from 'react'
import styles from './CoursePosts.module.scss'
import attachmentIcon from '../../assets/attachment_icon.svg'
import hidePostIcon from '../../assets/hidePost_icon.png'
import showPostIcon from '../../assets/showPost_icon.png'
import { RepositoryPost, RepositoryTaskResponse, RepositoryTaskResponseComment } from '../../components/interfaces'
import DragAndDrop from '../../components/DragAndDrop/DragAndDrop'
import { context } from '../../services/UserContext/UserContext'
import { useNavigate } from 'react-router-dom'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import sendIcon from '../../assets/sendIcon.svg'
import forwardIcon from '../../assets/forwardIcon.svg'

interface CoursePostsProps {
  post: RepositoryPost
  postContentVisibility: boolean
  togglePostContentVisibility: () => void
  repositoryId: string
  asView?: boolean
}

function CoursePosts({
  post,
  postContentVisibility,
  togglePostContentVisibility,
  repositoryId,
  asView = false
}: CoursePostsProps) {
  const { user } = context()
  const navigate = useNavigate()
  const [response, setResponse] = useState<RepositoryTaskResponse | null>(null)
  const [taskState, setTaskState] = useState<'view' | 'closed' | 'edit' | 'upload'>('view')
  const [editingTask, setEditingTask] = useState(false)
  const [comments, setComments] = useState<RepositoryTaskResponseComment[]>([])
  const [commentMessage, setCommentMessage] = useState('')
  const postHeaderRef = useRef<HTMLDivElement>(null)
  const postContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchResponse = async () => {
      const response = await ApiService.getInstance().getTaskResponse(repositoryId, post.id!)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setResponse(response.data)
        const currentDate = new Date()
        const dueTo = new Date(post.due_to)
        if (currentDate > dueTo || response.data!.mark) {
          setTaskState('closed')
        } else {
          setTaskState('edit')
        }
      } else {
        setTaskState('upload')
      }
    }

    if (user && user.user_type === 'Student' && post.isTask) {
      fetchResponse()
    }
  }, [user, post])

  useEffect(() => {
    const fetchComments = async () => {
      const commentsResponse = await ApiService.getInstance().getTaskResponseComment(
        repositoryId,
        post.id!,
        response!.id!
      )
      if (commentsResponse.responseCode === ApiResponse.POSITIVE) {
        setComments(commentsResponse.data!)
      }
    }
    if (user && user.user_type === 'Student' && post.isTask && response) {
      fetchComments()
    }
  }, [user, post, response])

  useEffect(() => {
    console.log(taskState)
  }, [taskState])

  const onPostSend = (file: File) => {
    const postResponse = async () => {
      const response = await ApiService.getInstance().sendTaskResponse(repositoryId, post.id!, file)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setResponse(response.data)
      }
    }
    postResponse()
    setEditingTask(false)
  }

  const onPutSend = (file: File) => {
    const putResponse = async () => {
      const response = await ApiService.getInstance().updateTaskResponse(repositoryId, post.id!, file)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setResponse(response.data)
      }
    }
    putResponse()
    setEditingTask(false)
  }

  const sendComment = () => {
    const postComment = async () => {
      const commentResponse = await ApiService.getInstance().sendTaskResponseComment(
        repositoryId,
        post.id!,
        response!.id!,
        commentMessage
      )
      if (commentResponse.responseCode === ApiResponse.POSITIVE) {
        setComments(prevComments => [commentResponse.data!, ...prevComments])
      }
    }
    postComment()
    setCommentMessage('')
  }

  const stringifyDate = (dueDate: Date | undefined): string => {
    if (!dueDate) {
      return ''
    }

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }

    return new Date(dueDate).toLocaleDateString('pl-PL', options)
  }

  const getCssPostHeaderClass = (repositoryPost: RepositoryPost): string => {
    if (repositoryPost.pinned) {
      return styles.Pinned
    } else if (repositoryPost.isTask) {
      return styles.Task
    }
    return ''
  }

  return (
    <>
      <div className={styles.Post}>
        <div className={styles.Left}>
          <div className={styles.PostHeader} ref={postHeaderRef}>
            <button onClick={() => togglePostContentVisibility()}>
              <img src={`${postContentVisibility ? showPostIcon : hidePostIcon}`} alt="Toggle Post Content" />
            </button>
            <h1 className={getCssPostHeaderClass(post)}>
              {post.title}
              {post.isTask &&
                (taskState === 'edit' ? (
                  <span style={{ color: '#76FF7A' }}> | Przesłano</span>
                ) : (
                  taskState === 'closed' && <span style={{ color: '#FA5F55' }}> | Zamknięte</span>
                ))}
            </h1>
            {post.isTask && taskState === 'closed' && (
              <h2 style={{ textAlign: 'right' }}>Ocena: {response?.mark?.toString() ?? 'Nie ocenione'}</h2>
            )}
            {post.isTask && (
              <div className={styles.PostHeaderFooterTaskInfo}>
                <h4>Otwarto: {stringifyDate(post.created_at ?? new Date())}</h4>
                <h4>Wymagane do: {stringifyDate(post.due_to)}</h4>
              </div>
            )}
            {!asView && user && user.user_type === 'Teacher' && (
              <div className={styles.TeacherOptions}>
                <button
                  className={styles.EditButton}
                  onClick={() => navigate(`/course/${repositoryId}/post/${post.id}`)}
                >
                  Edit
                </button>
                {post.isTask && (
                  <button
                    className={styles.EditButton}
                    onClick={() => navigate(`/course/${repositoryId}/task/${post.id}`)}
                    title="Przejdź"
                  >
                    <img src={forwardIcon} alt="Przejdź" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={`${styles.PostContent} ${postContentVisibility ? '' : styles.Hide}`} ref={postContentRef}>
            <textarea
              readOnly
              disabled
              ref={textarea => {
                if (textarea) {
                  textarea.style.height = ''
                  textarea.style.height = `${textarea.scrollHeight}px`
                }
              }}
              value={post.description}
            />

            {asView && post.localAttachment ? (
              <>
                <a href={post.localAttachment} target="_blank">
                  <img src={attachmentIcon} alt="Attachment Icon" />
                  Załącznik
                </a>
              </>
            ) : (
              post.attachment && (
                <>
                  <a href={`${import.meta.env.VITE_APP_API_URL}${post.attachment}`} target="_blank">
                    <img src={attachmentIcon} alt="Attachment Icon" />
                    Załącznik
                  </a>
                </>
              )
            )}
            {post.isTask &&
              (taskState === 'upload' ? (
                <DragAndDrop onSend={onPostSend} />
              ) : taskState === 'edit' ? (
                <>
                  <h3 style={{ margin: '0', paddingLeft: '1rem' }}>Przesłane pliki:</h3>
                  {editingTask ? (
                    <DragAndDrop apiFiles={response!.attachment as string} onSend={onPutSend} />
                  ) : (
                    <>
                      <div className={styles.SentFiles}>
                        <a
                          href={`${
                            (response!.attachment as string).startsWith('http')
                              ? response!.attachment
                              : `${import.meta.env.VITE_APP_API_URL}${response!.attachment}`
                          }`}
                          target="_blank"
                        >
                          {(response!.attachment as string).split('/').splice(-1)}
                        </a>
                      </div>
                      <button onClick={() => setEditingTask(true)} className={styles.EditFilesButton}>
                        Edytuj Pliki
                      </button>
                    </>
                  )}
                </>
              ) : taskState === 'closed' ? (
                <>
                  <h3 style={{ margin: '0', paddingLeft: '1rem' }}>Przesłane pliki:</h3>
                  <div className={styles.SentFiles}>
                    <a
                      href={`${
                        (response!.attachment as string).startsWith('http')
                          ? response!.attachment
                          : `${import.meta.env.VITE_APP_API_URL}${response!.attachment}`
                      }`}
                      target="_blank"
                    >
                      {(response!.attachment as string).split('/').splice(-1)}
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <DragAndDrop disabled />
                </>
              ))}
          </div>
        </div>
        {post.isTask && taskState !== 'view' && (
          <div
            className={styles.Right}
            ref={right => {
              if (right && postContentRef.current && postHeaderRef.current) {
                right.style.height = `${postContentRef.current.offsetHeight + postHeaderRef.current.offsetHeight}px`
              }
            }}
          >
            <div className={styles.Comments}>
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className={styles.CommentWrapper}
                  style={comment.owner.id === user!.id ? { alignSelf: 'flex-end' } : {}}
                >
                  {comment.owner.id === user!.id ? (
                    <>
                      <p
                        className={`${styles.Comment} ${styles.MyComment}`}
                        title={comment.edited_at ? stringifyDate(comment.edited_at) : stringifyDate(comment.created_at)}
                      >
                        {comment.comment}
                      </p>
                    </>
                  ) : (
                    <p className={`${styles.Comment}`} title={stringifyDate(comment.edited_at)}>
                      {comment.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.Message}>
              <span
                className={styles.Textarea}
                role="textbox"
                contentEditable
                onInput={e => setCommentMessage(e.currentTarget.textContent ?? '')}
              ></span>
              <button onClick={() => sendComment()} className={styles.Send}>
                <img src={sendIcon} alt="Send" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CoursePosts
