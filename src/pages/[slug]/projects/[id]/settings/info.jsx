import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { connect } from 'lib/database'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo, getProjectInfo } from 'lib/static'
import useUser from 'lib/useUser'
import { swrOptions } from 'lib/utils';
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'
import ProjectSidebar from 'components/ProjectSidebar'
import ProjectInfo from 'components/ProjectInfo'
import { BtnHollowMd, BtnReverseMd, BtnReverseSm } from 'components/Buttons'


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

export default function Info({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project ]

  return (
    <Layout bg="white" info={info} project={project} activeNav="settings" debugs={debugs}>
      <div className="px-4 sm:px-6 py-10">
        <div className="aces-geist">
          <div className="flex flex-row">
            <div className="w-full sm:w-32 md:w-40 sm:-mt-2">
              <ProjectSidebar project={project} selected="info"/>
            </div>
            {/*  */}
            <div className="hidden sm:block flex-grow sm:ml-10">
              <ProjectInfo project={project} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Content() {
  return (
    <div>CONTENT</div>
  )
}