import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Page from '../page/Page'
import ApiService from '../../services/API/ApiService'
import { ApiResponse } from '../../services/API/ApiResponse'
import { Repository } from '../../components/interfaces'
import { EditCourseView } from '../../views/EditCourseView/EditCourseView'

export const EditCourse = () => {
  const { id } = useParams<{ id: string }>()

  const [repository, setRepository] = useState<Repository | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getRepository = async () => {
      const response = await ApiService.getInstance().getRepository(id!)
      if (response.responseCode === ApiResponse.POSITIVE) {
        setRepository(response.data)
        setLoading(false)
      } else {
        console.error(`Error fetching course: ' ${response.responseCode}`)
      }
    }
    getRepository()
  }, [])

  const onSubmit = (repository: Repository) => {
    const changeRepository = async () => {
      console.log('repository:')
      console.log(repository)

      const response = await ApiService.getInstance().changeRepository(repository)
      if (response.responseCode === ApiResponse.POSITIVE) {
        console.log('response:')
        console.log(response)

        setRepository(response.data)
      }
      return response.responseCode
    }

    return changeRepository()
  }

  return (
    <Page name="Edytuj Kurs" teacherOnly={true}>
      {loading ? (
        <div className="centeredLoader"></div>
      ) : (
        <EditCourseView repository={repository!} onSubmit={onSubmit} />
      )}
    </Page>
  )
}
