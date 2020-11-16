import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { connect } from 'lib/database'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo, getProjectInfo, getModulesDescriptor } from 'lib/static'
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
  const descriptor = await getModulesDescriptor(db)

  return {
    props: { info, project, descriptor },
    revalidate: 2
  }
}

export default function ProjectModules({ info, project, descriptor }) {
  const { user } = useUser({ redirecTo: false })
  const [dataType, setDataType] = useState('static')
  const [hasModules, setHasModules] = useState(project.modules.length > 0)
  const [showBuilder, setShowBuilder] = useState(false)
  const { data: modulesBySWR, mutate: mutateModulesBySWR } = useSWR(`/api/get?id=${info.code}&project=${project._id}&modules`)

  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ [info, descriptor], project ]

  function switchModules() {
    setShowBuilder(false)
    setDataType("swr")
    setTimeout(setHasModules(true), 1000)
  }

  return (
    <ProjectSettingsLayout
      info={info}
      project={project}
      activeNav="settings"
      selected="modules"
      title="Project Modules"
      debugs={debugs}
    >

      {/* Show static modules */}
      {hasModules && dataType == 'static' && (
        <div>
        {project.modules.map(module => (
          <div key={module.variant} className="mb-4">
            <ModuleCard module={module} />
          </div>
        ))}
          <div className="my-8 text-red-500">
            - Reconfigure<br/>
            - Rename
          </div>
        </div>
      )}

      {/* Show SWR modules */}
      {dataType == 'swr' && (
        <div>
        {modulesBySWR?.map(module => (
          <div key={module.variant} className="mb-4">
            <ModuleCard module={module} />
          </div>
        ))}
          <div className="my-8 text-red-500">
            - Reconfigure<br/>
            - Rename
          </div>
        </div>
      )}

      {!hasModules && !showBuilder && (
        <div className="text-centers p3-4">
          <p className="text-sm text-red-500 font-bold mb-1">
            Modul proyek belum terkonfigurasi.
          </p>
          <p className="text-xss text-gray-600 mb-8">
            Klik tombol di bawah ini untuk mulai memilih modul-modul yang
            akan dipakai dalam proyek.
          </p>
          <button
          onClick={e => {
            setShowBuilder(!showBuilder)
          }}
          className="bg-gray-600 text-white hover:bg-gray-700 hover:text-white px-4 py-2"
          >Show Module Builder</button>
        </div>
      )}

      {showBuilder && (
        <ModuleSelector
          project={project}
          descriptor={descriptor}
          mutate={mutateModulesBySWR}
          switcher={switchModules}
        />
      )}

    </ProjectSettingsLayout>
  )
}

function ModuleCard({ module }) {
  return (
    <div className="max-w-xl">
      <div className="">
        <div className="border border-green-400 px-5 py-3">
          <button
            className="float-right border text-xs text-gray-500 px-2 py-1"
          >Rename</button>
          <h4 className="text-lg mb-2">
            {module.label ? module.label : module.name }
          </h4>
          <div className="text-xs mb-4">
            {module.method == "selftest" && (
              <span className="rounded-sm bg-yellow-300 px-2 py-1">Test online, maksimum {module.maxTime} menit.</span>
            )}
            {module.method == "simulation" && (
              <span className="rounded-sm bg-yellow-300 px-2 py-1">Interaktif, maksimum {module.maxTime} menit.</span>
            )}
          </div>
          <div className="text-gray-600">
            {module.description}
          </div>
        </div>
      </div>
    </div>
  )
}


