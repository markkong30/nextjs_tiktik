import type { NextPage } from 'next'
import axios from 'axios'


const Home: NextPage = () => {
  return (
    <div className='text-bold text-pink-500'>
      
    </div>
  )
}

export const getServerSideProps = async () => {
  const response = await axios.get(`http://localhost:3000/api/post`)

  return {
    props: {}
  }
}

export default Home
