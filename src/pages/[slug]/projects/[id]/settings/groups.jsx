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

export default function Groups({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  const grouping = {
    testGroups: project?.testGroups,
    simGroups: project?.simGroups,
  }
  // const { data: groups, mutate: mutateGroups } = useSWR(`/api/get?id=${info?.code}&project=${project?._id}&groups`)
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project ]

  return (
    <ProjectSettingsLayout
      info={info}
      project={project}
      activeNav="settings"
      selected="groups"
      title="Project Grouping"
      debugs={debugs}
    >
      <div className="max-w-xl">
        <p className="text-gray-700 mb-8">
          Grouping adalah pengelompokan persona. Secara default setiap proyek
          memiliki satu grup untuk test mandiri
          dan satu grup untuk simulasi. Anda dapat mengaktifkan hingga{` `}
          <span className="font-bold">5 grup</span> untuk masing-masing jenis test.
        </p>

        <Grouping data={grouping} project={project} />

      </div>
    </ProjectSettingsLayout>
  )
}

function Grouping({ data, project }) {
  const [testGroups, setTestGroups] = useState(data?.testGroups)
  const [simGroups, setSimGroups] = useState(data?.simGroups)
  const [edit, setEdit] = useState(false)
  // const [dataType, setDataType] = useState('static')

  const { data: groups, mutate: mutateGroups } = useSWR(`/api/get?id=${project?.license}&project=${project?._id}&groups`)

  function setMaxTestGroups(max) {
    const n = parseInt(max)
    if (n < 1 || n > 5) return false
    let groups = [];
    for (let i = 0; i < n; i++) {
      groups.push("Group " + (i + 1))
    }

    setTestGroups(groups)
  }

  function setMaxSimGroups(max) {
    const n = parseInt(max)
    if (n < 1 || n > 5) return false
    let groups = [];
    let chars = 'ABCDEFGHIJ'
    for (let i = 0; i < n; i++) {
      groups.push("Group " + chars[i])
    }

    setSimGroups(groups)
  }

  async function handleSubmit(e) {
    const body = {
      id: project._id,
      testGroups: testGroups,
      simGroups: simGroups
    }
    console.log(body)
    const url = "/api/put?action=set-project-groups"
    const response = await fetchJson(url, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    console.log("response", response)
    mutateGroups()
    setEdit(false)
    setTimeout(() => {
      // setTestGroups(groups.testGroups)
      // setSimGroups(groups.simGroups)
    }, 1000)
  }

  if (!groups) return <div></div>

  return (
    <div className="max-w-xl">
      {/* <pre className="pre">{JSON.stringify(groups, null, 2)}</pre> */}
      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-1">
          <div className="flex flex-row h-8 border-b items-end pb-3">
            <h3 className="flex-grow font-bold pr-6">
              Grup Test Mandiri
            </h3>
            {edit && <div className="w-20 pl-5">
              <div className="relative">
                <select
                onChange={e => {
                  if (e.target.value) {
                    setMaxTestGroups(e.target.value)
                  }
                }}
                className="block appearance-none w-full bg-orange-300 border border-orange-300 text-gray-700 py-1 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                  <option>-</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>}
          </div>
          <div className="mb-8">
          {!edit && groups?.testGroups?.map(group => (
            <div key={group}
            className="group py-3"
            >{group}</div>
          ))}
          {edit && testGroups.map(group => (
            <div key={group}
            className="group py-3"
            >{group}</div>
          ))}
          </div>
        </div>
        {/*  */}
        <div className="col-span-1">
          <div className="flex flex-row h-8 border-b items-end pb-3">
            <h3 className="flex-grow font-bold pr-6">
              Grup Interaktif
            </h3>
            {edit && <div className="w-20 pl-5">
              <div className="relative">
                <select
                onChange={e => {
                  if (e.target.value) {
                    setMaxSimGroups(e.target.value)
                  }
                }}
                className="block appearance-none w-full bg-orange-300 border border-orange-300 text-gray-700 py-1 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                  <option>-</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>}
          </div>
          <div className="">
          {!edit && groups?.simGroups?.map(group => (
            <div key={group}
            className="group py-3"
            >{group}</div>
          ))}
          {edit && simGroups.map(group => (
            <div key={group}
            className="group py-3"
            >{group}</div>
          ))}
          </div>
        </div>
      </div>

      <hr className="border-orange-300 my-8"/>
      {!edit && (
        <button
        onClick={e => { setEdit(true) }}
        className="text-blue-500 hover:text-blue-600"
        >Edit Grouping</button>
      )}
      {edit && (
        <div className="text-center">
          <button
          onClick={e => { setEdit(false) }}
          className="border text-gray-600 px-4 py-2 mr-4"
          >Cancel</button>
          <button
          className="border text-gray-600 px-4 py-2 mr-4"
          onClick={e => {
            handleSubmit(e)
          }}
          >Save Grouping</button>
        </div>
      )}
      <style jsx>{`
      .group + .group {
        border-top: 1px solid #ebebeb;
      }
      `}</style>
    </div>
  )
}
