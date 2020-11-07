import Head from 'next/head'
// import { connect } from 'lib/database'
// import { ObjectID } from 'mongodb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound'

export default function License() {
  const router = useRouter()
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != "aces") return <NotFound />


  return (
    <div className="aces-geist">
      <Head>
        <title>ACES - OPS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-lg mx-auto border p-4 mt-16">

        <h1 className="text-2xl text-center text-pink-600">
          Welcome, Aces!
        </h1>

        {/* <WaitingBox license={license}/> */}

        <p className="text-center">
          <Link href="/">
            <a className="text-blue-500 hover:text-blue-700">Home</a>
          </Link>
          <span> - </span>
          <Link href="/api/logout">
            <a onClick={async (e) => {
              e.preventDefault()
              await mutateUser(fetchJson('/api/logout'))
              router.push('/login')
            }} className="text-red-500 hover:text-red-700">
              Logout
            </a>
          </Link>
        </p>

      </main>
    </div>
  )
}

function WaitingBox({ license }) {
  if (!license) return (
    <div className="bg-gray-100 my-4 -mx-4 p-4">
      Loading...
    </div>
  )

  return (
    <div className="bg-green-300 my-4 -mx-4 p-4">
      <p className="mb-3">Code: {license.code}</p>
      <p className="">Name: {license.licenseName}</p>
    </div>
  )
}