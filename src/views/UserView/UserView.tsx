import { User } from '../../components/interfaces'
import styles from './UserView.module.scss'

type UserViewProps = {
  user: User
}

export const UserView = ({ user }: UserViewProps) => {
  return (
    <div className={styles.UserRow}>
      <img
        src={user.picture.startsWith('http') ? user.picture : `${import.meta.env.VITE_APP_API_URL}${user.picture}`}
        alt="User picture"
      />
      <span>{`${user.first_name} ${user.last_name}`}</span>
      <span>{user.email}</span>
      <span>{user.user_type}</span>
    </div>
  )
}
