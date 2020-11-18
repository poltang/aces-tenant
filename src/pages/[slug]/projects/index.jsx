import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getLicensePaths, getLicenseInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'
import ProjectCard from 'components/ProjectCard'

export async function getStaticPaths() {
  const { db } = await connect()
  const paths = await getLicensePaths(db)
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { db } = await connect()
  const info = await getLicenseInfo(db, params.slug)
  try {
    // const rs = await db.collection('licenses').findOne({ code: params.slug })
    const rs = await db.collection('projects').aggregate(
      { $match: { license: params.slug }},
      { $sort: { _id: -1 }},
      { $lookup: {
        localField: 'clientId',
        from: 'clients',
        foreignField: '_id',
        as: 'clients' // always array
      }},
      { $undwind: '$client' }
    ).toArray()
    // const projects = rs // Error serializing

    // Hack
    let projects = []
    const json = JSON.parse( JSON.stringify(rs) )
    json.forEach(element => {
      const client = element.clients[0] ? element.clients[0] : null
      delete element.clients
      element.client = client
      projects.push(element)
    });

    return {
      props: { info, projects },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function Projects({ info, projects }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, projects ]

  return (
    <Layout info={info} activeNav="projects" debugs={debugs}>

      <Hero info={info} />

      <div className="px-4 sm:px-6">
        <div className="aces-geist pb-32">
          {/* If there're more than one project */}
          <div className="max-w-lg md:max-w-full mx-auto">
            <div className="grid grid-cols-2 gap-10 md:gap-6 pt-10 pb-12">
              {projects.map(project => (
                <div key={project._id} className="col-span-2 md:col-span-1">
                  <ProjectCard project={project} desc={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Hero({ info }) {
  return (
    <div className="bg-white border-b border-gray-300 pt-6 pb-6 px-4 sm:px-6">
      <div className="aces-geist">
        <div className="flex flex-col">
          <div className="text-center sm:text-left">
            <div className="text-3xl text-gray-800 leading-snug tracking-loose">
              Projects
            </div>
            <div className="text-sm text-gray-600 text-sm mb-2">
              Manage all of your projects
            </div>
            <div className="sm:hidden leading-tight tracking-wider">
              <button className="rounded-l-full uppercase bg-gray-500 text-xs text-white pl-2 pr-2 py-1">
                Cv
              </button>
              <button className="rounded-r-full  uppercase bg-gray-300 hover:bg-gray-600 text-xs text-gray-500 hover:text-white pl-2 pr-2 py-1">
                Tv
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-end mt-6">
            <div className="hidden sm:block flex-grow">
              <div className="leading-tight tracking-wider">
                <button className="rounded-l-full uppercase bg-gray-500 text-xs text-white pl-2 pr-2 py-1">
                  Cv
                </button>
                <button className="rounded-r-full  uppercase bg-gray-300 hover:bg-gray-600 text-xs text-gray-500 hover:text-white pl-2 pr-2 py-1">
                  Tv
                </button>
              </div>
            </div>
            <Link href="/[license]/new-project" as={`/${info?.code}/new-project`}>
              <a className={"float-rights roundeds px-4 py-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}>
                Create Project
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}