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
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <h1 className="title sm">
          Welcome, {license.licenseName}!
        </h1> */}
        <h1 className="title sm">
          Welcome, {license?.licenseName}!
        </h1>

        <ConstBox license={license}/>

      </main>
    </div>
  )
}

const ConstBox = ({ license }) => {
  return (
    <div>
      <p>CONSTBOX</p>
      <p>License code: {license.code}</p>
      <p>License name: {license.licenseName}</p>
      <p>
        <Link href="/[slug]" as={`/${license.code}`}>
          <a>SLUG</a>
        </Link>
        {` `}
        <Link href="/">
          <a>HOME</a>
        </Link>
      </p>
    </div>
  )
}