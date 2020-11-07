import Head from 'next/head'
import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo, getProjectInfo } from 'lib/static'
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
  const project = await getProjectInfo(db, params.id)

  try {
    const rs = await db.collection('personas').find(
      { projectId: params.id },
      { projection: {
        _id: 1,
        license: 1,
        projectId: 1,
        username: 1,
        email: 1,
        fullname: 1,
        gender: 1,
        birth: 1,
        phone: 1,
        disabled: 1,
        nip: 1,
        position: 1,
        currentLevel: 1,
        targetLevel: 1,
        tests: 1,
        testsPerformed: 1,
        currentTest: 1,
        simulations: 1,
        simsPerformed: 1,
        currentSim: 1,
      }}
    ).toArray()
    console.log("RS", rs)
    const personas = JSON.parse( JSON.stringify(rs) )

    return {
      props: { info, project, personas },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function Assignments({ info, project, personas }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project, personas ]

  return (
    <Layout info={info} project={project} activeNav="personas" debugs={debugs}>

    </Layout>
  )
}