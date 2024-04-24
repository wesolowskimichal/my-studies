import React from 'react'
import Header from '../../components/Header/Header'

type PageProps = {
  name: string
  children: React.ReactNode
}

const Page = ({ name, children }: PageProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default Page
