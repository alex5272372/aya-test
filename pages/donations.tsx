import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Grid from '../components/Grid'

const Donations: NextPage = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/donations')
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
    { name: 'id', type: 'number', text: 'ID' },
    { name: 'date', type: 'date', text: 'Date' },
    { name: 'amount', type: 'money', text: 'Amount' },
    { name: 'employee', type: 'string', text: 'Employee' }
  ]

  return (
    <main>
      <Navbar active='donations'/>
      <Grid columns={columns} data={data}/>
    </main>
  )
}

export default Donations
