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
    if (action == "set-project-modules") {
      console.log("action", action)
      const rs = await db.collection(PROJECTS_DB).findOneAndUpdate(
        { _id: body.projectId },
        { $set: {
          modules: body.modules,
          updatedAt: new Date(),
        }}
      )
    }
    // set-project-grouping
    else if (action == "set-project-grouping") {
      console.log("action", action)
      const rs = await db.collection(PROJECTS_DB).findOneAndUpdate(
        { _id: body.id },
        { $set: {
          gtests: body.gtests,
          gsims: body.gsims,
          updatedAt: new Date(),
        }}
      )
      console.log(rs)
    }
    // set-project-groups
    else if (action == "set-project-groups") {
      console.log("action", action)
      const rs = await db.collection(PROJECTS_DB).findOneAndUpdate(
        { _id: body.id },
        { $set: {
          testGroups: body.testGroups,
          simGroups: body.simGroups,
          updatedAt: new Date(),
        }}
      )
      console.log(rs)
    }
    // Set persona modules
    else if (action == "set-persona-modules") {
      const rs = await db.collection(PERSONAS_DB).findOneAndUpdate(
        { _id: body.id, projectId: body.projectId },
        { $set: {
          tests: body.modules,
          updatedAt: new Date(),
        }}
      )

      // console.log("RS", rs)
    }
    // Bulk set persona modules
    else if (action == "bulk-set-persona-modules") {
      const rs = await db.collection(PERSONAS_DB).updateMany(
        { projectId: body.projectId },
        { $set: {
          tests: body.modules,
          updatedAt: new Date(),
        }}
      )

      // console.log("RS", rs)
    }

    res.json({ message: "OK" })
  } catch (error) {
    res.status(500)
    res.json({ message: "Server error." })
  }
})