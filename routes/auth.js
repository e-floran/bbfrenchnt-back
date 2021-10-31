const express = require('express')
const connection = require('../db-config')
const jwt = require('jsonwebtoken')
const mysql = require('../db-config')
const argon2 = require('argon2')

const db = connection.promise()

const axios = require('axios')

const router = express.Router()

//Calculate Token with jwt
const calculateToken = (userEmail = '') => {
  return jwt.sign({ log: userEmail }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '3600s'
  })
}

//Find admin in DB
const findByLog = log => {
  return db
    .query('SELECT * FROM user WHERE user_log = ?', [log])

    .then(([results]) => results[0])
}

//Hasing option for password
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1
}

// const hashPassword = plainPassword => {
//   return argon2.hash(plainPassword, hashingOptions)
// }

//Check password
const verifyPassword = (plainPassword, hashedPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions)
}

//Get token from req
const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  }
  return null
}

router.post('/', (req, res) => {
  let cookie = []
  const { log, password } = req.body
  findByLog(log).then(user => {
    if (!user) res.status(401).send('Invalid log')
    else {
      verifyPassword(password, user.user_passw).then(passwC => {
        if (passwC) {
          const token = calculateToken(log)
          const getApiData = async () => {
            try {
              console.log('hey')
              const getApiData = await axios.get(
                `https://bbapi.buzzerbeater.com/login.aspx?login=${log}&code=${password}`
              )
              cookie = getApiData.headers['set-cookie']
              console.log(cookie)
              res.send({ token, cookie })
            } catch (error) {
              console.error(error)
            }
          }
          getApiData()
        } else res.send('Invalid Password')
      })
    }
  })
})

//Post route, check if token is valid
router.post('/protected', (req, res) => {
  const token = getToken(req)
  jwt.verify(
    JSON.parse(token),
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).send('Error')
      }
      return res.status(200).send('Success')
    }
  )
})

module.exports = router
