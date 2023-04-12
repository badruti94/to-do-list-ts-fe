import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface DataForm {
  title: string;
  description: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: boolean;
}

interface Response {
  message?: string;
  data?: Task[];
}

export default function Home() {
  const [dataForm, setDataForm] = useState<DataForm>({ title: '', description: '' })
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchData = async () => {
    const response = await axios.get<Task[]>('http://localhost:5000/task')
    // console.log(response.data.data);

    setTasks(response.data)
  }
  useEffect(() => {
    fetchData()
  })

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value })
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const postData = async () => {
      await axios.post('http://localhost:5000/task', dataForm)
      setDataForm({title: '', description: ''})
      fetchData()
    }
    postData()
  }

  const handleSetDone = async (id: number) => {
    await axios.patch(`http://localhost:5000/task/${id}/done`)
    fetchData()
  }

  const handleDelete = async (id:number) => {
    await axios.delete(`http://localhost:5000/task/${id}`)
    fetchData()
  }


  return (
    <>
      <Head>
        <title>To do list</title>
      </Head>
      <main>
        <header>
          <h3>To do list</h3>
        </header>
        <section className='add-wrapper' >
          <form onSubmit={handleOnSubmit}>
            <button type='submit' >Add</button>
            <input type="text" name='title' value={dataForm.title} onChange={handleOnChange} />
            <textarea name='description' value={dataForm.description} onChange={handleOnChange}></textarea>
          </form>
        </section>
        <section className='task-list'>
          <ul>
            {tasks && tasks.map(task => (
              <li className={task.status ? 'done' : ''} key={task.id}>
                <div>
                  <p className='title'>{task.title} {task.status ? '(done)' : ''}</p>
                  <p>{task.description}</p>
                </div>
                <button onClick={() => handleSetDone(task.id)} >&#10003;</button>
                <button className='delete' onClick={() => handleDelete(task.id)} >X</button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}