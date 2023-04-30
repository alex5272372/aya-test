import { NextPage } from 'next'
import { ChangeEvent, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Grid from '../components/Grid'

const MoreThan10: NextPage = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [month, setMonth] = useState('2021-12')
  const [year, setYear] = useState('2021')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/more-than-10?month=${month}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.map((row: any) =>
          ({ ...row, employee: `${row.name} ${row.surname} (${row.id})` })))
        setLoading(false)
      })
  }, [month, year])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  const columns = [
    { name: 'employee', type: 'string', title: 'Employee' },
    { name: 'percent', type: 'percent', title: 'Percent' },
    { name: 'donation', type: 'money', title: 'Donation' },
    { name: 'monthly', type: 'money', title: 'Avg month' },
    { name: 'annual', type: 'money', title: 'Avg year' }
  ]

  const getFirstMonth = () => {
    const parts = month.split('-').map((el: string) => parseInt(el))
    return parts[1] > 5
      ? `${parts[0]}-${('0' + (parts[1] - 5)).slice(-2)}`
      : `${parts[0] - 1}-${('0' + (parts[1] + 7)).slice(-2)}`
  }

  const monthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value)
  }

  const yearChange = (event: ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value)
  }

  return (
    <main>
      <Navbar active='more-than-10'/>
      <form className='p-2'>
        <label>
          First month:
          <input readOnly className='mx-2 text-gray-950' type="month" value={getFirstMonth()} />
        </label>
        <label>
          Last month:
          <input className='mx-2 text-gray-950' type="month" value={month} onChange={monthChange} />
        </label>
        <label>
          Year:
          <input className='mx-2 text-gray-950' type="number" value={year} onChange={yearChange} />
        </label>
      </form>
      <Grid columns={columns} data={data}/>
    </main>
  )
}

export default MoreThan10
