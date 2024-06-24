import { useState } from 'react'
import { Repository } from '../../components/interfaces'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import { context } from '../../services/UserContext/UserContext'
import Page from '../page/Page'
import { EditCourseView } from '../../views/EditCourseView/EditCourseView'

export const CreateCoursePage = () => {
  const { user } = context()
  const [loading, setLoading] = useState(false)
  const [repository, setRepository] = useState<Repository>({
    id: 'init',
    name: '',
    picture: '',
    newPicture: null,
    owners: user ? [user] : [],
    url: ''
  })

  const onSubmit = (repository: Repository) => {
    const changeRepository = async () => {
      const response = await ApiService.getInstance().createRepository(repository)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setRepository(response.data!)
      }
      return response.responseCode
    }

    return changeRepository()
  }

  return (
    <Page name="Stwórz Kurs" teacherOnly={true}>
      {loading ? (
        <div className="centeredLoader"></div>
      ) : (
        <EditCourseView repository={repository!} onSubmit={onSubmit} creating={true} />
      )}
    </Page>
  )
}
