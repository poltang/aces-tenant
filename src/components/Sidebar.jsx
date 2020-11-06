import Link from 'next/link'

export default function Sidebar({ info, selected }) {
  const base = "font-semibold px-4 sm:px-0 py-6 sm:py-3 border-b sm:border-0s "
  const normal = base + "hover:text-red-500"
  const active = base + "text-gray-800 hover:text-red-500"
  return (
    <>
      {selected == "settings" && (
        <div className="bg-white text-xl leading-loose font-semibold">
          <p className="border-b -mt-10 -mx-4 px-4 py-4 sm:hidden">
            Settings
          </p>
        </div>
      )}
      <div className="flex flex-col -mx-4 sm:mx-0 sm:w-32 md:w-40 text-gray-500 leading-base">
        <Link href="/[license]/settings/license" as={`/${info?.code}/settings/license`}>
          <a className={selected == 'license' ? active : normal}>
            License
          </a>
        </Link>
        <Link href="/[license]/settings/users" as={`/${info?.code}/settings/users`}>
          <a className={selected == 'users' ? active : normal}>
            Users
          </a>
        </Link>
        <Link href="/[license]/settings/clients" as={`/${info?.code}/settings/clients`}>
          <a className={selected == 'clients' ? active : normal}>
            Clients
          </a>
        </Link>
        <Link href="/[license]/settings/billing" as={`/${info?.code}/settings/billing`}>
          <a className={selected == 'billing' ? active : normal}>
            Billing
          </a>
        </Link>
      </div>
    </>
  )
}