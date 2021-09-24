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

//Post into user
router.post('/', (req, res) => {
  const bodyData = [req.body.user_log, req.body.user_passw, req.body.user_role]
  //Insert into user
  const sql =
    'INSERT INTO user (user_log, user_passw, user_role) VALUES (?, ?, ?)'
  mysql.query(sql, bodyData, (err, result) => {
    if (err) {
      res.status(500).send('Error 1')
    } else {
      // //Insert into player_has_user
      // const sql2 =
      //   'INSERT INTO player_has_user (user_user_id, player_player_id) VALUES (?, ?)'
      // const idUser = result.insertId
      // const userData = [idUser, req.body.player_player_id]
      // mysql.query(sql2, userData, (err, result2) => {
      //   if (err) {
      //     res.status(500).send('Error 2')
      //   } else {
      res.status(200).json({ result })
    }
  })
})

//Delete a User by Id
router.delete('/:id', (req, res) => {
  const userId = req.params.id
  const sql = 'DELETE FROM user WHERE user.user_id=?'
  mysql.query(sql, userId, (err, result) => {
    if (err) {
      res.status(500).send('Error deleting user')
    } else {
      res.status(200).send('User Deleted')
    }
  })
})

module.exports = router
