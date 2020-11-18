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

  const { db } = await connect()
  const { action } = req.query

  try {
    if (action == "change-password") {
      const { username, oldPassword, password1 } = await req.body
      const user = await db.collection("users").findOne({ username: username })

      const bcrypt = require('bcryptjs')
      const verified = bcrypt.compareSync(oldPassword, user.hashed_password)
      if (verified) {
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password1, saltRounds)
        db.collection("users").findOneAndUpdate(
          { username: username},
          { $set : {
            hashed_password: hash,
            updatedAt: new Date()
          }}
        )
        res.json({ message: "Password changed." })
      } else {
        res.status(404)
        res.json({ message: "Anda memasukkan password yang salah." })
      }
    }
    else if (action == "reset-sample-data") {
      await db.collection(LICENSES_DB).deleteMany({ code: "sample-license" })
      await db.collection(USERS_DB).deleteMany({ $or: [{license: "sample-license"}, {license: "sample-code"}] })
      await db.collection(PROJECTS_DB).deleteMany({ $or: [{license: "sample-license"}, {license: "doremi"}] })
      await db.collection(MEMBERS_DB).deleteMany({ projectId: "5fa275fc32ec5b13cd9f141f" })
      await db.collection(PERSONAS_DB).deleteMany({ projectId: "5fa272b932ec5b13cd9f1413" })
      await db.collection(CLIENTS_DB).deleteMany({ $or: [{license: "sample-license"}, {license: "doremi"}] })
      res.json({ message: "Removed sample data." })
    }
    else {
      console.log("action", action)
      console.log("BODY", req.body)

      let owner = 'client'
      let props = null, type = null, collection = null

      switch (action) {
        case "create-license-and-admin":
          props = createLicenseAndAdmin(req.body)
          break;
        case "create-user":
          props = createUserProps(req.body)
          type = "user"
          collection = USERS_DB
          break;
        case "create-project":
          props = createProjectProps(req.body)
          type = "project"
          collection = PROJECTS_DB
          break;
        case "create-project-and-client":
          console.log("::create-project-and-client")
          props = createProjectAndClientProps(req.body)
          console.log(props)
          break;
        case "create-member":
          props = createMemberProps(req.body)
          type = "project-member"
          collection = MEMBERS_DB
          break;
        case "create-persona":
          props = createPersonaProps(req.body)
          type = "persona"
          collection = PERSONAS_DB
          break;
      }

      console.log("==============")
      console.log(props)

      //  Here we are saving document to mongodb
      if (action == "create-license-and-admin") {
        console.log("action: create-license-and-admin")
        const { licenseProps, adminProps } = props // createLicenseAndAdmin(body)
        console.log("licenseProps", licenseProps)
        console.log("adminProps", adminProps)
        // TODO: TRANSACTION
        const license = await insertDocument(db, LICENSES_DB, licenseProps)
        const admin = await insertDocument(db, USERS_DB, adminProps)

        res.json({ license, admin })

        await logAces(db, license.createdBy, "license", license._id)
        await logAces(db, admin.createdBy, "license-owner", admin._id)
      }
      else if (action == "create-project-and-client") {
        const { clientProps, projectProps } = props
        // TODO: TRANSACTION
        const client = await insertDocument(db, CLIENTS_DB, clientProps)
        const project = await insertDocument(db, PROJECTS_DB, projectProps)

        res.json({ client, project })

        await logClient(db, clientProps.createdBy, "client", clientProps._id)
        await logClient(db, projectProps.createdBy, "project", projectProps._id)
      }
      else {
        const response = await insertDocument(db, collection, props)

        res.json( response )

        if (owner == "aces") {
          await logAces(db, props.createdBy, type, props._id)
        } else {
          await logClient(db, props.createdBy, type, props._id)
        }
      }
    }

    /* Create schedule */
  } catch (error) {
    res.status(500)
    res.json({ message: "Server error." })
  }

})

async function insertDocument(db, collection, doc) {
  console.log("COLL", collection)
  console.log("DOC", doc)
  const rs = await db.collection(collection).insertOne(doc)
  if (rs["ops"][0]) {
    return rs["ops"][0];
  }
  return null
}

