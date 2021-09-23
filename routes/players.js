const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

//Get all players
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM player'
  mysql.query(sql, (err, result) => {
    console.log(result)
    if (err) {
      res.status(500).send('1st Error')
    } else {
      //SELECT player_has_user
      const sql2 =
        'SELECT player_has_user.user_user_id,user.* FROM  player_has_user LEFT JOIN user ON player_has_user.user_user_id'
      mysql.query(sql2, (err, result2) => {
        console.log(result2)
        if (err) {
          res.status(500).send('2nd Error')
        } else {
          res.status(200).json({ result, result2 })
        }
      })
    }
  })
})

//GET player by id
router.get('/:id', (req, res) => {
  const playerId = req.params.id
  //SELECT on player with id
  const sql = 'SELECT * FROM player WHERE player.player_id=?'
  mysql.query(sql, playerId, (err, result) => {
    if (err) {
      res.status(500).send('1st Error')
    } else {
      //SELECT on player_has_user
      const sql2 =
        'SELECT player_has_user.user_user_id,user.* FROM  player_has_user LEFT JOIN user ON player_has_user.user_user_id'
      mysql.query(sql2, playerId, (err, result2) => {
        if (err) {
          res.status(500).send('2nd error')
        } else {
          res.status(200).json({ result, result2 })
        }
      })
    }
  })
})

//Post into player
router.post('/', (req, res) => {
  const bodyData = [
    req.body.player_name,
    req.body.player_bbid,
    req.body.player_pos,
    req.body.player_salary,
    req.body.player_dmi,
    req.body.player_age,
    req.body.player_size,
    req.body.player_pot,
    req.body.player_weekf,
    req.body.player_js,
    req.body.player_port,
    req.body.player_exdef,
    req.body.player_agi,
    req.body.player_dri,
    req.body.player_pas,
    req.body.player_ishoot,
    req.body.player_idef,
    req.body.player_reb,
    req.body.player_blk,
    req.body.player_stam,
    req.body.player_ft,
    req.body.player_ex,
    req.body.player_tc_ex,
    req.body.player_tc_int,
    req.body.player_tc,
    req.body.player_ppot,
    req.body.player_selec,
    req.body.player_com,
    req.body.player_link
  ]
  //Insert into player
  const sql = `INSERT INTO player
  (player_name, player_bbid, player_pos, player_salary, player_dmi, player_age, player_size, player_pot, player_weekf, player_js, player_port, player_exdef, player_agi, player_dri, player_pas, player_ishoot, player_idef, player_reb, player_blk, player_stam, player_ft, player_ex, player_tc_ex, player_tc_int, player_tc, player_ppot, player_selec, player_com, player_link) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

  mysql.query(sql, bodyData, (err, result) => {
    if (err) {
      res.status(500).send('1st error')
    } else {
      //Insert into player_has_user
      const sql2 = `INSERT INTO player_has_user
    (player_player_id, user_user_id)
    VALUES (?, ?)`
      const idPlayer = result.insertId
      const userData = [idPlayer, req.body.user_user_id]
      console.log(userData)
      mysql.query(sql2, userData, (err, result2) => {
        if (err) {
          res.status(500).send('2nd error')
        } else {
          res.status(200).json({ result, result2 })
        }
      })
    }
  })
})

//DELETE player by id
router.delete('/:id', (req, res) => {
  const playerId = req.params.id
  //DELETE into player_has_user
  const sql = 'DELETE FROM player_has_user WHERE player_player_id=?'
  mysql.query(sql, playerId, (err, result) => {
    if (err) {
      res.status(500).send('1st Err')
    } else {
      //DELETE player by id
      const sql2 = 'DELETE  FROM player WHERE player.player_id=?'
      mysql.query(sql2, playerId, (err, result2) => {
        if (err) {
          res.status(500).send('2nd Err')
        } else {
          res.status(200).json({ result, result2 })
        }
      })
    }
  })
})

module.exports = router
