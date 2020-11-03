import { connect } from 'lib/database'
// import { ObjectID } from 'mongodb'
import withSession from 'lib/session'

export default withSession(async (req, res) => {
  const { changePassword } = req.query

  try {
    if (changePassword != undefined) {
      const { db } = await connect()
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
  } catch (error) {
    res.status(404)
    res.json({ message: "Anda memasukkan password yang salah." })
  }

})