function createPassword(username) {
  const chr3 = username.toLowerCase().substr(0,3)
  const chr4 = ObjectID().toString().substr(-4)
  const password = chr3 + chr4
  const xfpwd = password.split('').reverse().join('')
  const saltRounds = 10;
  const bcrypt = require('bcryptjs')
  const hash = bcrypt.hashSync(password, saltRounds)
  return { hash, xfpwd }
}

function createLicenseAndAdmin(body) {
  const licenseProps = createLicenseProps(body)
  // console.log("licenseProps", licenseProps)
  const adminProps = createLicenseAdminProps(body)
  // console.log("adminProps", adminProps)

  return { licenseProps, adminProps }
}

function createLicenseProps(body) {
  let {
    /* required */ code,
    /* required */ type,
    /* required */ licenseName,
    /* required */ contactName,
    /* required */ contactUsername,
    /* required */ contactEmail,
    /* required */ createdBy,
    // publishedBy,
    publishDate,
    refreshDate,
    expiryDate,
  } = body
  if (!publishDate || publishDate == undefined) publishDate = new Date().toLocaleString("id-ID")
  if (!refreshDate || refreshDate == undefined) refreshDate = null
  if (!expiryDate || expiryDate == undefined) expiryDate = null
  return {
    _id: ObjectID().toString(),
    code: code.toLowerCase(),
    type: type.toLowerCase(),
    licenseName: licenseName,
    contactName: contactName,
    contactUsername: contactUsername.toLowerCase(),
    contactEmail: contactEmail.toLowerCase(),
    publishedBy: createdBy,
    publishDate: publishDate,
    refreshDate: refreshDate,
    expiryDate: expiryDate,
    disabled: false,
    createdBy: createdBy,
    createdAt: new Date(),
    updatedAt: null,
  }
}

function createLicenseAdminProps(body) {
  let {
    /* required */ code,
    /* required */ contactName,
    /* required */ contactUsername,
    /* required */ contactEmail,
    /* required */ createdBy,
  } = body
  // console.log("================")
  const { hash, xfpwd } = createPassword(contactUsername)
  // console.log(hash)
  return {
    _id: ObjectID().toString(),
    license: code,
    name: contactName,
    username: contactUsername.toLowerCase(),
    email: contactEmail.toLowerCase(),
    licenseOwner: true,
    verified: false,
    disabled: false,
    gender: null,
    phone: null,
    roles: [ 'license-admin', 'project-admin' ],
    hashed_password: hash,
    note: xfpwd,
    createdBy: createdBy,
    createdAt: new Date(),
    updatedAt: null,
  }
}

function createUserProps(body) {
  let {
    /* required */ license,
    /* required */ name,
    /* required */ username,
    /* required */ email,
    /* required */ createdBy,
    gender,
    phone,
    roles,
  } = body
  const { hash, xfpwd } = createPassword(username)
  return {
    _id: ObjectID().toString(),
    license: license,
    name: name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    licenseOwner: false,
    verified: false,
    disabled: false,
    gender: gender ? gender : null,
    phone: phone ? phone : null,
    roles: roles ? roles : [],
    hashed_password: hash,
    note: xfpwd,
    createdBy: createdBy,
    createdAt: new Date(),
    updatedAt: null,
  }
}

function createClientProps(body) {
  // body -> { project, client }
  let {
    /* required */ license,
    /* required */ name,
    /* required */ city,
    /* required */ createdBy,
    address,
    phone,
    // contacts
  } = body.client
  return {
    _id: ObjectID().toString(),
    license: license,
    name: name,
    address: address,
    city: city,
    phone: phone,
    contacts: [],
    createdBy: createdBy,
    createdAt: new Date(),
    updatedAt: null,
  }
}

