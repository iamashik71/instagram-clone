import { getProviders, signIn as SignIntoProvider } from 'next-auth/react'
import { async } from '@firebase/util'
import Header from '../../components/Header'

function signIn({ providers }) {
  return (
    <>
      <Header />
      <div className="-mt-46 flex min-h-screen flex-col items-center justify-center py-2 px-14 text-center">
        <img
          className="w-80"
          src="https://links.papareact.com/ocw"
          alt="logo"
        />
        <p className="text-xs">
          This not a REAL app, it is build for educational purposes only
        </p>
        <div className="mt-40">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="rounded-lg bg-blue-500 p-3 text-white"
                onClick={() =>
                  SignIntoProvider(provider?.id, { callbackUrl: '/' })
                }
              >
                Sign in with {provider?.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers,
    },
  }
}

export default signIn
