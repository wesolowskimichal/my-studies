import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ApiService from '../../../services/API/ApiService'
import styles from './Profile.module.scss'
import { ApiResponse } from '../../../services/API/ApiResponse'
import { User } from '../../../components/interfaces'
import Page from '../../page/Page'
import CourseList from '../../../views/CourseList/CourseList'

function Profile() {
  const { id } = useParams<{ id: string }>()
  const [isOwner, setIsOwner] = useState(id === ApiService.getInstance().getUserId())
  const [user, setUser] = useState<User>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const response = await ApiService.getInstance().getUserById(id!)
      if (response.responseCode !== ApiResponse.POSITIVE) {
        console.error(`Error fetching profile: ${response.responseCode}`)
        return
      }
      const user = response.data
      setUser(user)
    }

    if (!id) {
      navigate('/')
      return
    }
    fetchUser()
  }, [])

  return (
    <Page name="My-Studies | Profil">
      <div className={styles.Wrapper}>
        <aside>
          <h2>{user?.user_type}</h2>
          <img
            src={`${
              user?.picture.startsWith('http') ? user.picture : `${import.meta.env.VITE_APP_API_URL}${user?.picture}`
            }`}
            alt="user-profile-picture"
          />
          <div className={styles.HeaderInfoWrapper}>
            <div className={`${styles.HeaderInfo} ${isOwner && styles.HeaderInfoOwner}`}>
              <p>Imię: {user?.first_name}</p>
              <p>Nazwisko: {user?.last_name}</p>
              <p>Email: {user?.email}</p>
            </div>
            {isOwner && (
              <div className={styles.HeaderOptions}>
                <button>Zmień hasło</button>
              </div>
            )}
          </div>
        </aside>
        <div className={styles.Content}>
          {isOwner ? (
            <>
              <header>
                <h1>Repozytoria</h1>
              </header>
              <CourseList />
            </>
          ) : (
            <div>
              <p>dupa</p>
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

export default Profile
