import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Dashbord = () => {
  const [message, setMessage] = useState("Loading....")

  useEffect(() => {
    const fetchMessage = async() => {
      try {
        const response = await axios.get("http://localhost:3000/up")
        setMessage(response)
        console.log(response, "response")
      } catch (error) {
        setMessage(error)
      }
    }

    fetchMessage();
  }, [])

  return (
    <div className='bg-amber-700'>
      {message}
    </div>
  )
}

export default Dashbord
