import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from './CourseDetails.module.scss'
import CoursePosts from '../../views/CoursePosts/CoursePosts'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import { Repository, RepositoryPost, User } from '../../components/interfaces'
import Page from '../page/Page'
import { context } from '../../services/UserContext/UserContext'

function CourseDetails() {
  enum ContentType {
    Logged = 'logged',
    Authorized = 'authorized',
    Anonymous = 'anonymous',
    Loading = 'loader',
    Waiting = 'waiting',
    WaitingTeacher = 'waitingTeacher'
  }

  const { user } = context()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [repository, setRepository] = useState<Repository>()
  const [repositoryPosts, setRepositoryPosts] = useState<RepositoryPost[]>([])
  const [contentType, setContentType] = useState<ContentType>(ContentType.Loading)
  const [postContentVisibility, setPostContentVisibility] = useState<boolean[]>(
    Array(repositoryPosts?.length).fill(true)
  )

  useEffect(() => {
    setPostContentVisibility(Array(repositoryPosts?.length).fill(true))
  }, [repositoryPosts])

  useEffect(() => {
    // TODO: moze jakos zoptymalizowac?
    // sprawdza tylko studentow
    const checkApproval = async (): Promise<boolean> => {
      if (user) {
        const response = await ApiService.getInstance().getMyRepositories(user.user_type)
        const repoCheck = response.data?.find(repository => repository.id === id)
        if (response.responseCode === ApiResponse.POSITIVE) {
          if (!repoCheck) {
            user.user_type === 'Student'
              ? setContentType(ContentType.Waiting)
              : setContentType(ContentType.WaitingTeacher)
            return false
          }
          return true
        }
      }
      return false
    }

    const getPosts = async () => {
      const response = await ApiService.getInstance().getRepositoryPosts(id!)
      if (response.responseCode !== ApiResponse.POSITIVE) {
        console.error(`Error fetching course: ' ${response.responseCode}`)
        if (response.responseCode === ApiResponse.FORBIDDEN) {
          setContentType(ContentType.Logged)
        } else if (response.responseCode === ApiResponse.UNAUTHORIZED) {
          setContentType(ContentType.Anonymous)
        }
        return
      }
      const shouldLoadPosts = await checkApproval()
      if (shouldLoadPosts) {
        const posts = response.data!
        posts.sort((a: RepositoryPost, b: RepositoryPost) => {
          const dateA = new Date(a.created_at!)
          const dateB = new Date(b.created_at!)
          if (a.pinned && !b.pinned) {
            return -1
          } else if (!a.pinned && b.pinned) {
            return 1
          } else {
            return dateA - dateB
          }
        })
        setRepositoryPosts(posts)
        setContentType(ContentType.Authorized)
      }
    }

    const getCourse = async () => {
      const response = await ApiService.getInstance().getRepository(id!)
      if (response.responseCode !== ApiResponse.POSITIVE) {
        console.error(`Error fetching course: ${response.responseCode}`)
        return
      }
      const repository = response.data!
      setRepository(repository)
      await getPosts()
    }
    getCourse()
  }, [user])

  const togglePostContentVisibility = (index: number) => {
    setPostContentVisibility(prevState => prevState.map((value, i) => (i === index ? !value : value)))
  }

  const renderContent = () => {
    switch (contentType) {
      case ContentType.Anonymous:
        return (
          <div className={styles.NotLoggedIn}>
            <span>
              <b>Musisz się zalogować aby zobaczyć szczegóły kursu </b>
            </span>
            <div>
              <Link to="/login">Zaloguj się</Link>
            </div>
          </div>
        )
      case ContentType.Logged:
        return (
          <div className={styles.NotAuthorized}>
            <span>
              <b>Nie został Ci przyznany dostęp do kursu</b>
            </span>
            <div>
              <a onClick={() => ApiService.getInstance().sendEnrollmentRequest(id!)}>Wyślij prośbę o dołączenie</a>
            </div>
          </div>
        )
      case ContentType.Waiting:
        return (
          <div className={styles.NotAuthorized}>
            <span>
              <b>Nie został Ci jescze przyznany dostęp do kursu. Właściciel musi zatwierdzić twoją prośbę.</b>
            </span>
            <div>
              <a onClick={() => ApiService.getInstance().sendEnrollmentRequest(id!)}>
                Wyślij ponownie prośbę o dołączenie
              </a>
            </div>
          </div>
        )
      case ContentType.WaitingTeacher:
        return (
          <div className={styles.NotAuthorized}>
            <span>
              <b>Nie zostało Ci przyznane członkostwo do kursu. Poproś właściciela o dodanie</b>
            </span>
          </div>
        )
      case ContentType.Loading:
        return <div className="loader"></div>
      case ContentType.Authorized:
        return (
          <>
            {user && user.user_type === 'Teacher' && (
              <nav className={styles.TeacherNav}>
                <button onClick={() => navigate(`/course/${id}/edit/`)}>Edytuj</button>
                <button onClick={() => navigate(`/course/${id}/post/`)}>Dodaj Post</button>
              </nav>
            )}
            {repositoryPosts && repositoryPosts.length > 0 ? (
              <div className={styles.CourseWrapper}>
                <div className={styles.CourseSideBar}>
                  <h3>Tematy:</h3>
                  {repositoryPosts.map((post, index) => (
                    <a href="#" key={index}>
                      {post.title}
                    </a>
                  ))}
                </div>
                <div className={styles.CourseContent}>
                  {repositoryPosts.map((post, index) => (
                    <CoursePosts
                      key={index}
                      post={post}
                      postContentVisibility={postContentVisibility[index]}
                      togglePostContentVisibility={() => togglePostContentVisibility(index)}
                      repositoryId={id!}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <h1>Brak postów</h1>
            )}
          </>
        )
    }
  }

  return (
    <Page name="Course Details">
      <div className={styles.Wrapper}>
        <div className={styles.Header}>
          <img src={`${import.meta.env.VITE_APP_API_URL}${repository?.picture}`} alt="Course Image" />
          <div className={styles.Info}>
            <h1>{repository?.name}</h1>
            <h3>
              Prowadzący:{' '}
              {repository?.owners.map((user, index) => (
                <span key={index}>
                  {user.first_name} {user.last_name}
                  {index < repository.owners.length - 1 ? ', ' : ''}
                </span>
              ))}
            </h3>
          </div>
        </div>
        <div className={styles.Content}>{renderContent()}</div>
      </div>
    </Page>
  )
}

export default CourseDetails
