import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Grid from '../components/Grid'

const Employees: NextPage = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/employees')
      .then((res) => res.json())
      .then((data) => {
        setData(data.map((row: any) =>
          ({ ...row, department: `${row.department.name} (${row.department.id})` })))
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  const columns = [
    { name: 'id', type: 'number', title: 'ID' },
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'surname', type: 'string', title: 'Surname' },
    { name: 'department', type: 'string', title: 'Department' }
  ]

  return (
    <main>
      <Navbar active='employees'/>
      <Grid columns={columns} data={data}/>
    </main>
  )
}

export default Employees
