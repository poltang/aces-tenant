import Head from 'next/head'
import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'

export async function getStaticPaths() {
  const { db } = await connect()
  const paths = await getProjectPaths(db)
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { db } = await connect()
  const info = await getLicenseInfo(db, params.slug)
  try {
    const rs = await db.collection('projects').findOne({ _id: params.id })
    const project = JSON.parse( JSON.stringify(rs) )

    return {
      props: { info, project },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function Settings({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project ]

  return (
    <Layout info={info} project={project} activeNav="settings" debugs={debugs}>

    </Layout>
  )
}