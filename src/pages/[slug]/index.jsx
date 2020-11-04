import Head from 'next/head'
import { connect } from 'lib/database'
import { ObjectID } from 'mongodb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';


export async function getStaticPaths() {
  const { db } = await connect()
  try {
    const rs = await db.collection('licenses').find(
      {},
      {projection: {_id: 0, code: 1, type: 1, licenseName: 1 }}
    ).toArray()

    console.log("RS", rs)
    const dx = ObjectID().toString()
    console.log(dx)

    const paths = rs.map((license) => ({
      params: { slug: license?.code },
    }))

    console.log("PATHS", paths)
    return { paths, fallback: true }
  } catch (error) {
    throw error
  }
}

export async function getStaticProps({ params }) {
  const { db } = await connect()
  try {
    const rs = await db.collection("licenses").findOne({ code: params.slug })
    console.log("RS", rs)
    const license = JSON.parse( JSON.stringify(rs) )
    console.log("LICENSE", license)
    return {
      props: { license },
      revalidate: 2 // process.env.REVALIDATE_INTERVAL
    }
  } catch (error) {
    throw error
  }
}

export default function License({ license }) {
  const router = useRouter()
  const { user, mutateUser} = useUser({ redirecTo: false })

  if (!user || !user.isLoggedIn || user.license != license?.code) return <NotFound />

  return (
    <div className="aces-geist">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-lg mx-auto border p-4 mt-16">

        <h1 className="text-2xl text-center text-pink-600">
          Welcome, {license?.licenseName}!
        </h1>

        <WaitingBox license={license}/>

        <p className="text-center">
          <Link href="/">
            <a className="text-blue-500 hover:text-blue-700">Home</a>
          </Link>
          <span> - </span>
          <Link href="/preflight-post">
            <a className="text-blue-500 hover:text-blue-700">Preflight</a>
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