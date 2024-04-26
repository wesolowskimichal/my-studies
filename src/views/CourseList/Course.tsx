import { Repository } from '../../components/interfaces'
import styles from './Course.module.scss'
import { Link } from 'react-router-dom'

interface CourseProps {
  repository: Repository
}

function Course({ repository }: CourseProps) {
  const pictureSrc = repository.picture.startsWith('http')
    ? repository.picture
    : `${import.meta.env.VITE_APP_API_URL}${repository.picture}`
  return (
    <>
      <img src={pictureSrc} alt="Course Image" className={styles.Img} />
      <h2 className={styles.Header}>{repository.name}</h2>
      <p className={styles.P}>
        <span>
          <b>Prowadzący: </b>
          {repository.owners.map((user, index) => (
            <span key={index}>{`${user.first_name} ${user.last_name}${
              index < repository.owners.length - 1 ? ', ' : ''
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
