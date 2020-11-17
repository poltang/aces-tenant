import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { connect } from 'lib/database'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo, getProjectInfo } from 'lib/static'
import useUser from 'lib/useUser'
import { swrOptions } from 'lib/utils';
import NotFound from 'components/NotFound';
import ProjectSettingsLayout from 'components/ProjectSettingsLayout'
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
    <ProjectSettingsLayout
      info={info}
      project={project}
      activeNav="settings"
      selected="members"
      title="Project Team"
      debugs={debugs}
    >
      <div className="max-w-xl my-3">
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Client Guests</h3>
        <table className="w-full mt-2">
          <thead className="rounded border-t border-gray-200 bg-gradient-to-t from-gray-100">
            <tr className="text-gray-600 border-b border-greens-200">
              <td width="5%">#</td>
              <td width="">Nama</td>
              <td width="">Username</td>
              <td width="">Phone</td>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="border-t">
              <td>1</td>
              <td>Abdullah Mimbar</td>
              <td>amimbar</td>
              <td>08123456799</td>
            </tr>
            <tr className="border-t">
              <td>2</td>
              <td>Rindang Subagja</td>
              <td>rindangs</td>
              <td>08778989100</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*  */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Expert Guests</h3>
        <table className="w-full mt-2">
          <thead className="rounded border-t border-gray-200 bg-gradient-to-t from-gray-100">
            <tr className="text-gray-600 border-b border-greens-200">
              <td width="5%">#</td>
              <td width="">Nama</td>
              <td width="">Username</td>
              <td width="">Role</td>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="border-t">
              <td>1</td>
              <td>Veronica Subagja</td>
              <td>vsubagja</td>
              <td>Behavioral Analytics</td>
            </tr>
            <tr className="border-t">
              <td>2</td>
              <td>Lodi Rumantioan</td>
              <td>lodirum</td>
              <td>Psychometry</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*  */}
      </div>
    </ProjectSettingsLayout>
  )
}