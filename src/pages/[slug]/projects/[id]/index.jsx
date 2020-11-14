import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo } from 'lib/static'
import { simpleContactsJoin } from 'lib/utils'
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
  try {
    // const rs = await db.collection('projects').findOne({ _id: params.id })
    const rs = await db.collection('projects').aggregate(
      { $match: { _id: params.id }},
      { $limit: 3 },
      { $lookup: {
        localField: 'clientId',
        from: 'clients',
        foreignField: '_id',
        as: 'clients' // always array
      }},
      { $undwind: '$client' }
    ).toArray()
    let project = JSON.parse( JSON.stringify(rs[0]) )
    project.client = project.clients[0] ? project.clients[0] : null
    delete project.clients

    return {
      props: { info, project },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function Project({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project ]

  return (
    <Layout info={info} project={project} activeNav="overview" debugs={debugs}>
      <Hero project={project} />
      <div className="px-4 sm:px-6">
        <div className="aces-geist py-8">
          <Content />
        </div>
      </div>
    </Layout>
  )
}

function Hero({ project }) {
  const contacts = simpleContactsJoin(project.client.contacts)

  return (
    <div className="bg-white border-b border-gray-300 pt-6 pb-6 px-4 sm:px-6">
      <div className="aces-geist">
        <div className="flex flex-col">
          <div className="text-center sm:text-left">
            <div className="text-3xl text-gray-800 leading-snug tracking-loose">
              {project.label}
            </div>
            <div className="text-sm text-gray-600 text-sm">
              {project.client.name}, {project.client.city}
            </div>
            <div className="text-sm text-gray-600 text-sm mb-1">
              Contacts: {contacts}
            </div>
            <div className="flex flex-row text-gray-600 justify-center mb-2 sm:hidden">
              <ProjectStatus status="ready" label="ready to deploy" />
            </div>
          </div>
          <div className="flex items-end justify-center sm:justify-end mt-3">
            <div className="hidden sm:block flex-grow">
              {/* <div className="leading-tight tracking-wider"> */}
              <ProjectStatus status="default" label="Not ready to deploy" />
              {/* </div> */}
            </div>
            <Link href="/[license]/projects/[id]/settings" as={`/${project.license}/projects/${project._id}/settings`}>
              <a className={"float-rights roundeds px-4 py-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}>
                Deploy
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Content({ project }) {
  return (
    <div className="relative">
      <table className="table-project">
        <tbody>
          <tr className="border-0 sm:border-b sm:border-t border-gray-300">
            <td className="hidden sm:table-cell align-top pt-2">
              <div className="w-32 md:w-40 lg:w-48 text-xl text-gray-600 font-semibold pr-2">
                Client
              </div>
            </td>
            <td className="border-0 sm:border-l border-gray-300 px-0 pt-0 sm:px-4 sm:pt-3 pb-8 sm:pb-12">
              <div className="content-box rounded border sm:border-0 px-4 pb-3 sm:p-0 border-gray-300">
                <div className="sm:hidden -mx-4 mb-3 px-4 py-2 border-b border-gray-300">
                  <h3 className="text-lg text-gray-600 font-semibold">
                    Client
                  </h3>
                </div>
                <p>
                Rutrum nisl hac massa est blandit urna vel vestibulum nibh, et quis
                magnis eleifend lacinia himenaeos quisque luctus varius, condimentum amet non
                consectetur odio vehicula placerat justo, mi commodo diam fusce eros
                consequat ipsum sodales.
                </p>
              </div>
            </td>
          </tr>
          {/*  */}
          <tr className="border-0 sm:border-b sm:border-b border-gray-300">
            <td className="hidden sm:table-cell align-top pt-2">
              <div className="w-32 md:w-40 lg:w-48 text-xl text-gray-600 font-semibold pr-2">
                Contract
              </div>
            </td>
            <td className="border-0 sm:border-l border-gray-300 px-0 pt-0 sm:px-4 sm:pt-3 pb-8 sm:pb-12">
              <div className="content-box rounded border sm:border-0 px-4 pb-3 sm:p-0 border-gray-300">
              <div className="sm:hidden -mx-4 mb-3 px-4 py-2 border-b border-gray-300">
                  <h3 className="text-lg text-gray-600 font-semibold">
                    Contract
                  </h3>
                </div>
                <p>
                Rutrum nisl hac massa est blandit urna vel vestibulum nibh, et quis
                magnis eleifend lacinia himenaeos quisque luctus varius, condimentum amet non
                consectetur odio vehicula placerat justo, mi commodo diam fusce eros
                consequat ipsum sodales.
                </p>
              </div>
            </td>
          </tr>
          {/*  */}
          <tr className="border-0 sm:border-b sm:border-b border-gray-300">
            <td className="hidden sm:table-cell align-top pt-2">
              <div className="w-32 md:w-40 lg:w-48 text-xl text-gray-600 font-semibold pr-2">
                Project Team
              </div>
            </td>
            <td className="border-0 sm:border-l border-gray-300 px-0 pt-0 sm:px-4 sm:pt-3 pb-8 sm:pb-12">
              <div className="content-box rounded border sm:border-0 px-4 pb-3 sm:p-0 border-gray-300">
              <div className="sm:hidden -mx-4 mb-3 px-4 py-2 border-b border-gray-300">
                  <h3 className="text-lg text-gray-600 font-semibold">
                    Project Team
                  </h3>
                </div>
                <p>
                Rutrum nisl hac massa est blandit urna vel vestibulum nibh, et quis
                magnis eleifend lacinia himenaeos quisque luctus varius, condimentum amet non
                consectetur odio vehicula placerat justo, mi commodo diam fusce eros
                consequat ipsum sodales.
                </p>
              </div>
            </td>
          </tr>
          {/*  */}
          <tr className="border-0 sm:border-b sm:border-b border-gray-300">
            <td className="hidden sm:table-cell align-top pt-2">
              <div className="w-32 md:w-40 lg:w-48 text-xl text-gray-600 font-semibold pr-2">
                Modules
              </div>
            </td>
            <td className="border-0 sm:border-l border-gray-300 px-0 pt-0 sm:px-4 sm:pt-3 pb-8 sm:pb-12">
              <div className="content-box rounded border sm:border-0 px-4 pb-3 sm:p-0 border-gray-300">
              <div className="sm:hidden -mx-4 mb-3 px-4 py-2 border-b border-gray-300">
                  <h3 className="text-lg text-gray-600 font-semibold">
                    Modules
                  </h3>
                </div>
                <p>
                Rutrum nisl hac massa est blandit urna vel vestibulum nibh, et quis
                magnis eleifend lacinia himenaeos quisque luctus varius, condimentum amet non
                consectetur odio vehicula placerat justo, mi commodo diam fusce eros
                consequat ipsum sodales.
                </p>
              </div>
            </td>
          </tr>

          {/*  */}
          <tr className="border-0 sm:border-b sm:border-b border-gray-300">
            <td className="hidden sm:table-cell align-top pt-2">
              <div className="w-32 md:w-40 lg:w-48 text-xl text-gray-600 font-semibold pr-2">
                Personas
              </div>
            </td>
            <td className="border-0 sm:border-l border-gray-300 px-0 pt-0 sm:px-4 sm:pt-3 pb-8 sm:pb-12">
              <div className="content-box rounded border sm:border-0 px-4 pb-3 sm:p-0 border-gray-300">
                <div className="sm:hidden -mx-4 mb-3 px-4 py-2 border-b border-gray-300">
                  <h3 className="text-lg text-gray-600 font-semibold">
                    Personas
                  </h3>
                </div>
                <p>
                Condimentum amet non
                consectetur odio vehicula placerat justo, mi commodo diam fusce eros
                consequat ipsum sodales.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <style jsx>{`
      .content-box { min-height: 90px; }
      `}</style>
    </div>
  )
}