import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Grid from '../components/Grid'

const Statements: NextPage = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/statements')
      .then((res) => res.json())
      .then((data) => {
        setData(data.map((row: any) =>
          ({ ...row, employee: `${row.employee.name} ${row.employee.surname} (${row.employee.id})` })))
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  const columns = [
    { name: 'id', type: 'number', title: 'ID' },
    { name: 'date', type: 'date', title: 'Date' },
    { name: 'amount', type: 'money', title: 'Amount' },
    { name: 'employee', type: 'string', title: 'Employee' }
  ]

  return (
    <main>
      <Navbar active='statements'/>
      <Grid columns={columns} data={data}/>
    </main>
  )
}

export default Statements
