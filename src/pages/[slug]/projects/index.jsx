import Head from 'next/head'
import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getLicensePaths, getLicenseInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'

export async function getStaticPaths() {
  const { db } = await connect()
  const paths = await getLicensePaths(db)
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { db } = await connect()
  const info = await getLicenseInfo(db, params.slug)
  try {
    const rs = await db.collection('projects').find(
      { license: params.slug }
    ).sort({ _id: -1 }).toArray()
    const projects = JSON.parse( JSON.stringify(rs) )
    return {
      props: { info, projects },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function Projects({ info, projects }) {
  const { user, mutateUser} = useUser({ redirecTo: false })

  const debugs = [ info, projects ]

  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  return (
    <Layout info={info} activeNav="projects" debugs={debugs}>

    </Layout>
  )
  // return (
  //   <div className="max-w-xl mx-auto px-4 py-10">
  //     <pre className="pre my-6">{JSON.stringify(info, null, 2)}</pre>
  //     <pre className="pre my-6">{JSON.stringify(projects, null, 2)}</pre>
  //     <pre className="pre my-6">{JSON.stringify(user, null, 2)}</pre>
  //   </div>
  // )
}