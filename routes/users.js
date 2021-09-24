const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

//Get all users
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM user'
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error')
    } else {
      // SELECT on player_has_user
      const sql2 =
        'SELECT player_has_user.player_player_id,player.* FROM  player_has_user LEFT JOIN player ON player_has_user.player_player_id '
      mysql.query(sql2, (err, result2) => {
        if (err) {
          res.status(500).send('Error 2')
        } else {
          res.status(200).json({ result, result2 })
        }
      })
    }
  })
})

//Get a user by id
router.get('/:id', (req, res) => {
  const userId = req.params.id
  //SELECT on user with id
  const sql = 'SELECT * FROM user WHERE user.user_id=?'
  mysql.query(sql, userId, (err, result) => {
    if (err) {
      res.status(500).send('Error 1')
    } else {
      //SELECT on player_has_user
      const sql2 =
        'SELECT player_has_user.player_player_id,player.* FROM  player_has_user LEFT JOIN player ON player_has_user.player_player_id'
      mysql.query(sql2, (err, result2) => {
        if (err) {
          res.status(500).send('Error 2')
        } else {
          res.status(200).json({ result, result2 })
        }
      })
    }
  })
})
module.exports = router
