import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { connect } from 'lib/database'
import fetchJson from 'lib/fetchJson'
import { getProjectPaths, getLicenseInfo, getProjectInfo, getAcesModulesMeta } from 'lib/static'
import useUser from 'lib/useUser'
import { swrOptions } from 'lib/utils';
import NotFound from 'components/NotFound';
import Layout from 'components/Layout'
import ProjectSidebar from 'components/ProjectSidebar'
import ProjectSettingHeader from 'components/ProjectSettingHeader'
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
  const modulesMeta = await getAcesModulesMeta(db)
  console.log(modulesMeta)
  return {
    props: { info, project, modulesMeta },
    revalidate: 2
  }
}

export default function ProjectModules({ info, project, modulesMeta }) {
  const { user } = useUser({ redirecTo: false })
  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ info, project ]

  return (
    <Layout bg="white" info={info} project={project} activeNav="settings" debugs={debugs}>
      <div className="px-4 sm:px-6 py-10">
        <div className="aces-geist">
          <div className="flex flex-row">
            <div className="hidden sm:block sm:w-32 md:w-40 sm:-mt-2">
              <ProjectSidebar project={project} selected="modules"/>
            </div>

            <div className="flex-grow sm:ml-10">
              <div className="">
                <Link href="/[slug]/projects/[id]/settings" as={`/${project?.license}/projects/${project?._id}/settings`}>
                  <a className="block sm:hidden bg-white font-semibold border-b -mx-4 -mt-10 mb-8 px-4 py-6">
                    <div className="hover:text-gray-500">
                      <svg className="inline-block mr-2 stroke-current stroke-2" viewBox="0 0 24 24" width="20" height="20" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" shapeRendering="geometricPrecision"><path d="M15 18l-6-6 6-6"></path></svg>
                      <span className="">Back to Project Setting</span>
                    </div>
                  </a>
                </Link>
              </div>

              <ProjectSettingHeader project={project} title="Project Modules"/>

              {project.modules.length > 0 && (
                <>
                <p className="text-gray-700 mb-6">
                When using a framework for a new project, it will be automatically detected.
                As a result, several project settings are automatically configured to achieve
                the best result. You can override them below.
                </p>
                {project.modules.map(mod => (
                  <div key={mod.variant} className="mb-6">
                    <ModuleCard module={mod} />
                  </div>
                ))}
                {/* <pre className="pre">{JSON.stringify(project.modules, null, 2)}</pre> */}
                {/* <pre className="pre">{JSON.stringify(modulesMeta, null, 2)}</pre> */}
                </>
              )}

              {project.modules.length == 0 && <ModuleSelector info={info} project={project} modulesMeta={modulesMeta} />}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function ModuleCard({ module }) {
  return (
    <div className="max-w-xl">
      <div className="">
        <div className="border border-green-400 px-5 py-3">
          <h4 className="text-lg mb-1">
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


function ModuleNotSet() {}

function ModuleSelector({ info, project, modulesMeta }) {
  const [modules, setModules] = useState(modulesMeta)  // This should come from db
  const [count, setCount] = useState(0)

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
  }

  return (
    <div className="pb-10">
      <h3 className="text-2xl font-semibold -mt-2 mb-3">
        Project Modules
      </h3>
      <p className="text-gray-700 mb-6">
      When using a framework for a new project, it will be automatically detected.
      As a result, several project settings are automatically configured to achieve
      the best result. You can override them below.
      </p>

      <h3 className="font-bold mb-3">Selections: ({count})</h3>
      <hr className="border-green-400 mb-8"/>

      {modules.map((module, index) => (
        <div key={module.name}>
          <SelectedModule index={index} modules={modules} setter={setModules} count={count} counter={setCount} />
        </div>
      ))}

      {count > 0 && (
        <>
        <hr className="border-green-400 mt-12" />
        <div className="max-w-xl text-center -mt-6">
          <span className="inline-block bg-white px-4">
            <div className="rounded bg-green-100 hover:-m-1 hover:p-1">
              <button
                onClick={handleSubmit}
                className="border border-green-400 bg-white hover:border-green-500 text-green-500 hover:text-green-600 font-semibold px-5 py-3"
              >Save Project Modules</button>
            </div>
          </span>
        </div>
        </>
      )}


      <div className="mt-12">
      {modules.map((module, index) => (
        <div key={module.name}>
          <FreeModule index={index} modules={modules} setter={setModules} count={count} counter={setCount} />
        </div>
      ))}
      </div>


    </div>
  )
}

function FreeModule({ modules, index, setter, count, counter }) {
  const [selection, setSelection] = useState(null)
  const module = modules[index]

  if (module == undefined) return (<></>)

  return (
    <div className={module.selected ? "selected max-w-xl" : "max-w-xl"}>
      <div className="wrap mb-4">
        <div className="rounded-md hover:bg-green-200 hover:bg-opacity-50 hover:-m-1 hover:p-1">
          <div className="relative">
            <div className="absolute w-full h-full bg-gradient-to-b from-yellow-100 opacity-25"></div>
            <div className="relative hover:bg-white rounded border border-green-300 hover:border-green-400 px-5 py-4">
              <div className="">
                <div className="text-xl text-gray-700 font-semibold tracking-widers -mt-1 mb-3">
                  {module.name}
                </div>
                <div className="description text-gray-700 mb-3">
                  {module.description}
                </div>

                <div className="">
                {module.modules.map(sub => (
                  <label key={sub._id} className="block text-blue-500 cursor-pointer ml-6">
                    <input
                      type="radio"
                      name={module.type}
                      value={sub.variant}
                      onChange={e => {
                        setSelection(e.target.value)
                      }}
                    />
                    <span className="hover:text-blue-700 font-semibolds ml-2">
                      {sub.name}
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
                      const prev = [...modules]
                      prev[e.target.value].selected = selection
                      setter(prev)
                      const s = document.querySelector("input[name='" + module.type +"']:checked")
                      if (s) s.checked = false
                      setSelection(null)
                      counter(count +1)
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

function SelectedModule({ modules, index, setter, count, counter }) {
  const module = modules[index]
  if (module == undefined || !module.selected) return (<></>)

  const sub = module.modules.find(elm => elm.variant == module.selected)

  return (
    <div className="relative max-w-xl mb-4">
      <div className="">
        <div className="bg-green-500 rounded px-4 py-2">
          <div className="flex flex-row items-center">
            <div className="flex-grow text-lg text-white font-semibold">
              {sub.name}
            </div>
            <div className="text-xs text-gray-200">
              <button
              value={index}
              className="hover:text-white"
              onClick={e => {
                const prev = [...modules]
                prev[e.target.value].selected = false
                setter(prev)
                counter(count -1)
              }}
              >Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}