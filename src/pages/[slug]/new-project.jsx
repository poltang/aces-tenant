import { useState } from "react";
import { connect } from 'lib/database'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import { getLicensePaths, getLicenseInfo } from 'lib/static'
import useUser from 'lib/useUser'
import NotFound from 'components/NotFound';
import FormLayout from 'components/FormLayout'
import { BtnReverseMd } from "components/Buttons";

export async function getStaticPaths() {
  const { db } = await connect()
  const paths = await getLicensePaths(db)
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { db } = await connect()
  const info = await getLicenseInfo(db, params.slug)
  try {
    const rs = await db.collection('clients').find({license: params.slug}).sort({_id: -1}).toArray()
    const clients = JSON.parse( JSON.stringify(rs) )

    const rs2 = await db.collection('users').find(
      { license: params.slug },
      { projection: { name: 1, username: 1, roles: 1 }}
    ).toArray()
    console.log(rs2)
    const users = JSON.parse( JSON.stringify(rs2) )

    return {
      props: { info, clients, users },
      revalidate: 2
    }
  } catch (error) {
    throw error
  }
}

export default function NewProject({ info,clients, users }) {
  const { user } = useUser({ redirecTo: false })
  const projectModel = {
    license: info.code,
    createdBy: user?.username,
    clientId: null,
    admin: '',
    contact: '',
    title: '',
    label: '',
    description: '',
    startDate: '',
    endDate: '',
  }
  const clientModel = {
    license: info.code,
    createdBy: user?.username,
    name: '',
    address: '',
    city: '',
    // phone: '',
    // contactUsername: '',
    // contactName: '',
    // contactPhone: '',
    // contactEmail: '',
  }
  const [projectData, setProjectData] = useState(projectModel)
  const [clientData, setClientData] = useState(clientModel)
  const [clientType, setClientType] = useState(null)

  if (!user || !user.isLoggedIn || user.license != info?.code) return <NotFound />

  const debugs = [ [info, user, users], clients ]

  function isOK() {
    const clientOk = projectData.clientId || (clientData.name && clientData.city)
    const projectOK = projectData.title && projectData.label && projectData.admin
    return clientOk && projectOK
  }

  async function handleSubmit(e) {
    const body = {
      project: projectData,
      client: clientData
    }
    console.log(body)
    const query = projectData.clientId ? "create-project" : "create-project-and-client"
    const url = "/api/post?action=" + query
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response) {
      console.log("RESPONSE", response)
      setProjectData(projectModel)
      setClientData(clientModel)
    }
    // setPersonData(resetData)
    // mutate()
  }


  return (
    <FormLayout info={info} title="New Project" debugs={debugs}>
      <div className="max-w-xl mx-auto">
        <div className="bg-blue-200 rounded-md hover:bg-opacity-50 hover:-m-1 hover:p-1">
          <div className="bg-white text-gray-600 rounded border border-gray-400 hover:border-blue-300 px-6">
            <div className="pt-4 pb-5">
              <div className="flex flex-grow items-center mb-4">
                <div id="aces-logo" className="rounded-full cursor-default p-1 h-8 w-8 -ml-1 mr-4">
                  <div className="rounded-full h-full bg-white hover:bg-transparent text-green-600 hover:text-white text-xl leading-5 text-center font-bold">a</div>
                </div>
                <div className="flex-grow">
                  <h1 className="text-2xl text-gray-700s font-semibolds">New Project</h1>
                </div>
                <div className="">
                  <Link href={`/${info.code}`}>
                    <a className="border hover:border-gray-400 text-xs px-2 py-1">Cancel</a>
                  </Link>
                </div>
              </div>
              <p className="text-lg text-gray-800 font-bold">{info.licenseName}</p>
            </div>

            <div className="">
              <h3 className="bg-gray-100 text-gray-700 font-bold uppercase border-t border-b border-gray-300 -mx-6 px-6 py-4 mb-6">
                Project info
              </h3>

              <Form projectData={projectData} fn={setProjectData} users={users} />

              <div className="flex flex-row items-center bg-gray-100 border-t border-b border-gray-300 -mx-6 px-6 py-4 mt-10">
                <h3 className="flex-grow text-gray-700 font-bold uppercase">
                  Client info
                </h3>
                <div className="flex-0 flex flex-row pl-6">
                  <label className="flex flex-row items-center hover:text-blue-500 mr-4">
                    <input
                    onChange={e => {
                      setClientType(e.target.value)
                      const name = 'clientId'
                      setProjectData(prevState => ({
                        ...prevState,
                        [name]: null
                      }))
                    }}
                    type="radio"
                    name="xxx"
                    value="new"
                    className="inline-block mr-2" />
                    <span className="inline-block">Klien baru</span>
                  </label>
                  <label className="flex flex-row items-center hover:text-blue-500">
                    <input
                    onChange={e => {
                      setClientType(e.target.value)
                      setClientData(clientModel)
                    }}
                    type="radio"
                    name="xxx"
                    value="existing"
                    className="inline-block mr-2" />
                    <span className="inline-block">Klien lama</span>
                  </label>
                </div>
              </div>
              {!clientType && <p className="text-center my-6">
                Tentukan klien proyek untuk melanjutkan.
              </p>}
              {clientType == "new" && <NewClient model={clientData} fn={setClientData} />}
              {clientType == "existing" && <SelectClient clients={clients} fn={setProjectData} />}
            </div>

            <div className="text-center rounded-b -mx-6 mt-6 p-6 border-t">
              <BtnReverseMd
                label="Save Project"
                disabled={!isOK()}
                clickHandler={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </FormLayout>
  )
}

