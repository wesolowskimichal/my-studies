import axios from 'axios'
import { Repository } from '../interfaces'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../MainPage/Header/Header'
import styles from './CourseDetails.module.scss'

function CourseDetails() {
  const { id } = useParams<{ id: string }>()

  const getRepositoryFromAPI = async () => {
    try {
      const response = await axios.get(`/api/repository/${id}/`)
      if (response.status !== 200) {
        throw new Error('Bad response status')
      }
      return response.data
    } catch (error) {
      throw error
    }
  }
  const [repository, setRepository] = useState<Repository>()

  useEffect(() => {
    const getCourse = async () => {
      try {
        const repository = await getRepositoryFromAPI()
        console.log(repository)
        setRepository(repository)
      } catch (error) {
        console.error('Error fetching course: ', error)
      }
    }
    getCourse()
  }, [])
  return (
    <>
      <Header currentElement="all-courses" setCurrentElement={() => {}} />
      <div className={styles.Wrapper}>
        <div className={styles.Header}>
          <img src={`${import.meta.env.VITE_APP_API_URL}${repository?.picture}`} alt="Course Image" />
          <div className={styles.Info}>
            <h1>{repository?.name}</h1>
            <h3>
              Prowadzący:{' '}
              {repository?.owners.map((user, index) => (
                <span key={index}>{`${user.first_name} ${user.last_name}${
                  index < repository.owners.length - 1 ? ', ' : ''
                }`}</span>
              ))}
            </h3>
          </div>
        </div>
        <div className={styles.Content}>{repository?.id}</div>
      </div>
    </>
  )
}

export default CourseDetails
