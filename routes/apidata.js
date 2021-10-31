const express = require('express')
const mysql = require('../db-config')

const axios = require('axios')

const router = express.Router()

const cookie = [
  '.ASPXAUTH=AB8AAED2115F6A0CC8B58EC1C1D2FF1B4378A303268348AFAB422C93210DD67D8060B531169B24D4BFAD8C63AB1DF10C29EAEC73434BA341CA6FED5E5532B951AE316A08950B9C9917CD9096BFFA65D018FE26ECA995197B713285B59B8FEBEFA3AAA0F114EDB34D2116EA4D3FC82239795E9C27; ASP.NET_SessionId=s01imovgozay115b52udsjlu'
]

router.get('/', (req, res) => {
  console.log('hey')
  const getApiData = async () => {
    try {
      const getApiData = await axios.get(
        `https://bbapi.buzzerbeater.com/leagues.aspx?countryid=11&level=1`,
        {
          headers: {
            Cookie: cookie[0]
          }
        }
      )
      console.log('teeeeeest', getApiData)
    } catch (error) {
      console.error(error)
    }
  }
  getApiData()
})

module.exports = router
