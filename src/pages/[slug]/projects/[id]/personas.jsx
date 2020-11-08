import { useState } from 'react'
import useSWR from 'swr'
import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo, getProjectInfo } from 'lib/static'
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
  // try {
  //   const rs = await db.collection('projects').findOne({ _id: params.id })
  //   const project = JSON.parse( JSON.stringify(rs) )

  //   return {
  //     props: { info, project },
  //     revalidate: 2
  //   }
  // } catch (error) {
  //   throw error
  // }
  const project = await getProjectInfo(db, params.id)
  return {
    props: { info, project },
    revalidate: 2
  }
}

export default function Personas({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  const url = `/api/get?id=${info?.licenseSlug}&project=${project?._id}&personas`
  const {data: personas, mutate: mutatePersonas} = useSWR(url, fetchJson)
  const [showForm, setShowForm] = useState(false)

  /* ==== The line below must come AFTER reack hooks to avoid refresh error ==== */
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project, personas ]
  const fmHide = "outer relative bg-white h-auto overflow-hidden -mt-px"
  const fmShow = "outer show relative bg-white h-auto overflow-hidden -mt-px pt-6s"

  function toggleForm() {
    const show = showForm;
    setShowForm(!showForm)
    if (!show) {
      document.getElementById("autofocus").focus()
    }
  }

  return (
    <Layout info={info} project={project} activeNav="personas" debugs={debugs}>

      <Hero project={project} flag={showForm} showHandler={toggleForm} />

      <div className={showForm ? fmShow : fmHide}>
        <div className="inner px-4 sm:px-6 border-b">
          <div className="aces-geist">
            <p className="text-sm text-gray-600 mb-6">
              Mengisi form persona...
            </p>
          </div>
          <Form project={project} user={user} toggler={toggleForm} mutate={mutatePersonas} />
        </div>
      </div>

      {/* {showForm && <Form project={project} user={user} toggler={toggleForm} mutate={mutatePersonas} />} */}
      <style jsx>{`
      .inner {
        height: 0;
        border-bottom-width: 0px;
        transform: translate3d(0, -350px, 0);
        transition: all .125s ease;
      }
      .show .inner {
        height: auto;
        border-bottom-width: 1px;
        transform: translateZ(0);
        transition: all .125s ease;
      }
      `}</style>
    </Layout>
  )
}

function Hero({ project, flag, showHandler }) {
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
          {!flag && <div className="flex items-end justify-center sm:justify-end mt-3">
            <div className="hidden sm:block flex-grow">
              <div className="text-sm text-gray-600 ">
                Persona-related message/status
              </div>
            </div>
            <div className="leading-none">
              <button
              onClick={showHandler}
              className={"float-rights roundeds px-4 py-2 mr-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}>
                Add
              </button>
              <button className={"float-rights roundeds px-4 py-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}>
                Import
              </button>
            </div>
          </div>}
          {/*flag && <div className="flex items-end justify-center sm:justify-end mt-3">
            <div className="hidden sm:block flex-grow">
              <div className="text-sm text-gray-600 ">
                Adding persona...
              </div>
            </div>
            <div className="leading-none">
              <button
              onClick={showHandler}
              className={"float-rights roundeds px-4 py-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}>
                Cancel
              </button>
            </div>
          </div>*/}
        </div>
      </div>
    </div>
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
    const url = "/api/post?action=create-persona"
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    console.log("RESPONSE", response)
    setPersonData(resetData)
    mutate()
  }

  return (
    <div className="">
      <div className="aces-geist border-t py-6">
        <div className="">
          <div className="max-w-xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              <PField label="Nama lengkap" name="fullname" value={personData.fullname} fn={setPersonData} autofocus="1"/>
              <PField label="Username" name="username" value={personData.username} fn={setPersonData}/>
              <PField label="Email" name="email" value={personData.email} fn={setPersonData}/>
              <PField label="Jenis kelamin" name="gender" value={personData.gender} fn={setPersonData}/>
              <PField label="Tanggal lahir" name="birth" value={personData.birth} fn={setPersonData}/>
              <PField label="NIP / Nomor induk" name="nip" value={personData.nip} fn={setPersonData}/>
              <PField label="Posisi / jabatan" name="position" value={personData.position} fn={setPersonData}/>
              <PField label="Current level" name="currentLevel" value={personData.currentLevel} fn={setPersonData}/>
              <PField label="Target level" name="targetLevel" value={personData.targetLevel} fn={setPersonData}/>
              <div className="col-span-1 py-2">
                <button
                className={"w-full px-4 py-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}
                onClick={e => {
                  e.preventDefault()
                        setPersonData(resetData)
                        toggler()
                }}
                >Cancel
                </button>
              </div>
              <div className="col-span-2 py-2">
                <button
                className={"w-full px-4 py-2 border border-gray-400 " +
              "hover:bg-gray-600 hover:border-gray-600 text-sm text-gray-600 hover:text-white"}
                onClick={handleSubmit}
                >Save
                </button>
              </div>
              {/* <div className="col-span-1 hidden sm:block"></div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PField({ label, name, value, fn, autofocus = false}) {
  const inputCls = "w-full appearance-none outline-none text-gray-700 " +
  "border border-gray-300 hover:border-gray-400 focus:border-green-400 p-2"

  return (
    <div className="col-span-1">
      <label className="block text-sm text-gray-600 leading-none">
        <div className="text-xs uppercase pl-px mb-1">{label}</div>
        {autofocus && <input
          type="text"
          id="autofocus"
          autoFocus
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
        />}
        {!autofocus && <input
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
        />}
      </label>
    </div>
  )
}