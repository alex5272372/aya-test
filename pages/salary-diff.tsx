import { NextPage } from 'next'
import { ChangeEvent, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Grid from '../components/Grid'

const SalaryDiff: NextPage = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [year, setYear] = useState('2021')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/salary-diff?year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.map((row: any) =>
          ({ ...row,
            department: `${row.d_name} (${row.d_id})`,
            employee: `${row.e_name} ${row.e_surname} (${row.e_id})`
          })))
        setLoading(false)
      })
  }, [year])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>

  const columns = [
    { name: 'department', type: 'string', title: 'Department' },
    { name: 'diff', type: 'money', title: 'Diff avg' },
    { name: 'min_annual', type: 'money', title: 'Min avg' },
    { name: 'max_annual', type: 'money', title: 'Max avg' },
    { name: 'employee', type: 'string', title: 'Employee' },
    { name: 'annual', type: 'money', title: 'Avg year' },
    { name: 'percent', type: 'percent', title: 'Percent' },
    { name: 'min_salary', type: 'money', title: 'Min salary' },
    { name: 'max_salary', type: 'money', title: 'Max salary' },
    { name: 'last_salary', type: 'money', title: 'Last salary' }
  ]

  const yearChange = (event: ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value)
  }

  return (
    <main>
      <Navbar active='salary-diff'/>
      <form className='p-2'>
        <label>
          Year:
          <input className='mx-2 text-gray-950' type="number" value={year} onChange={yearChange} />
        </label>
      </form>
      <Grid columns={columns} data={data}/>
    </main>
  )
}

export default SalaryDiff
