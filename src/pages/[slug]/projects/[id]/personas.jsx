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
// import Hero from 'components/PersonasHero'
import { BtnHollowMd, BtnReverseMd, BtnReverseSm } from 'components/Buttons'


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
  const {data: personas, mutate: mutatePersonas} = useSWR(url, fetchJson, swrOptions())
  const [showForm, setShowForm] = useState(false)

  /* ==== The line below must come AFTER reack hooks to avoid refresh error ==== */
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project, personas ]
  const fmHide = "form-wrap relative h-auto overflow-hidden"
  const fmShow = "form-wrap form-show relative h-auto overflow-hidden"

  function toggleForm() {
    const show = showForm;
    setShowForm(!showForm)
    if (!show) {
      // window.scrollTo(0, 200)
      document.getElementById("autofocus").focus()
    }
  }

  return (
    <Layout info={info} project={project} activeNav="personas" debugs={debugs}>
      <Hero project={project} flag={showForm} toggler={toggleForm} />
      {/* Form */}
      <div className={showForm ? fmShow : fmHide}>
        <div className="form-container bg-gray-100 border-t px-4 sm:px-6">
          <div className="aces-geist py-8">
            <Form project={project} user={user} toggler={toggleForm} mutate={mutatePersonas} />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="pb-32">
        <div className="h-10 bg-gray-600"></div>
        <div className="px-4 sm:px-6 -mt-10">
          <div className="aces-geist overflow-x-auto">
            <table className="table-full w-full">
              <thead>
                <tr className=" text-gray-200 text-xs uppercase">
                  <th className="h-10 pb-2 font-normal">#</th>
                  <th className="h-10 pb-2 font-normal whitespace-no-wrap">Nama Lengkap</th>
                  <th className="h-10 pb-2 font-normal">Email</th>
                  <th className="h-10 pb-2 font-normal">NIP</th>
                  <th className="h-10 pb-2 font-normal">Position</th>
                  <th className="h-10 pb-2 font-normal">Target</th>
                </tr>
              </thead>
              <tbody>
              {personas?.map((persona, index) => (
                <tr key={persona._id} className="border-b text-gray-600">
                  <td>{index +1}</td>
                  <td className="whitespace-no-wrap">{persona.fullname}</td>
                  <td>{persona.email}</td>
                  <td>{persona.nip ? persona.nip : 'N/A'}</td>
                  <td>{persona.position ? persona.position : 'N/A'}</td>
                  <td>{persona.targetLevel ? persona.targetLevel : 'N/A'}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style jsx>{`
      .form-container {
        height: 0;
        border-bottom-width: 0px;
        transform: translate3d(0, -220px, 0);
        transition: all .5s ease;
      }
      .form-show .form-container {
        height: auto;
        border-bottom-width: 1px;
        transform: translateZ(0);
        transition: all .25s ease;
      }
      `}</style>
    </Layout>
  )
}

function Hero({ project, flag, toggler }) {

  return (
    <div className="bg-white pt-6 pb-4 px-4 sm:px-6">
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
          <div className="flex items-end justify-center text-gray-500 sm:justify-end mt-3">
            {!flag && <div className="hidden sm:block flex-grow text-xs font-semibold uppercase leading-loose">
              {/* <span className="inline-block w-8 h-8 border-4 text-white text-center rounded-full bg-gray-500">DV</span> */}
              <span className="text-gray-700 cursor-default">
                Data
              </span>
              <span className="mx-2">|</span>
              <Link
              href="/[slug]/projects/[id]/assignments"
              as={`/${project.license}/projects/${project._id}/assignments`}>
                <a className="hover:text-gray-700">
                  Assignment
                </a>
              </Link>
              <span className="mx-2">|</span>
              <Link
              href="/[slug]/projects/[id]/edit-assignments"
              as={`/${project.license}/projects/${project._id}/edit-assignments`}>
                <a className="hover:text-gray-700">
                  Edit Assignment
                </a>
              </Link>
            </div>}
            {flag && <div className="flex-grow h-8">
              <div className="text-center text-gray-700 font-semibold mt-2">
                Add New Persona
              </div>
            </div>}
            {!flag && <div className="">
              <BtnReverseSm label="Add" props="mr-2" clickHandler={toggler} />
              <BtnReverseSm label="Import" />
            </div>}
          </div>
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

  const fields = [
    ["fullname", "Nama lengkap"],
    ["username", "Username"],
    ["email", "Email"],
    ["gender", "Jenis kelamin"],
    ["birth", "Tanggal lahir"],
    ["nip", "NIP / Nomor induk"],
    ["position", "Posisi / jabatan"],
    ["currentLevel", "Current level"],
    ["targetLevel", "Target level"],
  ]

  return (
    <div className="">
      <div className="max-w-xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {fields.map((f, index) => {
            if (index == 0) return (
              <PField
                key={f[0]}
                label={f[1]}
                name={f[0]}
                value={personData[f[0]]}
                fn={setPersonData}
                autofocus="1"
              />
            )
            else return (
              <PField
                label={f[1]}
                name={f[0]}
                value={personData[f[0]]}
                fn={setPersonData}
              />
            )
          })}
          <div className="col-span-1 py-2">
            <BtnHollowMd label="Close" isFull={true} clickHandler={e => {
              e.preventDefault()
              setPersonData(resetData)
              toggler()
            }} />
          </div>
          <div className="col-span-2 py-2">
            <BtnReverseMd label="Save Persona" isFull={true} clickHandler={handleSubmit} />
          </div>
          {/* <div className="col-span-1 hidden sm:block"></div> */}
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