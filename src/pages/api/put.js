import { connect } from 'lib/database'
import { logAces, logClient } from "lib/logging";
import { ObjectID } from 'mongodb'
import withSession from 'lib/session'

const LICENSES_DB   = "licenses"
const CLIENTS_DB    = "clients"
const CONTRACTS_DB  = "contracts"
const PROJECTS_DB   = "projects"
const USERS_DB      = "users"
const PERSONAS_DB   = "personas"
const MEMBERS_DB    = "members"

export default withSession(async (req, res) => {
  const user = req.session.get("user")

  if (!user || !user.isLoggedIn) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  if (req.method != "PUT") {
    res.status(400).json({ message: "Unaceptable method request" })
    return
  }

  const { db } = await connect()
  const { action } = req.query
  const body = req.body
  console.log("BODY", body)

  try {
    // Set persona modules
    if (action == "set-persona-modules") {
      const rs = await db.collection(PERSONAS_DB).findOneAndUpdate(
        { _id: body.id, projectId: body.projectId },
        { $set: {
          tests: body.modules,
          updatedAt: new Date(),
        }}
      )

      console.log("RS", rs)
    }
    res.json({ message: "OK" })
  } catch (error) {
    res.status(500)
    res.json({ message: "Server error." })
  }
})