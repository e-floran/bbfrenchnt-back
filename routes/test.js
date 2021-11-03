const express = require('express')
const mysql = require('../db-config')
const parseString = require('xml2js').parseString
const axios = require('axios')

const router = express.Router()

const cookie = [
  '.ASPXAUTH=DA72FF33252043E7E8766786F4C892C2F20532A3C8DC30CF57CEB7EA330A915298395DC9E5C24D68051A882E224AE1365C7EF5C8DF3B0F662718F6D0DBF2A34C0AF2F790C005E1A1468B0D83722D4B7891B2472C2BA030337B45AD5673B60CA5349C06DB88BCDDFB4AE57B9DC13F4D80A02B02CF; ASP.NET_SessionId=gbvwczwmatfkd325p34ghnbw'
]

router.get('/:id', (req, res) => {
  const player = []
  const playerId = req.params.id
  const getApiData = async () => {
    try {
      const getPlayer = await axios.get(
        `https://bbapi.buzzerbeater.com/player.aspx?playerid=${playerId}`,

        {
          headers: {
            Cookie: cookie[0]
          }
        }
      )
      // .then(response => {
      // console.log('player : ', getPlayer.data)
      parseString(getPlayer.data, function (err, result) {
        player.push(result.bbapi.player[0])
        console.log('P', player)
        res.status(200).send(player)
      })
      // })
    } catch (error) {
      console.error(error)
    }
  }
  getApiData()
})

module.exports = router
