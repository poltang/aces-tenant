import Head from 'next/head'
import { useState } from 'react'
import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'

function redirect(code) {
  return code == 'aces' ? 'ops' : code
}

export default function LoginPage() {
  const { user } = useUser({ redirecTo: false })
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { mutateUser } = useUser({ redirecTo: redirect(user?.license), redirectIfFound: true })

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    }

    try {
      await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMsg(error.data.message)
    }
    setSubmitting(false)
  }

  const btn = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  const input = "appearance-none bg-gray-100 border hover:border-blue-400 rounded w-full py-2 px-3 text-xl focus:bg-white focus:text-indigo-600 leading-tight focus:outline-none focus:border-blue-400"

  return (
    <>
      <Head>
        <title>ACES - Login</title>
      </Head>
      <main id="aces-main" className="min-h-screen">
        <div className="bg-white from-gray-400 px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center min-h-screen max-w-xl mx-auto antialiased">
            <div className="text-xs text-center font-bold pt-8 pb-2">
              <span className="rounded-sm bg-blue-800 bg-opacity-25 text-white border-l border-b border-gray-100 px-2 py-1">ACES Login</span>
            </div>
            <div className="max-w-sm mx-auto p-6 mb-24">
              <div className="rounded-lg bg-blue-200 bg-opacity-0 hover:bg-opacity-50 p-1 -m-1">
                <div className="bg-white shadow-mdw antialiased rounded-md border border-gray-400 hover:border-blue-400 p-6">
                  {/*  */}
                  <form onSubmit={handleSubmit}>
                    <p className="mb-6 text-xl leading-snugs font-light">
                      <span className="font-semibold mr-1">Selamat datang.</span>{` `}
                      Masukkan username dan password Anda.
                    </p>
                    <hr className="-mx-6 mb-6" />
                    <div className="mb-4">
                      <label className="block text-sm font-bold mb-2" htmlFor="username">
                        Username
                      </label>
                      <input type="text" id="username" name="username" required autoFocus autoComplete="off" className={input} />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold mb-2" htmlFor="password">
                        Password
                      </label>
                      <input type="password" id="password" name="password" required className={input} />
                    </div>
                    {errorMsg && <p className={submitting ? "text-gray-400 my-3" : "text-red-500 my-3"}>{errorMsg}</p>}
                    <div className="flex items-center justify-between mt-6">
                      <button className={btn} type="submit">
                        Sign In
                      </button>
                    </div>
                  </form>
                  {/*  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer id="aces-footer" className="h-64 text-xs text-gray-500 border-t border-gray-300">
        <p className="text-center my-6">ACES HIDDEN FOOTER</p>
      </footer>
    </>
  )
}