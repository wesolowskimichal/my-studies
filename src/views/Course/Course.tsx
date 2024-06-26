import { Repository } from '../../components/interfaces'
import basic_styles from './Course.module.scss'
import { Link } from 'react-router-dom'

interface CourseProps {
  repository: Repository
  styles?: CSSModuleClasses
}

function Course({ repository, styles }: CourseProps) {
  const pictureSrc =
    repository.picture && repository.picture.startsWith('http')
      ? repository.picture
      : `${import.meta.env.VITE_APP_API_URL}${repository.picture}`

  return (
    <Link
      to={{
        pathname: `/course/${repository.id}`
      }}
      className={styles?.Wrapper || basic_styles.Wrapper}
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
