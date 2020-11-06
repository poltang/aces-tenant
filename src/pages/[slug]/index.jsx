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
    // const rs = await db.collection('licenses').findOne({ code: params.slug })
    const rs = await db.collection('projects').aggregate(
      { $match: { license: params.slug }},
      { $sort: { _id: -1 }},
      { $limit: 3 },
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

export default function License({ info, projects }) {
  const router = useRouter()
  const { user, mutateUser} = useUser({ redirecTo: false })

  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, projects ]

  return (
    <Layout info={info} activeNav="license" debugs={debugs}>
      <Hero info={info} />
      <div className="px-4 sm:px-6">
        <div className="aces-geist">
          {projects.map((project) => (
            <p key={project._id}>
              <Link href="/[slug]/projects/[id]" as={`/${project.license}/projects/${project._id}`}>
                <a>{project.title}</a>
              </Link>
            </p>
          ))}
        </div>
      </div>
    </Layout>
  )
}

function Hero({ info }) {
  return (
    <div className="bg-white border-b border-gray-300 pb-16 px-4 sm:px-6">
      <div className="aces-geist">
        <div className="w-full grid grid-cols-7">
          <div className="col-span-7 md:col-span-5 py-8">
            <div className="flex flex-row items-center">
              <div className="flex-0 pr-4">
                <div className="w-24 h-24 rounded-full bg-gray-200"></div>
              </div>
              <div className="flex-grow">
                <div className="text-xs text-gray-600 leading-tight uppercase">
                  Aces Corporate License
                </div>
                <div className="text-3xl text-gray-800 leading-snug tracking-tight">
                  {info?.licenseName}
                </div>
                <div className="text-gray-800">
                  Jakarta
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="col-span-7 md:col-span-2 font-semibolds md:text-right pb-6 sm:pt-6">
            <div className="flex justify-center md:justify-end">
              <Link href="/[license]/projects/new" as={`/${info?.licenseSlug}/projects/new`}>
                <a className="roundeds px-4 py-2 border border-gray-400 text-gray-600 hover:border-gray-600 hover:bg-gray-600 hover:text-white">
                  Create Project
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}