import React, { useEffect, useState } from 'react'
import faker from '@faker-js/faker'

function Suggestions() {
  const [suggestions, setSuggestions] = useState([])
  useEffect(() => {
    const suggestions = [...Array(5)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }))
    setSuggestions(suggestions)
  }, [])

  return (
    <div className="mt-4 ml-10">
      <div className="mb-5 flex justify-between text-sm">
        <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
        <button className="cursor-pointer font-semibold text-gray-600">
          See all
        </button>
      </div>
      {suggestions.map((profile) => (
        <div
          key={profile.id}
          className="mt-3 flex items-center justify-between"
        >
          <img
            src={profile.avatar}
            alt="Suggestion DP"
            className="h-10 w-10 rounded-full border-[2px]"
          />
          <div className="ml-4 flex-1">
            <h2 className="cursor-pointer text-sm font-semibold hover:underline">
              {profile.username}
            </h2>
            <h3 className="max-w-[180px] truncate text-xs text-gray-400">
              Works at {profile.company.name}
            </h3>
          </div>
          <button className="text-xs font-bold text-blue-400">Follow</button>
        </div>
      ))}
    </div>
  )
}

export default Suggestions