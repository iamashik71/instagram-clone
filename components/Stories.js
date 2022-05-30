import { faker } from '@faker-js/faker'
import { useEffect, useState } from 'react'
import Story from './Story'
import { useSession } from 'next-auth/react'

function Stories() {
  const { data: session } = useSession()
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const suggestions = [...Array(25)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }))
    setSuggestions(suggestions)
  }, [])

  return (
    <div className="flex space-x-2 overflow-x-scroll rounded-sm border border-gray-200 bg-white p-6 pt-8 scrollbar-thin scrollbar-thumb-black">
      {session && (
        <Story img={session?.user?.image} username={session?.user?.username} />
      )}

      {suggestions.map((profile) => (
        <Story
          key={profile.id}
          img={profile.avatar}
          username={profile.username}
        />
      ))}
    </div>
  )
}

export default Stories
