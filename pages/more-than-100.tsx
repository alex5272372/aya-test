import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Grid from '../components/Grid'

const MoreThan100: NextPage = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/more-than-100')
      .then((res) => res.json())
      .then((data) => {
        setData(data.map((row: any) =>
          ({ ...row,
            employee: `${row.name} ${row.surname} (${row.id})`,
            department: `${row.d_name} (${row.d_id})`
          })))
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  const columns = [
    { name: 'num', type: 'number', title: 'Number' },
    { name: 'employee', type: 'string', title: 'Employee' },
    { name: 'donation', type: 'money', title: 'Donation' },
    { name: 'reward', type: 'money', title: 'Reward' },
    { name: 'department', type: 'string', title: 'Department' },
    { name: 'don_person', type: 'money', title: 'Don person' }
  ]

  return (
    <main>
      <Navbar active='more-than-100'/>
      <Grid columns={columns} data={data}/>
    </main>
  )
}

export default MoreThan100
