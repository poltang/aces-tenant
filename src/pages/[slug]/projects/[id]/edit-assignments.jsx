import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { connect } from 'lib/database'
import fetchJson from 'lib/fetchJson'
import { swrOptions } from "lib/utils";
import { getProjectPaths, getLicenseInfo, getProjectInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'
import { BtnMini, BtnReverseSm, BtnReverseMd } from 'components/Buttons'

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

export default function Assignments({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  const url = `/api/get?id=${info?.licenseSlug}&project=${project?._id}&personas`
  const {data: personas, mutate: mutatePersonas} = useSWR(url, fetchJson, swrOptions())
  const [showForm, setShowForm] = useState(false)
  const [test, setTest] = useState(false)

  /* ==== The line below must come AFTER reack hooks to avoid refresh error ==== */
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project, personas ]
  const fmHide = "outer relative bg-white h-auto overflow-hidden -mt-px"
  const fmShow = "outer show relative bg-white h-auto overflow-hidden -mt-px pt-6s"

  async function submitHandler(e) {
    const tr = document.getElementById(e.target.value)
    const fields = tr.getElementsByTagName("input")
    let body = {
      id: e.target.value,
      projectId: e.target.name,
      modules: []
    }
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].checked) {
        body.modules.push(fields[i].name)
      }
    }
    console.log(body)

    const url = "/api/put?action=set-persona-modules"
    const response = await fetchJson(url, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    console.log(response)
    mutatePersonas()
    editOff(e.target.value)
  }

  function setEditAll(e) {
    if (e.target.innerText == "-") {
      const editing = document.querySelectorAll("tr.tr-editing")
      for (let i = 0; i < editing.length; i++) {
        editing[i].classList.add("hidden")
      }
      const normal = document.querySelectorAll("tr.tr-normal")
      for (let i = 0; i < normal.length; i++) {
        normal[i].classList.remove("hidden")
      }
      e.target.innerText = "#"
    } else {
      const normal = document.querySelectorAll("tr.tr-normal")
      for (let i = 0; i < normal.length; i++) {
        normal[i].classList.add("hidden")
      }
      const editing = document.querySelectorAll("tr.tr-editing")
      for (let i = 0; i < editing.length; i++) {
        editing[i].classList.remove("hidden")
      }
      e.target.innerText = "-"
    }
  }

  function editOn(id) {
    document.querySelector("tr.tr-" + id).classList.add("hidden")
    document.getElementById(id).classList.remove("hidden")
    // Reset
    const tr = document.getElementById(id)
    const fields = tr.getElementsByTagName("input")

    for (let i = 0; i < fields.length; i++) {
      if(fields[i].placeholder == "0") {
        fields[i].checked = false
      } else {
        fields[i].checked = true
      }
    }
  }

  function editOff(id) {
    document.querySelector("tr.tr-" + id).classList.remove("hidden")
    document.getElementById(id).classList.add("hidden")
    // Reset
    const tr = document.getElementById(id)
    const fields = tr.getElementsByTagName("input")

    for (let i = 0; i < fields.length; i++) {
      if(fields[i].placeholder == "0") {
        fields[i].checked = false
      } else {
        fields[i].checked = true
      }
    }
  }

  const projectModules = ["gpq", "aime", "sjt", "mate", "intray", "interview"]

  return (
    <Layout info={info} project={project} activeNav="personas" debugs={debugs}>

      <Hero project={project} />

      <div className="relative pb-20">
        <div className="h-10 bg-gray-600"></div>
        <div className="px-4 sm:px-6 -mt-10 pt-px">
          <div className="aces-geist pt-px">
            <table className="table-full w-full mt-pxs">
              <thead>
                <tr className="text-gray-200 border-b-2 border-transparent text-xs uppercase">
                  <th width="40" className="text-right pl-1 pb-2 font-normal">
                    <span
                    value="1"
                    onClick={e => setEditAll(e)}
                    className="inline-flex w-6 rounded-sm border border-gray-500 text-white leading-none px-2 py-1 cursor-pointer hover:bg-gray-700">
                    #
                    </span>
                  </th>
                  <th className="pb-2 pl-1 font-normal whitespace-no-wrap">Nama Lengkap</th>
                  <th className="pb-2 font-normal">GPQ</th>
                  <th className="pb-2 font-normal">AIME</th>
                  <th className="pb-2 font-normal">SJT</th>
                  <th className="pb-2 font-normal">MATE</th>
                  <th className="pb-2 font-normal">INTRAY</th>
                  <th className="pb-2 font-normal">INTV</th>
                  <th width="55" className="pb-2 pr-0 font-normal">ACTION</th>
                </tr>
              </thead>

              {personas?.map((persona, index) => (
              <tbody key={persona._id}>
                <tr
                id={`normal-${persona._id}`}
                className={`tr-normal tr-${persona._id} border-b text-gray-600`}>
                  <td className="text-right text-xs leading-none py-1 pl-1">
                    <span
                    onClick={e => editOn(persona._id)}
                    className="inline-flex rounded-sm border leading-none px-2 py-1 cursor-pointer hover:border-gray-500">
                    {index +1}
                    </span>
                  </td>
                  <td className="pl-1 whitespace-no-wrap">
                    {persona.fullname}
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="gpq" label="gpq" editing={false} />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="aime" label="aime" />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="mate" label="mate" />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="sjt" label="sjt" />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="intray" label="intray" />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="interview" label="interview" />
                  </td>
                  <td className="text-right px-0">

                  </td>
                </tr>
                <tr
                id={persona._id}
                className="tr-editing hidden bg-gray-100 border-b text-gray-600">
                  <td className="text-right text-xs leading-none py-1 pl-1">
                    <span
                    onClick={e => editOff(persona._id)}
                    className="inline-flex bg-green-500 rounded-sm border border-green-500 text-white leading-none px-2 py-1 cursor-pointer hover:bg-green-400">
                    {index +1}
                    </span>
                  </td>
                  <td className="pl-1 text-green-500s">
                    {persona.fullname}
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="gpq" label="gpq" editing={true} />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="aime" label="aime" editing={true} />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="mate" label="mate" editing={true} />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="sjt" label="sjt" editing={true} />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="intray" label="intray" editing={true} />
                  </td>
                  <td className="py-1 align-middle">
                    <Assignment persona={persona} name="interview" label="interview" editing={true} />
                  </td>
                  <td className="px-0 py-1 align-middle text-right">
                    <BtnMini
                    name={persona.projectId}
                    value={persona._id}
                    label="Save"
                    props="bg-gray-600 border-gray-600 text-white"
                    handler={submitHandler} />
                  </td>
                </tr>
              </tbody>
              ))}
            </table>
            <br />
          </div>
        </div>
      </div>

      <style jsx>{`

      `}</style>
    </Layout>
  )
}

