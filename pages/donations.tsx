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
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  return (
    <main>
      <Navbar />
      <Grid columns={['id', 'date', 'amount', 'employeeId']} data={data}/>
    </main>
  )
}

export default Donations
