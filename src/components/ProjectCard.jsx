// ProjectCard.jsx
import Link from 'next/link'
import ProjectStatus from 'components/ProjectStatus'

export default function ProjectCard({ project, desc = true }) {
  function contactsList(contacts) {
    let arr = []
    contacts.forEach((c) => { arr.push(c.name) })
    return arr.join(', ')
  }

  return (
    <div className="mb-6 md:mb-10">
      <div className="relative bg-blue-300 bg-opacity-25 rounded-xl hover:-m-1 hover:p-1">
        <div className="relative bg-white shadow rounded-lg border border-gray-400 hover:border-blue-300 px-6 pt-4 pb-2">
          <div className="card-head -mx-6 px-6 pb-3 border-b">
            <div className="flex flex-row items-center mb-1">
              <h3 className="flex-grow text-xl text-gray-800 font-bold">
                <Link href="/[slug]/projects/[id]" as={`/${project.license}/projects/${project._id}`}>
                  <a className="hover:text-blue-600">
                    {project.title}
                  </a>
                </Link>
              </h3>
              <div className="text-xs text-gray-600 -mr-2">
                <Link href="/[slug]/projects/[id]/settings" as={`/${project.license}/projects/${project._id}/settings`}>
                  <a className="bg-gray-300 hover:text-white hover:bg-gray-700 px-2 py-1">
                    Setting
                  </a>
                </Link>
              </div>
            </div>

            <ProjectStatus status="default" label="no ready (default)"/>

          </div>
          {desc && (
          <p className="bg-gray-200 font-light -mx-6 mb-4 px-6 py-3">
            {!project.description && 'No description available'}
            {project.description && project.description}
          </p>
          )}
          <div className="card-body mt-4">
            <div className="">
              <table className="project-fields">
                <tbody>
                  <tr>
                    <td className="text-gray-600">Client:</td>
                    <td>{project.client.name}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600">Client contact:</td>
                    <td>{contactsList(project.client.contacts)}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600">Admin:</td>
                    <td>@{project.admin}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600">Created by:</td>
                    <td>@{project.createdBy}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600">Date created:</td>
                    <td>{project.createdAt}</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
          <div className="card-footer">
            <div className="mt-4 -mx-6 px-6 py-4 border-t leading-normal">
              <span className="bg-yellow-s200 inline-block w-20 float-left text-gray-700 pr-3">Modules:</span>
              <span className="text-gray-800 block font-semibolds ml-20">
              {project.modules.length == 0 && <span className="text-red-500">Not defined.</span>}
              {project.modules.map(module => (
                <div key={module.slug} className="inline-block leading-loose rounded bg-gray-200 text-xs text-gray-600 mr-1 mb-1 px-2 py-s1">{module.slug}</div>
              ))}
              </span>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
      .project-fields td {
        padding: 2px 4px
      }
      .project-fields td:first-child {
        padding-left: 0;
        white-space: nowrap;
      }
      `}</style>
    </div>
  )
}