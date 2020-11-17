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
// import ProjectSidebar from 'components/ProjectSidebar'
// import ProjectSettings from 'components/ProjectSettingsLayout'
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

export default function Deployment({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project ]

  return (
    <ProjectSettingsLayout
      info={info}
      project={project}
      activeNav="settings"
      selected="deployment"
      title="Project Deployment"
      debugs={debugs}
    >
      <Access project={project} />
    </ProjectSettingsLayout>
  )
}

function Access({ project }) {
  return (
    <div className="max-w-xl my-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Live Dates</h3>
        <p className="text-gray-600 mb-6">
          Live Dates adalah tanggal di mana modul-modul proyek dapat diakses di{` `}
          <span className="text-gray-800 font-bold">Website Aces</span>.
        </p>
        <div className="leading-loose">
          <label
            htmlFor="firstDate"
            className="inline-block mr-4">
            <span
              className="inline-block rounded-l-md bg-green-200 border-t border-b border-l border-green-300 px-3 py-1">
              Dari:
            </span>
            <input
              id="firstDate"
              type="text"
              name="accessCode"
              autoComplete="off"
              className= "w-32 appearance-none rounded-r-md font-bold text-gray-700 focus:bg-white border border-green-300 hover:border-green-400 focus:border-green-400 focus:outline-none px-3 py-1"
            />
          </label>
          <label
            htmlFor="firstDate"
            className="inline-block">
            <span
              className="inline-block rounded-l-md bg-green-200 border-t border-b border-l border-green-300 px-3 py-1">
              Sampai:
            </span>
            <input
              id="firstDate"
              type="text"
              name="accessCode"
              autoComplete="off"
              className= "w-32 appearance-none rounded-r-md font-bold text-gray-700 focus:bg-white border border-green-300 hover:border-green-400 focus:border-green-400 focus:outline-none px-3 py-1"
            />
          </label>
        </div>
      </div>
      {/*  */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Access Code</h3>
        <p className="text-gray-600 mb-6">
          Kode akses yang diperlukan untuk mengakses{` `}
          <span className="text-gray-800 font-bold">Website Aces</span>.
        </p>
        <div className="leading-loose">
          <label
            htmlFor="firstDate"
            className="inline-block mr-4">
            <span
              className="inline-block rounded-l-md bg-green-200 border-t border-b border-l border-green-300 px-3 py-1">
              Kode Akses:
            </span>
            <input
              id="firstDate"
              type="text"
              name="accessCode"
              autoComplete="off"
              className= "w-32 appearance-none rounded-r-md font-bold text-gray-700 focus:bg-white border border-green-300 hover:border-green-400 focus:border-green-400 focus:outline-none px-3 py-1"
            />
          </label>
        </div>
      </div>
      {/*  */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Simulation Schedules</h3>
        <Simday yymmdd="2020-11-17" />
        <Simday yymmdd="2020-11-18" />
        <Simday yymmdd="2020-11-19" />
      </div>
    </div>
  )
}

function Simday({ yymmdd }) {
  const [showTable, setShowTable] = useState(false)
  const btnShow = "rounded-md border hover:border-gray-600 text-gray-600 leading-4 px-3 py-2 mr-3"
  const btnSelected = "rounded-md bg-gray-600 hover:bg-white border border-gray-600 text-white hover:text-gray-600 leading-4 px-3 py-2 mr-3"
  const simDate = parseSimDate(yymmdd)

  function parseSimDate(strDate) {
    // strDate = '2020-10-29'
    const d = new Date()
    let yy = d.getFullYear(), mm = d.getMonth() + 1, dd = d.getDate();
    if (mm < 10) mm = '0' + mm
    if (dd < 10) dd = '0' + dd
    const now = yy + '-' + mm + '-' + dd
    let delta = 0;
    if (strDate > now) delta = 1
    else if (strDate < now) delta = -1

    const array = new Date(Date.parse(strDate)).toDateString().split(' ')

    return {
      delta: delta,
      day: array[0],
      month: array[1],
      date: array[2],
      year: array[3],
      now: now,
    }
  }

  function handleClick(e) {
    if (showTable) {
      e.target.className = btnShow
      setShowTable(!showTable)
    } else {
      e.target.className = btnSelected
      setShowTable(!showTable)
    }
  }

  let calBg = ' bg-gray-400 '
  if (simDate.delta == 0) calBg = 'bg-green-500'
  if (simDate.delta > 0) calBg = 'bg-pink-500'

  return (
    <div>
      <div  className="sim-day border-t border-gray-400 -mt-px py-4">
        <div className="flex flex-row items-start items-stretch">
          <div className="mr-4">
            <div className="w-24">
              <div className="rounded-t-lg bg-gray-300 py-2 text-5xl text-center text-gray-600 leading-none font-bold">
                {simDate.date}
              </div>
              <div className={`"sim-dmy rounded-b-lg "+ ${calBg} +" py-1 text-gray-200 text-center font-bold"`}>
                {simDate.month}{` `}{simDate.date}
              </div>
            </div>
          </div>
          <div className="flex flex-grow flex-col sm:flex-row sm:items-end">
            <dl className="sim-slot flex-grow text-gray-700 leading-relaxed sm:pb-2">
              <dt>Assessor:</dt>
              <dd className="assessor font-semibold">Rustam Riyadi, Sugeng Verdict</dd>
              <dt>Lokasi:</dt>
              <dd>Daring - Zoom Meeting</dd>
              <dt>Waktu:</dt>
              <dd>08.35 - 17.00 WIB</dd>
              <dt>Grup:</dt>
              <dd>Grup A (27)</dd>
            </dl>
            <div className="pt-2">
              <button onClick={handleClick} className={btnShow}>
                &#9776;
              </button>
              <button className="rounded-md border text-gray-600 leading-4 px-3 py-2">
                Edit Slot
              </button>
            </div>
          </div>
        </div>
        {/*  */}
        <div className={showTable ? 'sim-table mt-3' : 'hidden sim-table mt-3'}>
        <table className="w-full">
            <thead className="rounded border-t border-gray-200 bg-gradient-to-t from-gray-100">
              <tr className="text-gray-600 border-b border-greens-200">
                <td width="5%">#</td>
                <td width="">Nama</td>
                <td width="21%">Assessor</td>
                <td width="21%">Waktu</td>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-t">
                <td>1</td>
                <td>Abdullah Subagja</td>
                <td>Rustam Riyadi</td>
                <td>08:30 - 09.15 WIB</td>
              </tr>
              <tr className="border-t">
                <td>2</td>
                <td>Abdullah Subagja</td>
                <td>Rustam Riyadi</td>
                <td>08:30 - 09.15 WIB</td>
              </tr>
              <tr className="border-t">
                <td>3</td>
                <td>Abdullah Subagja</td>
                <td>Rustam Riyadi</td>
                <td>08:30 - 09.15 WIB</td>
              </tr>
              <tr className="border-t">
                <td>4</td>
                <td>Abdullah Subagja</td>
                <td>Rustam Riyadi</td>
                <td>08:30 - 09.15 WIB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
      .sim-day:hover .assessor {
        color: #e53e3e;
      }
      .sim-slot dt {
        float: left;
        width: 4.5rem;
      }
      .sim-slot dd {
        margin-left: 5.25rem;
      }
      .sim-table td {
        white-space: nowrap;
      }
      `}</style>
    </div>
  )
}