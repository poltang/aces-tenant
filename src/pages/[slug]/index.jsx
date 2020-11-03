import Head from 'next/head'
import styles from 'styles/Home.module.css'
import { connect } from 'lib/database'
import { ObjectID } from 'mongodb'
import Link from 'next/link'


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