function ModuleSelector({ project, descriptor, mutate, switcher }) {
  const [modules, setModules] = useState(descriptor)  // This should come from db
  const [count, setCount] = useState(0)
  const [submittable, setSubmittable] = useState(false)

  async function handleSubmit(e) {
    let body = { projectId: project._id, modules: [] }
    modules.forEach((mod, index) => {
      if (mod.selected) {
        const sub = mod.modules.find(elm => elm.variant == mod.selected)
        // console
        if (sub) {
          body.modules.push({
            type: mod.type,
            variant: sub.variant,
            method: mod.method,
            name: sub.name,
            label: sub.label,
            description: sub.description,
            length: sub.length,
            maxTime: sub.maxTime,
          })
        }
      }
    })
    console.log(body)
    const url = "/api/put?action=set-project-modules"
    const response = await fetchJson(url, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    console.log("response", response)
    mutate()
    switcher()
  }

  function uncheckSubmittable() {
    const elm = document.querySelector('input[name="submit-checkbox"]:checked')
    if (elm) {
      elm.checked = false
      setSubmittable(false)
    }
  }

  return (
    <div className="-my-3 pb-10">
      <div className="amb text-gray-500 uppercase">
        <span className="">
          Aces Module Builder v.1
        </span>
      </div>

      <div className="selected-modules">
        {count == 0 && <div className="max-w-xl text-gray-700 pt-4 pb-6">
          Pilih modul-modul yang tersedia di bawah ini. Konfigurasi dapat
          disimpan setelah Anda memilih satu atau lebih modul.
        </div>}
        {count > 0 && (<div className="flex flex-wrap pt-4 pb-2">
        {descriptor.map((meta, index) => (
          <div key={meta.name} className={meta.selected ?  "mb-3" : "hidden"}>
            <SelectedModule
            descriptor={descriptor}
            index={index}
            count={count}
            setter={setModules}
            counter={setCount}
            submitChecker={uncheckSubmittable}
            />
          </div>
        ))}
        </div>)}
      </div>

      {count > 0 && (
        <>
        <div className="flex flex-row border-t border-gray-300 items-center pt-3">
          <div className="flex-grow">
            <label>
              <input
              type="checkbox"
              name="submit-checkbox"
              onChange={e => setSubmittable(!submittable)}
              className="form-checkbox mr-2" />
              <span className="text-gray-600 hover:text-blue-500 cursor-pointer">
                Konfirmasi pilihan modul
              </span>
            </label>
          </div>
          {!submittable && <button disabled
            className="border text-gray-500 px-4 py-2">
            Save Modules
          </button>}
          {submittable && <button
            onClick={handleSubmit}
            className="border border-gray-400 text-gray-600 hover:border-gray-600 hover:bg-gray-600 hover:text-white px-4 py-2">
            Save Modules
          </button>}
        </div>
        </>
      )}

      <div className="available-modules mt-8">
        {descriptor.map((meta, index) => (
          <div key={meta.name} className="mb-3s">
            <FreeModule
            descriptor={descriptor}
            index={index}
            count={count}
            setter={setModules}
            counter={setCount}
            submitChecker={uncheckSubmittable}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
      .amb {
        font-size: .675rem;
      }
      `}</style>
    </div>
  )
}

function SelectedModule({ descriptor, index, count, setter, counter, submitChecker }) {
  const meta = descriptor[index]
  if (meta == undefined || !meta.selected) return (<></>)

  const module = meta.modules.find(elm => elm.variant == meta.selected)

  return (
    <div className="flex-1 cursor-default">
      <div className="rounded bg-green-500 flex-flex-row items-center font-semibold mr-3">
        <span className="text-white px-3">
          {module.label ? module.label : module.name }
        </span>
        <button
          value={index}
          onClick={e => {
            const prev = [...descriptor]
            const _count = count - 1
            prev[e.target.value].selected = false
            setter(prev)
            counter(_count)
            submitChecker()
          }}
          className="appearance-none focus:outline-none rounded-r text-green-600 hover:bg-green-600 hover:text-white font-bold px-3 py-2">
          &#10008;
        </button>
      </div>
    </div>
  )
}

function FreeModule({ descriptor, index, count, setter, counter, submitChecker }) {
  const [selection, setSelection] = useState(null)
  const meta = descriptor[index]

  if (meta == undefined) return (<></>)

  return (
    <div className={meta.selected ? "selected max-w-xl" : "max-w-xl"}>
      <div className="wrap mb-4">
        <div className="rounded-md hover:bg-green-200 hover:bg-opacity-50 hover:-m-1 hover:p-1">
          <div className="relative">
            <div className="absolute w-full h-full bg-gradient-to-b from-yellow-100 opacity-25"></div>
            <div className="relative hover:bg-white rounded border border-green-300 hover:border-green-400 px-5 py-4">
              <div className="">
                <div className="text-xl text-gray-700 font-semibold tracking-widers -mt-1 mb-3">
                  {meta.name}
                </div>
                <div className="description text-gray-700 mb-3">
                  {meta.description}
                </div>

                <div className="">
                {meta.modules.map(module => (
                  <label key={module._id} className="block text-blue-500 cursor-pointer ml-6">
                    <input
                      type="radio"
                      name={meta.type}
                      value={module.variant}
                      onChange={e => {
                        setSelection(e.target.value)
                      }}
                    />
                    <span className="hover:text-blue-700 font-semibolds ml-2">
                      {module.name}
                    </span>
                  </label>
                ))}
                </div>
                <div className="flex flex-row items-center mt-3">
                  <p className="flex-grow text-xs text-gray-600">
                    Pilih salah satu varian, lalu tekan tombol Select.
                  </p>
                  <div className="text-xs text-gray-600">
                    <button
                    className="border px-3 py-1"
                    value={index}
                    onClick={e => {
                      if (!selection) return false
                      console.log("selection", selection)
                      const prev = [...descriptor]
                      prev[e.target.value].selected = selection
                      setter(prev)
                      const s = document.querySelector("input[name='" + meta.type +"']:checked")
                      if (s) s.checked = false
                      setSelection(null)
                      counter(count +1)
                      submitChecker()
                    }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
      label + label {
        margin-top: .25rem
      }
      .wrap {
        max-height: 800px;
        transition: max-height 0.25s;
      }
      .selected .wrap {
        overflow: hidden;
        max-height: 0;
        margin-bottom: 0;
        transition: max-height 0.25s;
      }
      `}</style>
    </div>
  )
}