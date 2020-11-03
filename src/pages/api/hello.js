/**
 * Run once to create admin, test-license, and test-user
 */


import { connect } from 'lib/database'
import { ObjectID } from 'mongodb'

export default async (req, res) => {
  const { db } = await connect()
  if (db) console.log("CONNECTED")
  else console.log("CONNECTION FAILED")

  let admin = null, license = null, user = null
  let rs1 = await db.collection('users').findOne({ license: "aces"})
  if (rs1) admin = rs1
  else {
    rs1 = await db.collection("users").insertOne( firstAdmin() )
    console.log(rs1)
    admin = rs1['ops'][0]
  }

  let rs2 = await db.collection("licenses").findOne({ code: "lc-test"})
  if (rs2) license = rs2
  else {
    rs2 = await db.collection("licenses").insertOne( testLicense() )
    console.log(rs2)
    license = rs2['ops'][0]
  }

  let rs3 = await db.collection("users").findOne({ license: "lc-test"})
  if (rs3) user = rs3
  else {
    rs3 = await db.collection("users").insertOne( testUser() )
    console.log(rs3)
    user = rs3['ops'][0]
  }

  res.statusCode = 200
  res.json({ admin, license, user })
}


// const acesAdmin = {
function firstAdmin() {
  return {
    _id: ObjectID().toString(),
    license: 'aces',
    name: 'Yudhi Hermanu',
    username: 'yudhi',
    email: 'korgisme@gmail.com',
    licenseOwner: true,
    verified: true,
    disabled: false,
    gender: null,
    phone: null,
    roles: [ 'license-publisher' ],
    hashed_password: '$2b$12$MAhsJtJJqZ9wWFikzJ8gEe9JADvhWhUZ.cfNPQJy1JQnr8UliQihC',
    createdAt: new Date(),
    updatedAt: null,
  }
}

function testLicense() {
  return {
    _id: ObjectID().toString(),
    code: 'lc-test',
    type: 'corporate',
    licenseName: 'Sedya Duta Indonesia',
    contactName: 'Drs. Sedya Harjan',
    contactUsername: 'sedya',
    contactEmail: 'sedya@hotmail.com',
    publishedBy: 'aces',
    publishDate: new Date().toISOString().substr(0,10),
    refreshDate: null,
    expiryDate: null,
    disabled: false,
    createdAt: new Date(),
    updatedAt: null
  }
}

function testUser() {
  return {
    _id: ObjectID().toString(),
    license: 'lc-test',
    name: 'Drs. Sedya Harjan',
    username: 'sedya',
    email: 'sedya@hotmail.com',
    licenseOwner: true,
    verified: true,
    disabled: false,
    gender: null,
    phone: null,
    roles: [ 'license-admin', 'project-admin' ],
    hashed_password: '$2b$12$MAhsJtJJqZ9wWFikzJ8gEe9JADvhWhUZ.cfNPQJy1JQnr8UliQihC',
    createdAt: new Date(),
    updatedAt: null,
  }
}
