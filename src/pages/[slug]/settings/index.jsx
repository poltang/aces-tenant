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
    const rs = await db.collection('licenses').findOne({ code: params.slug })
    const license = JSON.parse( JSON.stringify(rs) )
    console.log("license", license)
    return {
      props: { info, license },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function Settings({ info, license }) {
  const router = useRouter()
  const { user, mutateUser} = useUser({ redirecTo: false })

  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, license ]

  return (
    <Layout info={info} activeNav="settings" debugs={debugs}>

    </Layout>
  )
}