function Form({ projectData, users, fn }) {
  return (
    <div>
      <div className="mb-4">
        <h4 className="text-blue-500 font-semibold">Project title</h4>
        <p className="mb-2">
          Judul resmi proyek, akan dipakai dalam laporan ke klien.
        </p>
        <PField
          name="title"
          value={projectData.title}
          placeholder="Project title"
          note="Harus diisi"
          fn={fn}
        />
      </div>

      <div className="mb-4">
        <h4 className="text-blue-500 font-semibold">Project label</h4>
        <p className="mb-2">
          Label yang akan dipakai dalam aplikasi.
        </p>
        <div className="max-w-xs">
          <PField
            name="label"
            value={projectData.label}
            placeholder="Project label"
            note="Harus diisi, maksimum 40 karakter"
            fn={fn}
          />
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-blue-500 font-semibold">Project description</h4>
        <p className="mb-2">
          Deskripsi proyek.
        </p>
        <textarea
        name="description"
        className="textarea w-full text-sm appearance-none border border-gray-400 hover:border-gray-500 focus:border-green-400 px-2 py-1 focus:outline-none focus:bg-white"
        onChange={e => {
          const { name, value } = e.target
          fn(prevState => ({
            ...prevState,
            [name]: value
          }))
        }}
        ></textarea>
      </div>

      <div className="grid grid-cols-10 gap-4 sm:gap-8 mb-4">
        <div className="col-span-10 sm:col-span-6">
          <h4 className="text-blue-500 font-semibold mb-2">Project/contract dates</h4>
          <div className="flex flex-row">
            <div className="w-32">
              <PField
                name="startDate"
                value={projectData.startDate}
                placeholder="Tanggal mulai"
                note="dd-mm-yyyy"
                fn={fn}
              />
            </div>
            <div className="w-32 ml-4">
              <PField
                name="endDate"
                value={projectData.endDate}
                placeholder="Tanggal berakhir"
                note="dd-mm-yyyy"
                fn={fn}
              />
            </div>
          </div>
        </div>
        <div className="col-span-10 sm:col-span-4">
          <div className="w-40 sm:w-auto">
            <h4 className="text-blue-500 font-semibold mb-2">Project admin</h4>
            <div className="relative">
              <select
                name="admin"
                onChange={e => {
                  const { name, value } = e.target
                  fn(prevState => ({
                    ...prevState,
                    [name]: value
                  }))
                }}
                className="block appearance-none w-full bg-gray-100 rounded-none border border-gray-300 text-gray-700 py-2 px-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-green-400">
                <option value=""> - </option>
                {users.map(user => (
                  <option key={user.username} value={user.username}>{user.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
              </div>
            </div>
            <span className="text-xs text-gray-600">Tidak boleh kosong</span>
          </div>
        </div>
      </div>

      <style jsx>{`
      .textarea {
        min-height: 6rem;
      }
      `}</style>
    </div>
  )
}

function NewClient({ model, fn }) {
  return (
    <div className="new-client mt-2 pt-4">
      <div className="mb-4">
        <h4 className="text-blue-500 font-semibold mb-2">Nama perusahaan/lembaga</h4>
        <PField
          name="name"
          value={model.name}
          placeholder="Nama perusahaan / organisasi / lembaga"
          fn={fn}
        />
      </div>

      <div className="mb-4">
        <h4 className="text-blue-500 font-semibold mb-2">Alamat</h4>
        <PField
          name="address"
          value={model.address}
          placeholder="Alamat"
          fn={fn}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <h4 className="text-blue-500 font-semibold mb-2">Kota</h4>
          <PField
            name="city"
            value={model.city}
            placeholder="Kota"
            fn={fn}
          />
        </div>

        {/* <div className="col-span-2 text-center border-t mt-6">
          <div className="-mt-3">
            <span className="bg-white px-3">
              Contact person
            </span>
          </div>
        </div>
        <div className="col-span-1">
          <h4 className="text-blue-500 font-semibold mb-2">Nama</h4>
          <PField
            name="contactName"
            value={model.contactName}
            placeholder="Nama kontak"
            fn={fn}
          />
        </div>
        <div className="col-span-1">
          <h4 className="text-blue-500 font-semibold mb-2">Username</h4>
          <PField
            name="contactUsername"
            value={model.contactUsername}
            placeholder="Username"
            fn={fn}
          />
        </div>
        <div className="col-span-1">
          <h4 className="text-blue-500 font-semibold mb-2">Email</h4>
          <PField
            name="contactEmail"
            value={model.contactEmail}
            placeholder="Email"
            fn={fn}
          />
        </div>
        <div className="col-span-1">
          <h4 className="text-blue-500 font-semibold mb-2">Telepon / HP</h4>
          <PField
            name="contactPhone"
            value={model.contactPhone}
            placeholder="Telepon / HP"
            fn={fn}
          />
        </div> */}
      </div>
    </div>
  )
}

function SelectClient({ clients, fn }) {
  return (
    <div className="new-client mt-2 pt-4">
      {clients.map((client, index) => (
        <label key={client._id} className="flex flex-row items-center py-2 hover:text-blue-500">
          <input
            type="radio"
            value={client._id}
            name="clientId"
            className="inline-block mr-2"
            onChange={e => {
              if (e.target.checked) {
                const { name, value } = e.target
                fn(prevState => ({
                  ...prevState,
                  [name]: value
                }))
              }
            }}
          />
          <span className="inline-block">{client.name}</span>
        </label>
      ))}
      <style jsx>{`
      label + label {
        border-top: 1px solid #f0f0f0;
      }
      `}</style>
    </div>
  )
}

function PField({ label, name, value, placeholder, note, fn, autofocus = false}) {
  const inputCls = "w-full appearance-none outline-none text-gray-800 bg-gray-100 " +
  "border border-gray-300 hover:border-gray-500 focus:bg-white focus:border-green-400 p-2 mb-1"

  return (
    <div className="col-span-1">
      <label className="block text-sm text-gray-600 leading-none">
        {/* <div className="text-xs uppercase pl-px mb-1">{label}</div> */}
        {autofocus && <input
          type="text"
          id="autofocus"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={e => {
            const { name, value } = e.target
            fn(prevState => ({
              ...prevState,
              [name]: value
            }))
          }}
          autoComplete="off"
          className={inputCls}
        />}
        {!autofocus && <input
          type="text"
          id={'fm-' + name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={e => {
            const { name, value } = e.target
            fn(prevState => ({
              ...prevState,
              [name]: value
            }))
          }}
          autoComplete="off"
          className={inputCls}
        />}
        <span className="text-xs text-gray-600">
          {note ? note : ''}
        </span>
      </label>
    </div>
  )
}