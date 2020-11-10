import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import { connect } from 'lib/database'
import fetchJson from 'lib/fetchJson'
import { swrOptions } from "lib/utils";
import { getProjectPaths, getLicenseInfo, getProjectInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'
import { BtnMini, BtnReverseSm } from 'components/Buttons'

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

export default function Assignments({ info, project }) {
  const { user } = useUser({ redirecTo: false })
  const url = `/api/get?id=${info?.licenseSlug}&project=${project?._id}&personas`
  const {data: personas, mutate: mutatePersonas} = useSWR(url, fetchJson, swrOptions())

  /* ==== The line below must come AFTER reack hooks to avoid refresh error ==== */
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project, personas ]

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
    // editOff(e.target.value)
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

  function bulkSelect(e) {
    console.log(e.target.checked)
    const query = 'input[name="' + e.target.value + '"]'
    const inputs = document.querySelectorAll(query)
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].checked = e.target.checked
      // inputs[i].dis = e.target.checked
      inputs[i].className = "form-checkbox h-4 w-4 border border-gray-500 text-green-500"
    }
  }

  async function testSubmit(e) {
    // This will update/set ALL personas in a project
    // It is enough to send only the first row with projectId
    const tr = document.querySelector("tr.persona-data")
    const fields = tr.getElementsByTagName("input")
    let body = {
      projectId: project._id,
      modules: []
    }
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].checked) {
        body.modules.push(fields[i].name)
      }
    }
    console.log(body)

    const url = "/api/put?action=bulk-set-persona-modules"
    const response = await fetchJson(url, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    console.log(response)
    mutatePersonas()
  }

  const projectModules = ["gpq", "aime", "sjt", "mate", "intray", "interview"]

  return (
    <Layout info={info} project={project} activeNav="personas" debugs={debugs}>

      <Hero project={project} fn1={testSubmit} />

      <div className="pb-32">
        <div className="h-10 bg-gray-300 border-b border-gray-400"></div>
        <div className="px-4 sm:px-6 -mt-10">
          <div className="aces-geist overflow-x-auto">

            {!personas && <p>Loading...</p>}

            <table className="table-assignment w-full text-sm">
              <thead className="font-normal">
                <tr className="text-gray-600 text-xs uppercase">
                  <th width="40" className="align-middle font-normal whitespace-no-wrap py-0 pl-1">
                    <div className="pt-1 pb-px">#</div>
                  </th>
                  <th className="align-middle font-normal whitespace-no-wrap py-0 pl-1">
                    <div className="pt-1 pb-px">Nama Lengkap</div>
                  </th>
                  <th className="align-middle font-normal">
                    <ColHeader label="gpq" value="gpq" onChange={bulkSelect} />
                  </th>
                  <th className="align-middle font-normal">
                    <ColHeader label="aime" value="aime" onChange={bulkSelect} />
                  </th>
                  <th className="align-middle font-normal">
                    <ColHeader label="mate" value="mate" onChange={bulkSelect} />
                  </th>
                  <th className="align-middle font-normal">
                    <ColHeader label="sjt" value="sjt" onChange={bulkSelect} />
                  </th>
                  <th className="align-middle font-normal">
                    <ColHeader label="intray" value="intray" onChange={bulkSelect} />
                  </th>
                  <th className="align-middle font-normal">
                    <ColHeader label="intvw" value="interview" onChange={bulkSelect} />
                  </th>
                  <th className="hidden align-middle font-normal whitespace-no-wrap pl-1">
                    <div className="pt-1 pb-px">Action</div>
                  </th>
                </tr>
              </thead>

              {personas && personas.map((persona, index) => (
              <tbody key={persona._id}>
                <tr title={persona._id}
                className="persona-data bg-gray-300s border-b text-gray-600">
                  <td className="text-xs leading-none py-1 pl-1">
                    <span
                    onClick={e => {}}
                    className="inline-flex rounded-sm border leading-none px-2 py-1 cursor-pointer hover:border-gray-500">
                    {index + 1}
                    </span>
                  </td>
                  <td className="whitespace-no-wrap pl-1">
                    <div className="">{persona.fullname}</div>
                  </td>
                  <td className="text-xs py-0">
                    <Assignment persona={persona} name="gpq" label="gpq" />
                  </td>
                  <td className="text-xs py-0">
                    <Assignment persona={persona} name="aime" label="aime" />
                  </td>
                  <td className="text-xs py-0">
                    <Assignment persona={persona} name="mate" label="mate" />
                  </td>
                  <td className="text-xs py-0">
                    <Assignment persona={persona} name="sjt" label="sjt" />
                  </td>
                  <td className="text-xs py-0">
                    <Assignment persona={persona} name="intray" label="intray" />
                  </td>
                  <td className="text-xs py-0">
                    <Assignment persona={persona} name="interview" label="intv" />
                  </td>
                  <td className="hidden">
                    <div className="text-xs">
                      <span
                      onClick={e => {}}
                      className="inline-flex rounded-sm border leading-none px-2 py-1 cursor-pointer hover:border-gray-500">
                      Save
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
      <style jsx>{`
      .table-assignment th, .table-assignment td {
        padding-top: 0;
        padding-bottom: 0;
        vertical-align: middle;
      }
      .table-assignment th {
        height: 40px;
      }
      .table-assignment td {
        height: 38px;
      }
      `}</style>
    </Layout>
  )
}

function ColHeader({ label, value, onChange }) {
  return (
    <div className="pt-2 pb-px">
      <label className="inline-flex items-center">
        <input type="checkbox"
        onChange={onChange}
        value={value}
        name={`hd-${value}`}
        className="form-checkbox h-4 w-4 border border-gray-500 text-gray-700" />
        <span className="ml-1">{label}</span>
      </label>
    </div>
  )
}

function Assignment({ persona, name, label }) {
  // const cl = "form-checkbox h-4 w-4 border border-gray-500 text-green-500"

  return (
    <div className="pt-2 pb-px">
      <label className="inline-flex items-center">
        <input type="checkbox"
        name={name}
        readOnly
        disabled
        checked={persona.tests.includes(name)}
        className="form-checkbox h-4 w-4 border border-gray-400 text-gray-500" />
        <span className="uppercase ml-1">{label}</span>
      </label>
    </div>
  )
}

function Hero({ project, flag, fn1 }) {

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
              <span className="text-gray-700 cursor-default">
                Assignment
              </span>
              <span className="mx-2">|</span>
              <Link
              href="/[slug]/projects/[id]/edit-assignments"
              as={`/${project.license}/projects/${project._id}/edit-assignments`}>
                <a className="hover:text-gray-700">
                  Edit Assignment
                </a>
              </Link>

            </div>
            <div className="">
              <BtnReverseSm label="Edit assignments" clickHandler={fn1} />
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}
