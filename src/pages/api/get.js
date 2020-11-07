import { connect } from 'lib/database'
import { ObjectID } from 'mongodb'
import withSession from 'lib/session'

export default withSession(async (req, res) => {
  const appUser = req.session.get("user")
  if (!appUser || !appUser.isLoggedIn) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }
  console.log(req.url)

  const { id,
    info,
    projects, project,
    clients, client,
    contracts, contract,
    users, user, username,
    members, member,
    personas, persona,
  } = req.query

  if (!id) res.status(400).json({ message: "Unacceptable query." })

  // Prevent stalled requests or mongodb error
  // - add lists as needed
  // if (
  //   (project && !ObjectID.isValid(project)) ||
  //   (client && !ObjectID.isValid(client)) ||
  //   (contract && !ObjectID.isValid(contract)) ||
  //   (username && username?.length == 0)
  // ) {
  //   res.status(400).json({ message: "Unacceptable query." })
  // }

  const { db } = await connect()

  try {
    // License info
    if (info !== undefined) {
      const rs = await db.collection('licenses').findOne({ slug: id })
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }

    // PROJECT MEMBERS
    else if (project !== undefined && members != undefined) {
      const rs = await db.collection('project_members').find({ projectId: project }).toArray()
      console.log(rs)
      if (rs) res.json(rs)
    }
    // SINGLE PROJECT MEMBER
    else if (project !== undefined && member != undefined && username) {
      const rs = await db.collection('project_members').findOne({ projectId: project, username: username })
      console.log(rs)
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }
    // PROJECT PERSONAS
    else if (project !== undefined && personas != undefined) {
      console.log(project)
      const rs = await db.collection('personas').find(
        { projectId: project },
        { projection: {
          _id: 1,
          license: 1,
          projectId: 1,
          username: 1,
          email: 1,
          fullname: 1,
          gender: 1,
          birth: 1,
          phone: 1,
          disabled: 1,
          nip: 1,
          position: 1,
          currentLevel: 1,
          targetLevel: 1,
          tests: 1,
          testsPerformed: 1,
          currentTest: 1,
          simulations: 1,
          simsPerformed: 1,
          currentSim: 1,
        }}
      ).toArray()
      console.log(rs)
      if (rs) res.json(rs)
    }
    // SINGLE PROJECT PERSONA
    else if (project !== undefined && persona != undefined && username) {
      const rs = await db.collection('personas').findOne({ projectId: project, username: username })
      console.log(rs)
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }


    // A PROJECT
    else if (project !== undefined && project) {
      const rs = await db.collection('projects').findOne({ license: id, _id: ObjectID(project) })
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }
    // A CLIENT
    else if (client !== undefined && client) {
      const rs = await db.collection('clients').findOne({ license: id, _id: ObjectID(client) })
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }
    // A CONTRACT
    else if (contract !== undefined && contract) {
      const rs = await db.collection('contracts').findOne({ license: id, _id: ObjectID(contract) })
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }
    // A USER
    else if (username !== undefined && username) {
      const rs = await db.collection('users').findOne({ license: id, username: username })
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }


    // PROJECTS
    else if (projects !== undefined) {
      const rs = await db.collection('projects').find({ license: id }).toArray()
      console.log(rs)
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }
    // CLIENTS
    else if (clients !== undefined) {
      const rs = await db.collection('clients').find({ license: id }).toArray()
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }
    // CONTRACTS
    else if (contracts !== undefined) {
      const rs = await db.collection('contracts').find({ license: id }).toArray()
      if (rs) res.json(rs)
      else res.status(404).json({ message: 'Not found' })
    }


  } catch (error) {
    res.status(500).json({ message: "Server error." })
  }
})
