// utils.js

export function simpleContactsJoin(contacts) {
  let arr = []
  contacts?.forEach((c) => { arr.push(c.name) })
  return arr.join(', ')
}