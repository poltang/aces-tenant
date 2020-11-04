
import { useState } from 'react'
import Head from 'next/head'
// import { connect } from 'lib/database'
// import { ObjectID } from 'mongodb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetchJson from 'lib/fetchJson'
import useUser from 'lib/useUser'

function redirect(code) {
  return code == 'aces' ? 'ops' : code
}

export default function ChangePassword() {
  const { user, mutateUser} = useUser({ redirecTo: `/login` })
  const [errorMsg, setErrorMsg] = useState('')
  const [changed, setChanged] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // const { mutateUser } = useUser({ redirecTo: redirect(user?.license), redirectIfFound: true })
  if (!user) return <div>xxxxxx</div>

  const backUrl = user?.license == 'aces' ? "/ops" : `/${user.license}`

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const body = {
      username: user.username,
      oldPassword: e.currentTarget.oldPassword.value,
      password1: e.currentTarget.password1.value,
      password2: e.currentTarget.password2.value,
    }


    try {
      const response = await fetchJson("/api/app?changePassword", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      console.log(response)
      setErrorMsg('')
      setChanged(true)
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMsg(error.data.message)
    }
    setSubmitting(false)
  }

  const btn = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  const input = "appearance-none bg-gray-100 border hover:border-blue-400 rounded w-full py-1 px-2 mt-1 text-xl focus:bg-white focus:text-black leading-tight focus:outline-none focus:border-blue-400"



  return (
    <>
      <Head>
        <title>ACES - Login</title>
      </Head>
      <main id="aces-main" className="min-h-screen">
        <div className="bg-gradient-to-b from-gray-400 px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center min-h-screen max-w-xl mx-auto antialiased">
            <div className="text-xs text-center font-bold pt-8 pb-2">
              <span className="rounded-sm bg-blue-800 bg-opacity-25 text-white border-l border-b border-gray-100 px-2 py-1">
                ACES Password
              </span>
            </div>
            <div className="max-w-sm mx-auto p-6 mb-24">
              <div className="rounded-lg bg-blue-200 bg-opacity-0 hover:bg-opacity-25 p-1 -m-1">
                <div className="bg-white shadow text-gray-700 antialiased rounded-md border border-gray-400 hover:border-blue-400 p-6 pt-4">
                  <p className="text-xl leading-snugs font-semibold mt-1 mb-4">Form ganti password</p>
                  <hr className="-mx-6 mb-6" />
                  <div className="fmwrap pt-1">
                    {!changed && (<form onSubmit={handleSubmit}>
                      <label className="block text-sm mb-2">
                        <span className="text-red-400s">Password lama</span>
                        <input type="password" name="oldPassword" required autoFocus autoComplete="off" className={input} />
                      </label>
                      <label className="block text-sm mb-2">
                        <span className="text-red-400s">Password baru</span>
                        <input type="password" name="password1" required autoFocus autoComplete="off" className={input} />
                      </label>
                      <label className="block text-sm mb-2">
                        <span className="text-red-400s">Sekali lagi password baru</span>
                        <input type="password" name="password2" required autoFocus autoComplete="off" className={input} />
                      </label>
                      {errorMsg && <p className={submitting ? "text-sm text-gray-400 my-3" : "text-sm text-red-500 my-3"}>{errorMsg}</p>}
                      <div className="text-center mt-6">
                        <button className={btn} type="submit">
                          Ganti password
                        </button>
                      </div>
                    </form>)}
                    {changed && (
                    <div>
                      <p className="text-lg text-green-500 font-bolds mt-10 mb-8">
                        Password berhasil diganti.
                      </p>
                      <p className="text-sm text-blue-500">
                        <a href={backUrl}>
                          Back to dashboard
                        </a>
                      </p>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>

            {/* <pre className="pre">{JSON.stringify(user, null, 2)}</pre> */}
          </div>
        </div>
        <style jsx>{`
        .fmwrap {
          width: 280px;
          min-height: 265px;
        }
        `}</style>
      </main>
      {/* <footer id="aces-footer" className="h-64 text-xs text-gray-500 border-t border-gray-300">
        <p className="text-center my-6">ACES HIDDEN FOOTER</p>
      </footer> */}
    </>
  )
}