import { useState } from 'react'
import { connect } from 'lib/database'
import useSWR from 'swr'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo, getProjectInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'

export async function getStaticPaths() {
  const { db } = await connect()
  const paths = await getProjectPaths(db)
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  try {
    const { db } = await connect()
    const info = await getLicenseInfo(db, params.slug)
    const project = await getProjectInfo(db, params.id)

    return {
      props: { info, project },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function Personas({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const url = `/api/get?id=${info?.code}&project=${project?._id}&personas`
  const {data: personas, mutate: mutatePersonas} = useSWR(url, fetchJson)
  const [showForm, setShowForm] = useState(false)
  const debugs = [ info, project, personas ]


  function toggleForm() {
    setShowForm(!showForm)
  }

  const inputCls = "w-full appearance-none outline-none text-gray-600 border border-gray-300 hover:border-gray-400 focus:border-green-300 p-2"

  return (
    <Layout info={info} project={project} activeNav="personas" debugs={debugs}>
      <Hero project={project} />
      {/* <Form project={project} user={user} toggler={toggleForm} mutate={mutatePersonas} /> */}
    </Layout>
  )
}

function Form({ project, user, toggler, mutate }) {
  const resetData = {
    license: project.license,
    projectId: project._id,
    createdBy: user.username,
    username: '',
    email: '',
    fullname: '',
    gender: '',
    birth: '',
    nip: '',
    position: '',
    currentLevel: '',
    targetLevel: '',
  }
  const [personData, setPersonData] = useState(resetData)

  async function handleSubmit() {
    const body = personData
    console.log("BODY", body)
    const url = "/api/post?persona=1"
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify(body)
    })

    console.log("RESPONSE", response)
    setPersonData(resetData)
    mutate()
  }

  return (
    <div className="relative">
      <div className="absolute z-0 w-full h-full bg-gray-100 opacity-25"></div>
      <div className="relative z-10 px-4 sm:px-6 border-b bg-gradient-to-t from-white">
        <div className="aces-geist realtive text-gray-600 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <PField label="Nama lengkap" name="fullname" value={personData.fullname} fn={setPersonData}/>
            <PField label="Username" name="username" value={personData.username} fn={setPersonData}/>
            <PField label="Email" name="email" value={personData.email} fn={setPersonData}/>
            <PField label="Jenis kelamin" name="gender" value={personData.gender} fn={setPersonData}/>
            <PField label="Tanggal lahir" name="birth" value={personData.birth} fn={setPersonData}/>
            <PField label="NIP / Nomor induk" name="nip" value={personData.nip} fn={setPersonData}/>
            <PField label="Posisi / jabatan" name="position" value={personData.position} fn={setPersonData}/>
            <PField label="Current level" name="currentLevel" value={personData.currentLevel} fn={setPersonData}/>
            <PField label="Target level" name="targetLevel" value={personData.targetLevel} fn={setPersonData}/>
          </div>
        </div>
      </div>
    </div>
  )
}

function PField({ label, name, value, fn}) {
  const inputCls = "w-full appearance-none outline-none text-gray-600 " +
  "border border-gray-300 hover:border-gray-400 focus:border-green-400 p-2"

  return (
    <div className="col-span-1">
      <label className="block text-sm text-gray-500 leading-none">
        <div className="text-xs uppercase pl-px mb-1">{label}</div>
        <input
          type="text"
          id={'fm-' + name}
          name={name}
          value={value}
          onChange={e => {
            const { name, value } = e.target
            fn(prevState => ({
              ...prevState,
              [name]: value
            }))
          }}
          autoComplete="off"
          className={inputCls}
        />
      </label>
    </div>
  )
}

function Hero({ project }) {
  // const contacts = simpleContactsJoin(project.client.contacts)

  return (
    <div className="bg-white border-b border-gray-300 pt-6 pb-6 px-4 sm:px-6">
      <div className="aces-geist">
        <div className="flex flex-col">
          <div className="text-center sm:text-left">
            <div className="text-3xl text-gray-800 leading-snug tracking-loose">
              Project Personas
            </div>
            <div className="text-sm text-green-500 font-bold">
              {project.title}
            </div>
            <div className="text-sm text-gray-700 text-sm mb-1">
              {project.client.name}, {project.createdAt.substr(0,4)}
            </div>
          </div>
          <div className="flex items-end justify-center sm:justify-end mt-3">
            <div className="hidden sm:block flex-grow">
              <div className="text-sm text-gray-600 ">
                Persona-related message/status
              </div>
            </div>
            <div className="leading-none">
              <button className={"float-rights roundeds px-4 py-2 mr-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}>
                Add
              </button>
              <button className={"float-rights roundeds px-4 py-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}>
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}