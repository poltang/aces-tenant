// utils.js

export function simpleContactsJoin(contacts) {
  let arr = []
  contacts?.forEach((c) => { arr.push(c.name) })
  return arr.join(', ')
}

export function swrOptions() {
  return process.env.NODE_ENV == 'development' ? {
    refreshInterval: 0, revalidateOnFocus: false
  } : { revalidateOnFocus: true }
}