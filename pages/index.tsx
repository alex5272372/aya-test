import { NextPage } from 'next'
import Navbar from '../components/Navbar'
import { ChangeEvent, FormEvent, useState } from 'react'
import axios from 'axios'

const Home: NextPage = () => {
  const [file, setFile] = useState(null as null | File)
  const [message, setMessage] = useState('')

  const fileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFile(event.target.files[0])
  }

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    setMessage(new Date().getTime() + ': start')
    event.preventDefault()
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
    }

    axios.post('/api/file', formData, config)
      .then (res => {
        setMessage(prev => prev + '; ' + new Date().getTime() + ': ' + res.data.message)
      })
  }

  return (
    <main>
      <Navbar active=''/>
      <form className='p-2' encType='multipart/form' onSubmit={submitForm}>
        <label>
          File with data:
          <input className='mx-2' id='file' name='file' type="file" onChange={fileChange} />
          <button className='px-10 py-2 border-2 rounded-lg bg-slate-800' type='submit'>Upload</button>
          <span className='px-5'>{message}</span>
        </label>
      </form>
    </main>
  )
}

export default Home
