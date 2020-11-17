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
  // const grouping = {
  //   testGroups: project?.testGroups,
  //   simGroups: project?.simGroups,
  // }
  const { data: grouping, mutate: mutateGrouping } = useSWR(`/api/get?id=${info?.code}&project=${project?._id}&grouping`)
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
        <p className="text-gray-700 mb-6">
          Grouping adalah pengelompokan persona. Secara default setiap proyek
          memiliki satu grup untuk test mandiri
          dan satu grup untuk simulasi. Anda dapat mengaktifkan hingga{` `}
          <span className="font-bold">5 grup</span> untuk masing-masing jenis test.
        </p>

        <Grouping2 project={project} grouping={grouping} mutate={mutateGrouping} />

        {/* <Grouping data={grouping} project={project} /> */}

      </div>
    </ProjectSettingsLayout>
  )
}

function Grouping2({ grouping, mutate }) {
  if (!grouping) return <div></div>

  const [n1, setN1] = useState(grouping?.gtests)
  const [groups, setGroups] = useState(createGroups(n1))
  const [n2, setN2] = useState(grouping?.gsims)
  const [sims, setSims] = useState(createGroups(n2, "alpha"))
  const [edit, setEdit] = useState(false)


  function createGroups(n = 1, type = "numeric") {
    const total = (n < 1 || n > 5) ? 1 : n
    const chars = 'ABCDEFGHIJ'
    let arr = []
    for (var i=0; i<total; i++) {
      let suffix = type != "numeric" ? chars[i] : i + 1
      arr.push("Group " + suffix)
    }
    return arr
  }

  function handleChange1(e) {
    const val = parseInt(e.target.value)
    setN1(val)
    setGroups(createGroups(val))
  }

  function handleChange2(e) {
    const val = parseInt(e.target.value)
    setN2(val)
    setSims(createGroups(val, "alpha"))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const body = {
      id: grouping._id,
      gtests: n1,
      gsims: n2,
    }
    console.log(body)
    const url = "/api/put?action=set-project-grouping"
    const response = await fetchJson(url, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    setEdit(false)
    setTimeout(() => {
      mutate()
    }, 500)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h3 className="font-bold mb-3">
          Grup Tes Mandiri ({n1})
        </h3>
        <div className="flex flex-wrap font-bold mb-4">
          {groups.map((g, i) => (
            <Group key={g} label={g} bg={2} />
          ))}
          {edit && <div className="w-20">
            <GroupSeter changeHandler={handleChange1} />
          </div>}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold mb-3">
          Grup Simulasi / Interaktif ({n2})
        </h3>
        <div className="flex flex-wrap font-bold mb-4">
          {sims.map((g, i) => (
            <Group key={g} label={g} bg={3} />
          ))}
          {edit && <div className="w-20">
            <GroupSeter changeHandler={handleChange2} />
          </div>}
        </div>
      </div>

      <div>
        {!edit && <button
          onClick={e => {setEdit(true)}}
          className="border px-4 py-2"
        >Edit Grouping</button>}

        {edit && (
          <div>
            <button
            onClick={e => {setEdit(false)}}
            className="border px-4 py-2 mr-4"
            >Cancel</button>
            <button
            onClick={handleSubmit}
            className="border px-4 py-2"
          >Save Project Grouping</button>
          </div>
        )}
      </div>
      <pre className="pre">{JSON.stringify(grouping, null, 2)}</pre>
    </div>
  )
}

function Group({ label, bg }) {
  function clist() {
    let bgColor = "bg-gray-400"
    if (bg && bg == 2) bgColor = "bg-teal-300"
    else if (bg && bg == 3) bgColor = "bg-blue-300"
    return `w-20 ${bgColor} border border-transparent text-gray-800 text-center py-2 mr-1`
  }

  return (
    <div className={clist()}>
      {label}
    </div>
  )
}

function GroupSeter({ changeHandler }) {
  return (
    <div className="relative w-full">
      <select
      onChange={changeHandler}
      className="block appearance-none w-full rounded-none bg-gray-200 border border-gray-200 text-gray-700 font-bold py-2 px-4 pr-8 focus:outline-none focus:bg-white focus:border-gray-500">
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
  )
}