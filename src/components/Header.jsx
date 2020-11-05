import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import useUser from 'lib/useUser'

export default function Header({ info, project, activeNav }) {
  const { mutateUser} = useUser({ redirecTo: `/${info?.licenseSlug}` })
  const router = useRouter()

  return (
    <div className="antialiased">
      <div className="bg-white px-4 sm:px-6">
        <div className="aces-geist text-sm py-3">
          <div className="flex flex-row items-center">
            <div className="flex flex-grow items-center">
              <div id="aces-logo" className="rounded-sm p-px h-8 w-12 mr-4">
                <div className="w-full h-full bg-white"></div>
              </div>
              <div className="flex-grow">
                <Link href={`/${info?.licenseSlug}`}>
                  <a className="text-gray-800 font-semibold">{info?.licenseName}</a>
                </Link>
              </div>
            </div>
            {/*  */}
            <div className="flex flex-row items-center text-gray-600 leading-snug">
              <div className="hidden sm:block">
                <Link href="#">
                  <a className="mr-4 hover:text-gray-800">Support</a>
                </Link>
                <Link href="#">
                  <a className="mr-4 hover:text-gray-800">Docs</a>
                </Link>
              </div>
              <Link href="/api/logout">
                <a onClick={async (e) => {
                  e.preventDefault()
                  await mutateUser(fetchJson('/api/logout'))
                  router.push('/login')
                }} className="rounded-sm border px-2 py-1 mt-px hover:text-gray-800 hover:border-gray-600">
                  <span className="block pb-px">Logout</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {!project && <NavLicense slug={info.code} activeNav={activeNav} />}
      {project && <NavProject project={project} activeNav={activeNav} />}
    </div>
  )
}

function NavLicense({ slug, activeNav }) {
  const active = "bg-pink-200s px-3 mr-3z text-gray-800"
  const normal = "bg-pink-200s px-3 mr-3z text-gray-600 hover:text-gray-800"
  const innerActive = "block py-3 -mb-px border-b-2 border-gray-800"
  const innerNormal = "block py-3 -mb-px border-b-2 border-transparent"

  return (
    <div id="aces-fixed" className="bg-white z-50 tracking-tights border-b border-gray-400">
      <div className="px-4 sm:px-6">
        <div className="aces-geist">
          <div className="flex flex-row items-center text-sm antialiased">
            <Link href={`/${slug}`}>
              <a className={activeNav == 'license' ? active + ' -ml-3' : normal  + ' -ml-3'}>
                <span className={activeNav == 'license' ? innerActive : innerNormal}>
                  Home
                </span>
              </a>
            </Link>
            <Link href={`/${slug}/projects`}>
              <a className={activeNav == 'projects' ? active : normal}>
                <span className={activeNav == 'projects' ? innerActive : innerNormal}>
                  Projects
                </span>
              </a>
            </Link>
            <Link href={`/${slug}/settings`}>
              <a className={activeNav == 'settings' ? active : normal}>
                <span className={activeNav == 'settings' ? innerActive : innerNormal}>
                  Settings
                </span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavProject({ project, activeNav }) {
  const active = "bg-pink-200s px-3 -mb-px text-gray-800 leading-10"
  const normal = "bg-pink-200s px-3 -mb-px text-gray-600 leading-10 hover:text-gray-800"
  const innerActive = "project-nav py-1 -mb-1s block"
  const innerNormal = "block py-1 -mb-p1x "

  return (
    <div id="aces-fixed" className="bg-white z-50 tracking-wider border-b border-gray-400">
      <div className="px-4 sm:px-6">
        <div className="aces-geist">
          <div className="flex flex-row items-center text-sm antialiased">
            <Link href={`/${project.license}/projects/${project._id}`}>
              <a className={activeNav == 'overview' ? active + ' -ml-3' : normal  + ' -ml-3'}>
                <span className={activeNav == 'overview' ? innerActive : innerNormal}>
                  Overview
                </span>
              </a>
            </Link>
            <Link href={`/${project.license}/projects/${project._id}/modules`}>
              <a className={activeNav == 'modules' ? active : normal}>
                <span className={activeNav == 'modules' ? innerActive : innerNormal}>
                  Modules
                </span>
              </a>
            </Link>
            <Link href={`/${project.license}/projects/${project._id}/personas`}>
              <a className={activeNav == 'personas' ? active : normal}>
                <span className={activeNav == 'personas' ? innerActive : innerNormal}>
                  Personas
                </span>
              </a>
            </Link>
            <Link href={`/${project.license}/projects/${project._id}/settings`}>
              <a className={activeNav == 'settings' ? active : normal}>
                <span className={activeNav == 'settings' ? innerActive : innerNormal}>
                  Deployment
                </span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}