function createProjectProps(body, _clientId = false) {
  // body -> { project, client }
  let {
    /* required */ license,
    /* required */ title,
    /* required */ label,
    /* required */ admin,
    /* required */ createdBy,
    /* required */ clientId,
    description,
    startDate,
    endDate,
  } = body.project
  if (!description || description == undefined) description = null
  if (!startDate || startDate == undefined) startDate = null
  if (!endDate || endDate == undefined) endDate = null
  // if (!contact || contact == undefined) contact = null
  console.log(license,
    title,
    admin,
    )
  return {
    _id: ObjectID().toString(),
    license: license,
    clientId: _clientId ? _clientId : clientId,
    title: title,
    label: label,
    description: description,
    startDate: startDate,
    endDate: endDate,
    status: null,
    contact: null,
    admin: admin,
    modules: [],
    gtests: 1,
    gsims: 1,
    testGroups: ["Group 1"],
    simGroups: ["Group A"],
    accessCode: null,
    createdBy: createdBy,
    createdAt: new Date(),
    updatedAt: null,
  }
}

function createProjectAndClientProps(body) {
  const clientProps = createClientProps(body)
  const projectProps = createProjectProps(body, clientProps._id)
  console.log("createProjectAndClientProps")
  return { clientProps,  projectProps }
}

function createPersonaProps(body) {
  let {
    /* required */ license,
    /* required */ projectId,
    /* required */ createdBy,
    /* required */ username,
    /* required */ email,
    /* required */ fullname,
    gender,
    // phone,
    birth,
    nip,
    position,
    currentLevel,
    targetLevel
  } = body
  if (!gender || gender == undefined) gender = null
  // if (!phone || phone == undefined) phone = null
  if (!birth || birth == undefined) birth = null
  if (!nip || nip == undefined) nip = null
  if (!position || position == undefined) position = null
  if (!currentLevel || currentLevel == undefined) currentLevel = null
  if (!targetLevel || targetLevel == undefined) targetLevel = null
  const { hash, xfpwd } = createPassword(username)
  const props = {
    _id: ObjectID().toString(),
    license: license,
    projectId: projectId,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullname: fullname,
    gender: gender,
    birth: birth,
    phone: null,
    disabled: true, // Turn FALSE when project deployed
    nip: nip,
    position: position,
    currentLevel: currentLevel,
    targetLevel: targetLevel,
    //
    gtest: 1,
    tests: [],
    testsPerformed: [],
    currentTest: null,
    //
    gsim: 1,
    simulations: [],
    simsPerformed: [],
    currentSim: null,
    hashed_password: hash,
    createdBy: createdBy,
    createdAt: new Date(),
    updatedAt: null,
    xfpwd: xfpwd,
  }
  console.log("INPROPS", props)
  return props
}

function createMemberProps(body) {
  let {
    /* required */ projectId,
    /* required */ createdBy,
    /* required */ name,
    /* required */ username,
    /* required */ email,
    /* required */ role,
  } = body
  const { hash, xfpwd } = createPassword(username)
  return {
    _id: ObjectID().toString(),
    projectId: projectId,
    name: name,
    username: username,
    email: email,
    role: role,
    hashed_password: hash,
    createdBy: createdBy,
    createdAt: new Date(),
    updatedAt: null,
    xfpwd: xfpwd,
  }
}

function createSimScheduleProps(body) {
  const {
    /* required */ projectId,
    /* required */ createdBy,
    /* required */ date,
    /* required */ experts,
    /* required */ roster,
  } = body
  return {
    _id: ObjectID().toString(),
    projectId: projectId,
    date: date,
    experts: experts,
    roster: roster,
    createdBy: createdBy,
    createdAt: new Date(),
    updatedAt: null,
  }
}

/* Logging
========== */

// Aces logging
async function _logAces(db, creator, type, id) {
  const log = new Date().toISOString() + ` @${creator} CREATED ${type}:${id}`
  console.log(log)
  await db.collection("log_aces").insertOne({ log: log })
}

// Client logging
async function _logClient(db, creator, type, id) {
  const log = new Date().toISOString() + ` @${creator} CREATED ${type}:${id}`
  console.log(log)
  await db.collection("log_client").insertOne({ log: log })
}


/*
: '5f6ef337d784025cf45ab926',
: 'Sulistiyo',
: 'sulist',
: 'sulist@example.com',
: 'guest',

*/