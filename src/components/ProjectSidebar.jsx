import Link from 'next/link'

export default function ProjectSidebar({ project, selected }) {
  const base = "font-semibold px-4 sm:px-0 py-6 sm:py-3 border-b sm:border-0s "
  const normal = base + "hover:text-green-500"
  const active = base + "text-gray-800 hover:text-green-500"
  return (
    <>
      {selected == "settings" && (
        <div className="bg-white text-xl leading-loose font-semibold">
          <p className="border-b -mt-10 -mx-4 px-4 py-4 sm:hidden">
            Project Settings
          </p>
        </div>
      )}
      <div className="flex flex-col -mx-4 sm:mx-0 sm:w-32 md:w-40 text-gray-500 leading-base">
        <Link href="/[license]/projects/[id]/settings/info" as={`/${project?.license}/projects/${project._id}/settings/info`}>
          <a className={selected == 'info' ? active : normal}>
            Project Info
          </a>
        </Link>
        <Link href="/[license]/projects/[id]/settings/modules" as={`/${project?.license}/projects/${project._id}/settings/modules`}>
          <a className={selected == 'modules' ? active : normal}>
            Modules
          </a>
        </Link>
        <Link href="/[license]/projects/[id]/settings/groups" as={`/${project?.license}/projects/${project._id}/settings/groups`}>
          <a className={selected == 'grouping' ? active : normal}>
            Grouping
          </a>
        </Link>
        <Link href="/[license]/projects/[id]/settings/members" as={`/${project?.license}/projects/${project._id}/settings/members`}>
          <a className={selected == 'members' ? active : normal}>
            Members
          </a>
        </Link>
        <Link href="/[license]/projects/[id]/settings/deployment" as={`/${project?.license}/projects/${project._id}/settings/deployment`}>
          <a className={selected == 'deployment' ? active : normal}>
            Deployment
          </a>
        </Link>
      </div>
    </>
  )
}