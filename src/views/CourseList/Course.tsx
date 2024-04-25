import { RepositoryEnrolment } from '../../components/interfaces'
import styles from './Course.module.scss'
import { Link } from 'react-router-dom'

interface CourseProps {
  repositoryEnrolment: RepositoryEnrolment
}

function Course({ repositoryEnrolment }: CourseProps) {
  const pictureSrc = repositoryEnrolment.repository.picture.startsWith('http')
    ? repositoryEnrolment.repository.picture
    : `${import.meta.env.VITE_APP_API_URL}${repositoryEnrolment.repository.picture}`
  console.log(repositoryEnrolment)
  return (
    <>
      <img src={pictureSrc} alt="Course Image" className={styles.Img} />
      <h2 className={styles.Header}>{repositoryEnrolment.repository.name}</h2>
      <p className={styles.P}>
        <span>
          <b>Prowadzący: </b>
          {repositoryEnrolment.repository.owners.map((user, index) => (
            <span key={index}>{`${user.first_name} ${user.last_name}${
              index < repositoryEnrolment.repository.owners.length - 1 ? ', ' : ''
            }`}</span>
          ))}
        </span>
      </p>
      <div className={styles.Buttons}>
        <button className={styles.Remove}></button>
        <button>przejdz</button>
      </div>
    </>
  )
}

export default Course
