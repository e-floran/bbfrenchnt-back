const express = require('express')
const mysql = require('../db-config')

const Joi = require('joi')
const { object } = require('joi')

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
        'SELECT phu.player_player_id,user.* FROM player_has_user as phu LEFT JOIN user ON phu.user_user_id=user.user_id WHERE phu.player_player_id=?'
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
  const {
    name,
    bbid,
    pos,
    salary,
    dmi,
    age,
    size,
    pot,
    weekf,
    js,
    port,
    exdef,
    agi,
    dri,
    pas,
    ishoot,
    idef,
    reb,
    blk,
    stam,
    ft,
    ex,
    tc_ex,
    tc_int,
    tc,
    ppot,
    selec,
    com,
    link
  } = req.body
  //Required fields
  const { error } = Joi.object({
    name: Joi.string().max(255).required(),
    bbid: Joi.number().required(),
    pos: Joi.string().max(255).required(),
    salary: Joi.number().required(),
    dmi: Joi.number().required(),
    age: Joi.number().less(100).required(),
    size: Joi.string().max(255).required(),
    pot: Joi.number().less(100).required(),
    weekf: Joi.number().less(100).required()
  }).validate(
    { name, bbid, pos, salary, dmi, age, size, pot, weekf },
    { abortEarly: false }
  )
  //Insert into player
  if (error) {
    res.status(422).json({ validationErrors: error.details })
  } else {
    const sql = `INSERT INTO player
    (player_name, player_bbid, player_pos, player_salary, player_dmi, player_age, player_size, player_pot, player_weekf, player_js, player_port, player_exdef, player_agi, player_dri, player_pas, player_ishoot, player_idef, player_reb, player_blk, player_stam, player_ft, player_ex, player_tc_ex, player_tc_int, player_tc, player_ppot, player_selec, player_com, player_link) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    mysql.query(
      sql,
      [
        name,
        bbid,
        pos,
        salary,
        dmi,
        age,
        size,
        pot,
        weekf,
        js,
        port,
        exdef,
        agi,
        dri,
        pas,
        ishoot,
        idef,
        reb,
        blk,
        stam,
        ft,
        ex,
        tc_ex,
        tc_int,
        tc,
        ppot,
        selec,
        com,
        link
      ],
      (err, result) => {
        if (err) {
          res.status(500).send('1st error')
        } else {
          //Insert into player_has_user
          const sql2 = `INSERT INTO player_has_user
            (player_player_id, user_user_id)
            VALUES (?, ?)`
          const idPlayer = result.insertId
          const userData = [idPlayer, req.body.user_user_id]
          mysql.query(sql2, userData, (err, result2) => {
            console.log(req.body.user_user_id)
            if (err) {
              res.status(500).send('2nd error')
            } else {
              res.status(200).json({ result, result2 })
            }
          })
        }
      }
    )
  }
})

//PUT player by id
router.put('/:id', (req, res) => {
  const playerId = req.params.id
  mysql.query(
    'SELECT * FROM player WHERE player.player_id = ?',
    [playerId],
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error updating')
      } else {
        const playerFromDb = result[0]
        if (playerFromDb) {
          const playerPropsToUpdate = req.body
          mysql.query(
            'UPDATE player SET ? WHERE player.player_id = ?',
            [playerPropsToUpdate, playerId],
            err => {
              if (err) {
                console.log(err)
                res.status(500).send('Error updating')
              } else {
                res.status(200).json(playerPropsToUpdate)
              }
            }
          )
        } else {
          res.status(404).send(`not found`)
        }
      }
    }
  )
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
