const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.post('/', req, res) => {
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
  const sql = `INSERT INTO player
  (player_name, player_bbid, player_pos, player_salary, player_dmi, player_age, player_size, player_pot, player_weekf, player_js, player_port, player_exdef, player_agi, player_dri, player_pas, player_ishoot, player_idef, player_reb, player_blk, player_stam, player_ft, player_ex, player_tc_ex, player_tc_int, player_tc, player_ppot, player_selec, player_com, player_link)`
}
module.exports = router
