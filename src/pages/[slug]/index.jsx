import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getLicensePaths, getLicenseInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'
import ProjectCard from 'components/ProjectCard'
import ProjectStatus from 'components/ProjectStatus'
import Activities from 'components/Activities'

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

    const rs2 = await db.collection('log_client').find(
      {},{ limit: 20 },
    ).sort({ _id: -1 }).toArray()
    const logs = JSON.parse( JSON.stringify(rs2) )

    return {
      props: { info, projects, logs },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function License({ info, projects, logs }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, projects, logs ]

  return (
    <Layout info={info} activeNav="license" debugs={debugs}>
      <Hero info={info} />
      {/*  */}
      <div className="px-4 sm:px-6">
        <div className="aces-geist">
          <div className="max-w-lg md:max-w-full mx-auto">
            <div className="grid grid-cols-5 gap-4">
              {/* Kiri */}
              <div className="col-span-5 md:col-span-3">
                <div className="-mt-16 md:-mt-16 pt-1 md:pt-2 md:pr-4">
                  {projects.map((project) => (
                    <div key={project._id}>
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
                {/* DEV: LEGENDS */}
                <div className="bg-white border p-4 md:mr-3">
                  <ProjectStatus status="default" label="no ready (default)" margin="mb-2"/>
                  <ProjectStatus status="ready" label="ready" margin="mb-2"/>
                  <ProjectStatus status="active" label="deployed / active" margin="mb-2"/>
                  <ProjectStatus status="finished" label="finished" margin="mb-2"/>
                  <ProjectStatus status="cancelled" label="cancelled" margin="mb-0"/>
                </div>
              </div>
              {/* Kanan */}
              <div className="hidden md:block col-span-5 md:col-span-2">
                <div className="-mt-10 pt-1">
                  <h3 className="text-lg text-gray-600 tracking-wider uppercase font-semibold pb-1 mb-6">
                    Activities
                  </h3>
                  <Activities logArray={ logs } />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="relative md:hidden border-t mt-12">
        <div className="absolute w-full h-full z-0 bg-gradient-to-b from-white"></div>
        <div className="relative z-30 bg-white px-4 -mb-10">
          <div className="max-w-lg mx-auto pt-8 pb-12">
            <h3 className="text-lg text-gray-600 tracking-wider uppercase font-semibold mb-8">
              Activities
            </h3>
            <Activities logArray={ logs } />
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Hero({ info }) {
  return (
    <div className="bg-white border-b border-gray-300 pb-20 md:pb-16 px-4 sm:px-6">
      <div className="aces-geist bg-green-100s">
        <div className="w-full grid grid-cols-7">
          <div className="col-span-7 md:col-span-5 pt-8 pb-8 md:pb-6">
            <div className="flex flex-row items-center justify-center">
              <div className="tenant-logo flex-0 pr-4 -ml-12 md:ml-0">
                <div className="w-24 h-24 rounded-full bg-gray-200"></div>
              </div>
              <div className="tenant-copy flex-0 md:flex-grow">
                <div className="text-xs text-gray-600 leading-tight uppercase">
                  Aces Corporate License
                </div>
                <div className="license-name text-3xl text-gray-800 leading-snug tracking-tight">
                  {info?.licenseName}
                </div>
                <div className="text-gray-800">
                  Jakarta
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="col-span-7 md:col-span-2 md:text-right pb-4 md:pt-6">
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
      <style jsx>{`
      @media (max-width: 520px) {
        .tenant-logo {
          display:none
        }
        .tenant-copy {
          text-align: center;
        }
        .license-name {
          font-size: 1.5rem;
        }

      }
      `}</style>
    </div>
  )
}