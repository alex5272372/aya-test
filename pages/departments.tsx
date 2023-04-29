import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Grid from '../components/Grid'

const Departments: NextPage = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  const columns = [
    { name: 'id', type: 'number', text: 'ID' },
    { name: 'name', type: 'string', text: 'Name' }
  ]

  return (
    <main>
      <Navbar active='departments'/>
      <Grid columns={columns} data={data}/>
    </main>
  )
}

export default Departments
