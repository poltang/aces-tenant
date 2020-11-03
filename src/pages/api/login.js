import withSession from 'lib/session'
import { connect } from 'lib/database'

const bcrypt = require('bcryptjs')

export default withSession(async (req, res) => {
  const { username, password } = await req.body

  try {
    const { db } = await connect()
    const rs = await db.collection("users").aggregate([
      { $match: { username: username}},
      { $lookup: {
        localField: 'license',
        from: 'licenses',
        foreignField: 'code',
        as: 'licenseInfo',
      }},
    ]).toArray()

    if (rs.length > 0) {
      const person = rs[0]
      const verified = bcrypt.compareSync(password, person.hashed_password)
      if (verified) {
        const user = {
          isLoggedIn: true,
          license: person.license,
          licenseName: person.licenseInfo[0].licenseName, // licenseInfo is array
          username: person.username,
          email: person.email,
          name: person.name,
          roles: person.roles,
        }

        req.session.set("user", user)
        await req.session.save()
        res.json(user)
      } else {
        res.status(404)
        res.json({ message: "Username/password salah." })
      }
    }
    else {
      res.status(404)
      res.json({ message: "Username/password salah." })
    }
  } catch (error) {
    res.status(404)
    res.json({ message: "Username/password salah." })
  }
})