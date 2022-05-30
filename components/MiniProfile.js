import React from 'react'
import { useSession, signOut } from 'next-auth/react'

function MiniProfile() {
  const { data: session } = useSession()

  return (
    <div className="mt-14 ml-10 flex items-center justify-between">
      <img
        src={session?.user?.image}
        alt=""
        className="h-16 w-16 cursor-pointer rounded-full p-[2px]"
      />
      <div className="mx-4 flex-1">
        <h2 className="cursor-pointer font-bold">{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>
      <button onClick={signOut} className="text-sm text-blue-400">
        Sign Out
      </button>
    </div>
  )
}

export default MiniProfile
