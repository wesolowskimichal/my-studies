import React from 'react'
import Header from '../../components/Header/Header'
import { context } from '../../services/UserContext/UserContext'
import { useTitle } from '../../hooks/useTitle'

type PageProps = {
  name: string
  children: React.ReactNode
}

const Page = ({ name, children }: PageProps) => {
  const { title } = context()
  useTitle(`${title} | ${name}`)
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default Page
