import { useState } from 'react'

function ProjectField({ label, field }) {
  const divl = "col-span-1 text-rights py-2 border-b border-orange-200"
  const divr = "col-span-2 py-2 pl-4 border-b border-orange-200 tracking-wide"

  return (
    <>
    <div className={divl}>
      {label}:
    </div>
    <div className={divr}>
      {field}
    </div>
    </>
  )
}

export default function ProjectInfo({ project }) {
  const [edit, setEdit] = useState(false)
  const projectProps = {
    // license: project.license,
    title: project.title,
    label: project.label,
    startDate: project.startDate,
    endDate: project.endDate,
    admin: project.admin,
    clientName: project.client.name,
    // endDate: project.endDate,
  }
  const [editProps, setEditProps] = useState(projectProps)

  // https://stackoverflow.com/questions/54150783/react-hooks-usestate-with-object
  const changeHandler = e => {
    const { name, value } = e.target
    setEditProps(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const divl = "col-span-1 text-rights py-2 border-b border-orange-200"
  const divr = "col-span-2 py-2 pl-4 border-b border-orange-200 tracking-wide"
  const editInput = "appearance-none outline-none text-gray-700 bg-orange-200 hover:bg-orange-300 focus:bg-gray-600 focus:text-white px-2 py-1 -my-1"

  return (
    <div className="relative max-w-xl">
      <div className="bg-rainbow absolute z-0 w-full h-full rounded p-px opacity-75"></div>
      <div className="relative z-10 p-px">
        <div className="aces-bg-base relative z-50 rounded-sm shadow-sms borders border-gray-200">
          <div className="text-gray-700 rounded-sm px-8 py-6 bg-gradient-to-t from-white">
            <div className="flex flex-row items-center mb-10">
              <h3 className="flex-grow text-xl text-gray-800 ">
                Project Info
              </h3>
              <div className="leading-none tracking-wider">
                {!edit && <button
                  onClick={e => {
                    setEdit(!edit)
                   }}
                  className="text-xs text-white bg-gray-600 hover:bg-pink-500 px-3 py-1">
                  EDIT
                </button>}
                {edit && <button
                  onClick={e => {
                    setEdit(!edit)
                    setEditProps(licenceProps)
                   }}
                  className="text-xs text-white bg-gray-600 hover:bg-pink-500 px-2 py-1">
                  CANCEL
                </button>}
              </div>
            </div>

            <div className="grid grid-cols-3">
              <ProjectField label="Project ID" field={project._id} />
              <ProjectField label="Project title" field={project.title} />
              <ProjectField label="Project label" field={project.label} />
              <ProjectField label="Start date" field={project.startDate} />
              <ProjectField label="Closing date" field={project.endDate} />
              <ProjectField label="Project admin" field={project.admin} />
              <ProjectField label="Client" field={project.client.name} />
            </div>



          </div>
        </div>
      </div>
    </div>
  )
}