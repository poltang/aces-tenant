import Head from 'next/head'
import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo, getProjectInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'
import ProjectStatus from 'components/ProjectStatus'

export async function getStaticPaths() {
  const { db } = await connect()
  const paths = await getProjectPaths(db)
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { db } = await connect()
  const info = await getLicenseInfo(db, params.slug)
  // try {
  //   const rs = await db.collection('projects').findOne({ _id: params.id })
  //   const project = JSON.parse( JSON.stringify(rs) )

  //   return {
  //     props: { info, project },
  //     revalidate: 2
  //   }
  // } catch (error) {
  //   throw error
  // }
  const project = await getProjectInfo(db, params.id)
  return {
    props: { info, project },
    revalidate: 2
  }
}

export default function Modules({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project ]

  return (
    <Layout info={info} project={project} activeNav="modules" debugs={debugs}>
      <Hero project={project} />
      {/*  */}
      <div className="relative">
        <div className="absolute w-full h-full bg-gradient-to-b from-gray-100 opacity-75"></div>
        <div className="realtive px-4 sm:px-6 h-screen">
          <div className="aces-geist">
            DOREMI
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Hero({ project }) {
  // const contacts = simpleContactsJoin(project.client.contacts)

  return (
    <div className="bg-white border-b border-gray-300 pt-6 pb-6 px-4 sm:px-6">
      <div className="aces-geist">
        <div className="flex flex-col">
          <div className="text-center sm:text-left">
            <div className="text-3xl text-gray-800 leading-snug tracking-loose">
              Project Modules
            </div>
            <div className="text-sm text-green-500 font-bold">
              {project.title}
            </div>
            <div className="text-sm text-gray-700 text-sm mb-1">
              {project.client.name}, {project.createdAt.substr(0,4)}
            </div>
          </div>
          <div className="flex items-end justify-center sm:justify-end mt-3">
            <div className="hidden sm:block flex-grow">
              <div className="text-sm text-gray-600 ">
                Module-related message/status
              </div>
            </div>
            <Link href="/[license]/projects/[id]/settings" as={`/${project.license}/projects/${project._id}/settings`}>
              <a className={"float-rights roundeds px-4 py-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}>
                Setup/Edit Modules
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}