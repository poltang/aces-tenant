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
import ProjectSettingHeader from 'components/ProjectSettingHeader'
import { BtnHollowMd, BtnReverseMd, BtnReverseSm } from 'components/Buttons'


export async function getStaticPaths() {
  const { db } = await connect()
  const paths = await getProjectPaths(db)
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { db } = await connect()
  const info = await getLicenseInfo(db, params.slug)
  const project = await getProjectInfo(db, params.id)
  return {
    props: { info, project },
    revalidate: 2
  }
}

export default function Members({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project ]

  return (
    <Layout bg="white" info={info} project={project} activeNav="settings" debugs={debugs}>
      <div className="px-4 sm:px-6 py-10">
        <div className="aces-geist">
          <div className="flex flex-row">
            <div className="hidden sm:block sm:w-32 md:w-40 sm:-mt-2">
              <ProjectSidebar project={project} selected="members"/>
            </div>
            {/*  */}
            <div className="flex-grow sm:ml-10">
              <div className="">
                <Link href="/[slug]/projects/[id]/settings" as={`/${project?.license}/projects/${project?._id}/settings`}>
                  <a className="block sm:hidden bg-white font-semibold border-b -mx-4 -mt-10 mb-8 px-4 py-6">
                    <div className="hover:text-gray-500">
                      <svg className="inline-block mr-2 stroke-current stroke-2" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision"><path d="M15 18l-6-6 6-6"></path></svg>
                      <span className="">Back to Project Setting</span>
                    </div>
                  </a>
                </Link>
              </div>

              <div>
                <ProjectSettingHeader project={project} title="Project Team"/>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Content() {
  return (
    <div>MEMBERS</div>
  )
}