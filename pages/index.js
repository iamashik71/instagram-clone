import { NextPage } from 'next'
import Head from 'next/head'
import Feed from '../components/Feed'
import Header from '../components/Header'
import Modal from '../components/Modal'

const Home = () => {
  return (
    <div className="h-screen bg-gray-50 scrollbar-hide">
      <Head>
        <title>Instagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}

      <Header />
      {/* Feed */}
      <Feed />
      <Modal />
    </div>
  )
}

export default Home
