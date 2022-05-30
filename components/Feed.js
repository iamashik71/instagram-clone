import MiniProfile from './MiniProfile'
import Posts from './Posts'
import Stories from './Stories'
import Suggestions from './Suggestions'
import { useSession } from 'next-auth/react'

function Feed() {
  const { data: session } = useSession()

  return (
    <main
      className={`mx-auto grid grid-cols-1 md:max-w-3xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3 ${
        !session && '!max-w-3xl !grid-cols-1'
      }`}
    >
      {/* Section which contain Post and Stories */}
      <section className={`col-span-2 ${!session && 'col-span-1'}`}>
        <Stories />
        <Posts />
      </section>
      {/* Section which contain Mini profile and Suggestions */}
      {session && (
        <section className="hidden md:col-span-1 xl:inline-grid">
          <div className="fixed top-10">
            <MiniProfile />
            <Suggestions />
          </div>
        </section>
      )}
    </main>
  )
}

export default Feed
