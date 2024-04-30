import styles from './LoggedPanel.module.scss'
import { Link } from 'react-router-dom'
import Dropdown, { MenuItem } from '../../Dropdown/Dropdown'
import ContentManagerService from '../../../services/ContentManager/ContentManagerService'
import { context } from '../../../services/UserContext/UserContext'

function LoggedPanel() {
  const { user } = context()
  const menuItems: MenuItem[] = [
    {
      itemTitle: 'Profil',
      itemOnClick: () => {
        ContentManagerService.getInstance().setRender('profile')
      },
      redirect: `/user/${user?.id}`
    },
    { itemTitle: 'Oceny', itemOnClick: () => console.log('Oceny'), redirect: '/' },
    { itemTitle: 'Wiadomości', itemOnClick: () => console.log('Wiadomości'), redirect: '/' },
    {
      itemTitle: 'Wyloguj',
      itemOnClick: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      },
      redirect: '/login'
    }
  ]

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Links}>
        <Link
          to="/"
          className={`${styles.Element} ${
            ContentManagerService.getInstance().getRender() === 'all-courses' && styles.Current
          }`}
          onClick={() => ContentManagerService.getInstance().setRender('all-courses')}
        >
          <span>Kursy</span>
        </Link>
        <Link
          to="/"
          className={`${styles.Element} ${
            ContentManagerService.getInstance().getRender() === 'my-courses' && styles.Current
          }`}
          onClick={() => ContentManagerService.getInstance().setRender('my-courses')}
        >
          <span>Moje Kursy</span>
        </Link>
      </div>
      <Dropdown title="Profil" menuItems={menuItems} />
    </div>
  )
}

export default LoggedPanel
