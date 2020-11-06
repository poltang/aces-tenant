import { useState } from 'react'

function LicenseField({ label, field }) {
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

export default function LicenseInfo({ license }) {
  const [edit, setEdit] = useState(false)
  const licenceProps = {
    code: license.code,
    licenseName: license.licenseName,
    contactName: license.contactName,
    contactEmail: license.contactEmail,
    contactUsername: license.contactUsername,
  }
  const [editProps, setEditProps] = useState(licenceProps)

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
                ACES Corporate License
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
            {!edit && (
            <div className="grid grid-cols-3">
              <LicenseField label="License ID" field={license._id} />
              <LicenseField label="License code" field={license.code} />
              <LicenseField label="License type" field={license.type.toUpperCase()} />
              <LicenseField label="License owner" field={license.licenseName} />
              <LicenseField label="Admin / contact" field={license.contactName} />
              <LicenseField label="Admin username" field={license.contactUsername} />
              <LicenseField label="Admin email" field={license.contactEmail} />
              <LicenseField label="Date published" field={license.publishDate} />
              <LicenseField label="Expiration" field="12 months" />
            </div>
            )}
            {edit && (
            <div className="grid grid-cols-3 text-gray-500">
              <LicenseField label="License ID" field={license._id} />

              <div className={divl + " text-gray-700"}>
                License code:
              </div>
              <div className={divr}>
                <input id="pcode"
                  autoFocus
                  type="text"
                  name="code"
                  value={editProps.code}
                  onChange={changeHandler}
                  className={`w-32 ${editInput}`}/>
                <span className="text-xs tracking-tight ml-2 text-red-500">
                  Maks. 16 huruf
                </span>
              </div>

              <LicenseField label="License type" field={license.type.toUpperCase()} />

              <div className={divl + " text-gray-700"}>
                License owner:
              </div>
              <div className={divr}>
                <input
                  type="text"
                  name="licenseName"
                  value={editProps.licenseName}
                  onChange={changeHandler}
                  className={`w-full ${editInput}`}/>
              </div>

              <div className={divl + " text-gray-700"}>
                Admin / contact:
              </div>
              <div className={divr}>
                <input
                  type="text"
                  name="contactName"
                  value={editProps.contactName}
                  onChange={changeHandler}
                  className={`w-full ${editInput}`}/>
              </div>

              <div className={divl + " text-gray-700"}>
                Admin username:
              </div>
              <div className={divr}>
                <input
                  type="text"
                  name="contactUsername"
                  value={editProps.contactUsername}
                  onChange={changeHandler}
                  className={`w-full ${editInput}`}/>
              </div>

              <div className={divl + " text-gray-700"}>
                Admin email:
              </div>
              <div className={divr}>
                <input
                  type="text"
                  name="contactEmail"
                  value={editProps.contactEmail}
                  onChange={changeHandler}
                  className={`w-full ${editInput}`}/>
              </div>

              <LicenseField label="Date published" field={license.publishDate} />
              <LicenseField label="Expiration" field="12 months" />

              <div className="">&nbsp;</div>
              <div className="col-span-2 py-8 pl-4 tracking-wide mb-10">
                <p className="text-xs text-red-500 mt-1 mb-6">
                Rutrum nisl hac massa est blandit urna vel vestibulum nibh, et quis
    magnis eleifend lacinia himenaeos quisque luctus varius, condimentum amet non
    consectetur odio vehicula placerat justo, mi commodo diam fusce eros
    consequat ipsum sodales.
                </p>
                <button className="block w-full px-4 py-2 border border-gray-400 text-gray-600 hover:border-gray-600 hover:bg-gray-600 hover:text-white">
                  Simpan Perubahan
                </button>
              </div>
            </div>
            )}
            {!edit && (
            <div className="max-w-lg mx-auto my-10">
              <p className="text-gray-800 font-semibold">License Statement</p>
              <p className="text-xs tex-gray-800 leading-loose my-4">
              Proin est justo urna euismod ridiculus mauris tristique nisl, eget varius
    turpis ullamcorper bibendum posuere hac venenatis, ligula maecenas donec
    integer feugiat et per sociosqu at, luctus porta magna cras lacus elementum
    mollis. Rutrum nisl hac massa est blandit urna vel vestibulum nibh, et quis
    magnis eleifend lacinia himenaeos quisque luctus varius, condimentum amet non
    consectetur odio vehicula placerat justo, mi commodo diam fusce eros
    consequat ipsum sodales.
              </p>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}