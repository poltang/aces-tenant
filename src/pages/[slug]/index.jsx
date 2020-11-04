import Head from 'next/head'
import { connect } from 'lib/database'
// import { ObjectID } from 'mongodb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getLicensePaths } from 'lib/staticPaths'
import { getLicenseInfo } from "lib/staticProps";
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';

export async function getStaticPaths() {
  const { db } = await connect()
  const paths = await getLicensePaths(db)
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { db } = await connect()
  const info = await getLicenseInfo(db, params.slug)
  return {
    props: { info },
    revalidate: 2
  }
}

export default function License({ info }) {
  const router = useRouter()
  const { user, mutateUser} = useUser({ redirecTo: false })

  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  return (
    <div className="aces-geist">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-lg mx-auto border p-4 mt-16">

        <h1 className="text-2xl text-center text-pink-600">
          Welcome, {info.licenseName}!
        </h1>

        <WaitingBox license={info}/>

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
        <pre className="pre">{JSON.stringify(info, null, 2)}</pre>
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