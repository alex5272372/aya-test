import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Grid from '../components/Grid'

const Rates: NextPage = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/rates')
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
      <Grid columns={['date', 'sign', 'value']} data={data}/>
    </main>
  )
}

export default Rates