function Assignment({ persona, name, label, editing = false }) {
  const cl = !editing && persona.tests.includes(name) ? "ml-2 text-gray-600" : "ml-2 text-gray-400"

  return (
    <div className="text-xs leading-none">
      {!editing && (<label className="inline-flex items-center">
        <input type="checkbox"
        name={name}
        checked={persona.tests.includes(name)}
        readOnly
        className="form-checkbox h-4 w-4 text-gray-600" />
        <span className={cl}>{label.toUpperCase()}</span>
      </label>)}
      {editing && (<label className="inline-flex items-center cursor-pointer">
        <input type="checkbox"
        name={name}
        placeholder={persona.tests.includes(name) ? 1 : 0}
        defaultChecked={persona.tests.includes(name)}
        onChange={e => {}}
        className="form-checkbox h-4 w-4 text-green-500" />
        <span className="ml-2 hover:text-gray-700">{label.toUpperCase()}</span>
      </label>)}
    </div>
  )
}

function Hero({ project, flag, fn1 }) {

  return (
    <div className="bg-white border-b border-gray-300 pt-6 pb-4 px-4 sm:px-6">
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
          {!flag && <div className="flex items-end justify-center text-gray-500 sm:justify-end mt-3">
            <div className="hidden sm:block flex-grow text-xs font-semibold uppercase leading-loose">
              {/* <span className="inline-block w-8 h-8 border-4 text-white text-center rounded-full bg-gray-500">DV</span> */}
              <Link
              href="/[slug]/projects/[id]/personas"
              as={`/${project.license}/projects/${project._id}/personas`}>
                <a className="hover:text-gray-700">
                  Data
                </a>
              </Link>
              <span className="mx-2">|</span>
              <Link
              href="/[slug]/projects/[id]/assignments"
              as={`/${project.license}/projects/${project._id}/assignments`}>
                <a className="hover:text-gray-700">
                  Assignment
                </a>
              </Link>
              <span className="mx-2">|</span>
              <span className="text-gray-700 cursor-default">
                Edit Assignment
              </span>
            </div>
            <div className="">
              <BtnReverseSm label="Edit assignments" />
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}

function BtnCheck({ checked, handler }) {
  const [state, setState] = useState(checked)
  const b0 = "btn flex w-4 h-4 rounded-full border border-gray-400 hover:border-gray-500"
  const b1 = "btn btn-on flex w-4 h-4 rounded-full bg-blue-400 border border-blue-400"

  function doHandler(e) {
    setState(!state)
    if (handler) handler(e)
  }

  return (
    <>
    <button onClick={doHandler} className={state ? b1 : b0}>
      <div className="inner w-full h-full rounded-full border border-gray-200">&nbsp;</div>
    </button>
    <style jsx>{`
    .btn {
      padding: 2px;
    }
    .inner {
      border-width: 2px;
      font-size:6px;
      line-height: 6px
    }
    .btn:hover .inner {

    }
    .btn.btn-on .inner {
      border-color: #fff;
      background-color: #67afe3;
    }
    .btn.btn-on:hover .inner {
      background-color: #fff;
    }
    `}</style>
    </>
  )
}