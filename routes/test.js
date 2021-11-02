const express = require('express')
const mysql = require('../db-config')
const parseString = require('xml2js').parseString
const axios = require('axios')

const router = express.Router()

const cookie = [
  '.ASPXAUTH=DD495BCF89896AFA49F5C0B8F69442ECAAC0D325E313DAB5987C9F5372C31959957C34F302271B9171C253F48DCE61ABC1FF576B9FBA667485311C16791A1B60B9C4F9A115A797B697CEFC11E6737D0B2D823D10BE723161D57B95F36B0AC6B054E1F97458946EBF3B921903180AEEA28A7FD5A0; ASP.NET_SessionId=gdaxhsfvliubeikxzsckumf4'
]

router.get('/', (req, res) => {
  const player = []
  const getApiData = async () => {
    try {
      const getPlayer = await axios
        .get(`https://bbapi.buzzerbeater.com/player.aspx?playerid=50019036`, {
          headers: {
            Cookie: cookie[0]
          }
        })
        .then(response => {
          // console.log('player : ', response)
          parseString(response.data, function (err, result) {
            player.push(result.bbapi.player[0])
            console.log(player)
            res.status(200).send(player)
          })
        })
    } catch (error) {
      console.error(error)
    }
  }
  getApiData()
})

module.exports = router
