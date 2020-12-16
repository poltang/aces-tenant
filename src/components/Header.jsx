import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import useUser from 'lib/useUser'

export default function Header({ info, project, activeNav }) {
  const { mutateUser} = useUser({ redirecTo: `/${info?.code}` })
  const router = useRouter()

  return (
    <div className="antialiased">
      <div className="bg-white px-4 sm:px-6">
        <div className="aces-geist text-sm py-3">
          <div className="flex flex-row items-center">
            <div className="flex flex-grow items-center">
              {/* <div id="aces-logo" className="rounded-full cursor-default p-1 h-8 w-8 -ml-1 mr-4">
                <div className="rounded-full h-full bg-white hover:bg-transparent text-green-600 hover:text-white text-xl leading-5 text-center font-bold">a</div>
              </div> */}
              <div className="font-bold">
                ACES
              </div>
              <div className="text-lg text-gray-500 font-light mx-2">
                /
              </div>
              <div className="flex-grow">
                <Link href={`/${info?.code}`}>
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
                }} className="rounded-sms border px-2 py-1 mt-px hover:text-gray-800 hover:border-gray-600">
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
    <div id="aces-fixed" className="bg-white z-50 tracking-tight border-b border-gray-400">
      <div className="px-4 sm:px-6">
        <div className="aces-geist">
          <div className="flex items-end text-sm cursor-default">
            <div className="aces-prompt-logo flex">
              <div className="aces-logo-rainbow rounded-full p-1 h-6 w-6">
                <div className="rounded-full h-full bg-white hover:bg-transparent text-pink-500 hover:text-white text-sm leading-3 pt-px text-center font-bold">a</div>
              </div>
            </div>
            <div className="aces-prompt-nav flex flex-row flex-grow">
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
                    License
                  </span>
                </a>
              </Link>
            </div>
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
    <div id="aces-fixed" className="bg-white z-50 tracking-tight border-b border-gray-400">
      <div className="px-4 sm:px-6">
        <div className="aces-geist">
          <div className="flex items-end text-sm">
            <div className="aces-prompt-logo flex cursor-default">
              <div className="bg-gray-600 rounded-full p-1 h-6 w-6">
                <div className="rounded-full h-full bg-white hover:bg-transparent text-gray-600 hover:text-white text-sm leading-3 pt-px text-center font-bold">a</div>
              </div>
            </div>
            <div className="aces-prompt-nav flex flex-row flex-grow">
              <Link href={`/${project.license}/projects/${project._id}`}>
                <a className={activeNav == 'overview' ? active + ' -ml-3' : normal  + ' -ml-3'}>
                  <span className={activeNav == 'overview' ? innerActive : innerNormal}>
                    Overview
                  </span>
                </a>
              </Link>
              {/* <Link href={`/${project.license}/projects/${project._id}/modules`}>
                <a className={activeNav == 'modules' ? active : normal}>
                  <span className={activeNav == 'modules' ? innerActive : innerNormal}>
                    Modules
                  </span>
                </a>
              </Link> */}
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
                    Settings
                  </span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}