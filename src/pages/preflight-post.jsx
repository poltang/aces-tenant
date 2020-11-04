import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'
import NotFound from 'components/NotFound'

export default function FormTest() {
  const router = useRouter()
  const [body, setBody] = useState(null)
  const [result, setResult] = useState(null)
  const { user, mutateUser} = useUser({ redirecTo: false })

  if (!user || !user.isLoggedIn) return <NotFound />

  async function handleClick(e) {
    setBody(null)
    setResult(null)
    const body = getBody(e.target.value)
    console.log(body)
    setBody(body)

    const url = "/api/post?action=" + e.target.value
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    setResult(response)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 antialiased">
      <div className="flex flex-row mt-10 mb-8">
        <h1 className="flex-grow text-xl">New Document Preflight</h1>
        <p className="text-sm text-blue-400">
          <Link href="/">
            <a className="hover:text-blue-600 mr-4">Home</a>
          </Link>
          <Link href="/">
            <a className="hover:text-blue-600 mr-4">Home</a>
          </Link>
        </p>
      </div>

      <Btn label="Create license+admin" action="create-license-and-admin" handler={handleClick}/>
      {/* <Btn label="Create license admin" action="create-license-admin" handler={handleClick}/> */}
      <Btn label="Create user" action="create-user" handler={handleClick}/>
      <Btn label="Create project" action="create-project" handler={handleClick}/>
      <Btn label="Create project & client" action="create-project-and-client" handler={handleClick}/>
      <Btn label="Create persona" action="create-persona" handler={handleClick}/>
      <Btn label="Create project member" action="create-member" handler={handleClick}/>

      <Btn color="red" label="Clean sample data" action="reset-sample-data" handler={handleClick}/>


      <hr className="mt-2 mb-6"/>
      {body != null && <pre className="w-full overflow-scroll text-xs text-gray-700 bg-yellow-100 border px-4 py-2 mb-6">
        {JSON.stringify(body, null, 2)}
      </pre>}
      {body == null && <pre className="w-full overflow-scroll text-xs text-gray-700 bg-yellow-100 border px-4 py-2 mb-6">Waiting...</pre>}

      {result != null && <pre className="w-full overflow-scroll text-xs text-gray-700 bg-green-100 border px-4 py-2 mb-6">
        {JSON.stringify(result, null, 2)}
      </pre>}
      {result == null && <pre className="w-full overflow-scroll text-xs text-gray-700 bg-green-100 border px-4 py-2 mb-6">Waiting...</pre>}
    </div>
  )
}

function getBody(param) {
  if (param == "create-license-and-admin") {
    return {
      code: 'sample-license',
      type: 'corporate',
      licenseName: 'Ayodha',
      contactName: 'Dr. Ayodha',
      contactUsername: 'ayodha',
      contactEmail: 'ayodha@test.com',
      createdBy: "sample-admin",
    }
  }
  // else if (param == "create-license-admin") {
  //   return {
  //     code: 'sample-license',
  //     contactName: 'Dara Somba',
  //     contactUsername: 'dsomba',
  //     contactEmail: 'dsomba@abc.com',
  //     createdBy: "sample-admin",
  //   }
  // }
  else if (param == "create-user") {
    return {
      license: "sample-license",
      name: "Mr. Test User",
      username: "TestUser",
      email: "test@user.NET",
      gender: "L",
      phone: "098919201",
      roles: ["tasker", "divider"],
      createdBy: "sample-admin",
    }
  }
  else if (param == "create-project") {
    return {
      license: "sample-license",
      title: "Project Annihilation",
      admin: "sudarman",
      createdBy: "sample-admin",
      clientId: "5fa2687032ec5b13cd9f1401",
      description: "Lorem ipsum dolor sis amet",
      startDate: "",
      endDate: "",
      contact: "",
    }
  }
  else if (param == "create-project-and-client") {
    return {
      // client
      license: "sample-license",
      name: "PT Abundaya",
      address: "Jl. Bening",
      city: "Medan",
      phone: "909090",
      contacts: [
        {name: "Rabita", phone: "8989890", email: null},
        {name: "Rindik LK", phone: "7823-2829", email: "sum@sim.com"},
      ],
      // project
      title: "Project Annihilation",
      admin: "sudarman",
      createdBy: "sample-admin",
      clientId: "5fa2687032ec5b13cd9f1401",
      description: "Lorem ipsum dolor sis amet",
      startDate: "",
      endDate: "",
      contact: "",
    }
  }
  else if (param == "create-member") {
    return {
      /* required */ projectId: "5fa275fc32ec5b13cd9f141f",
      /* required */ createdBy: "srie2020",
      /* required */ name: "Siti Mordamar",
      /* required */ username: "mordamar",
      /* required */ email: "mordam@mor.dam",
      /* required */ role: "guest",
    }
  }
  else if (param == "create-persona") {
    return {
      /* required */ license: "sample-license",
      /* required */ projectId: "5fa272b932ec5b13cd9f1413",
      /* required */ createdBy: "sudarji",
      /* required */ username: "ROMANA",
      /* required */ email: "ROMA@Na.NET",
      /* required */ fullname: "Roma Na Purba",
      gender: "",
      phone: "",
      birth: "",
      nip: "",
      position: "",
      currentLevel: "",
      targetLevel: "",
    }
  }
}

function Btn({ color, label, action, handler }) {
  const normal = "rounded-md border text-sm text-gray-600 hover:border-gray-700 hover:text-gray-700 px-3 py-1 mb-3 mr-3"
  const red = "rounded-md border border-red-300 text-sm text-red-300 hover:border-red-400 hover:text-red-500 px-3 py-1 mb-3 mr-3"
  return (
    <button
      value={action}
      onClick={handler}
      className={color == "red" ? red : normal}
    >{label}</button>
  )
}