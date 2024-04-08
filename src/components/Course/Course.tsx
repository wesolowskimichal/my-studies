import styles from './Course.module.scss'
import { Repository } from '../interfaces'
import { Link } from 'react-router-dom'

interface CourseProps {
  repository: Repository
}

function Course({ repository }: CourseProps) {
  const pictureSrc = repository.picture.startsWith('http')
    ? repository.picture
    : `${import.meta.env.VITE_APP_API_URL}${repository.picture}`
  return (
    <Link
      to={{
        pathname: `/course/${repository.id}`
      }}
      className={styles.Wrapper}
    >
      <img src={pictureSrc} alt="Course Image" />
      <h2>{repository.name}</h2>
      <p>
        <b>Prowadzący: </b>
        {repository.owners.map((user, index) => (
          <span key={index}>{`${user.first_name} ${user.last_name}${
            index < repository.owners.length - 1 ? ', ' : ''
          }`}</span>
        ))}
      </p>
    </Link>
  )
}

export default Course
