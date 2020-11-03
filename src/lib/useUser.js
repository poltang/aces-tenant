import { useEffect } from "react";
import Router from 'next/router'
import useSWR from 'swr'
// import fetchJson from 'lib/fetchJson'

export default function useUser({
  redirecTo = false,
  redirectIfFound = false,
} = {}) {
  const { data: user, mutate: mutateUser} = useSWR('/api/user')

  useEffect(() => {
    if (!redirecTo || !user) return

    if (
      (redirecTo && !redirectIfFound && !user?.isLoggedIn) ||
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirecTo)
    }
  }, [user, redirectIfFound, redirecTo])

  return { user, mutateUser }
}