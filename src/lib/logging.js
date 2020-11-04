// Aces logging
export async function logAces(db, creator, type, id) {
  const log = new Date().toISOString() + ` @${creator} CREATED ${type}:${id}`
  console.log(log)
  await db.collection("log_aces").insertOne({ log: log })
}

// Client logging
export async function logClient(db, creator, type, id) {
  const log = new Date().toISOString() + ` @${creator} CREATED ${type}:${id}`
  console.log(log)
  await db.collection("log_client").insertOne({ log: log })
}

// Test logging
export async function logPersona(db, creator, type, id) {
  const log = new Date().toISOString() + ` @${creator} CREATED ${type}:${id}`
  console.log(log)
  await db.collection("log_persona").insertOne({ log: log })
}

export async function saveLog(db, logType, creator, action, aux) {
  const collection = logType.trim().toLowerCase() == 'aces' ? 'log_aces' : 'log_client'
  const act = action.trim().toUpperCase()
  const log = new Date().toISOString() + ` @${creator} ${act} ${aux.trim()}`

  await db.collection(collection).insertOne({ license: logType, log: log })
}

// timestamp @user DID something
// timestamp @user DID successfully