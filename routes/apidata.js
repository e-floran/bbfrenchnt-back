const express = require('express')
const mysql = require('../db-config')
const parseString = require('xml2js').parseString
const axios = require('axios')

const router = express.Router()

const cookie = [
  '.ASPXAUTH=F271A207D0A382C0422BD3647ADD68DEFF074086BAE22C376911407829B73889A7E24C3E2448D0969CDD284FCED26C268A6C3653119C5E55372B7C5C5ADD9AFB2726BFC9FEB575FC6757A5B62F5507DF808ECA3A4F919639D17D90D66E917AB2A7BD241CD2CEDC8950921D4DBA0369D68888E5F5; ASP.NET_SessionId=ezk1ie5pnag0lhakadpefuec'
]

router.get('/', (req, res) => {
  console.log('hey')
  const proA = []
  const getApiData = async () => {
    try {
      const getApiData = await axios
        .get(
          `https://bbapi.buzzerbeater.com/leagues.aspx?countryid=11&level=1`,
          {
            headers: {
              Cookie: cookie[0]
            }
          }
        )
        .then(response => {
          console.log('retrieving leagues 2 : ', response)
          parseString(response.data, function (err, result) {
            proA.push(result.bbapi.division[0].league[0])
          })
        })
    } catch (error) {
      console.error(error)
    }
  }
  getApiData().then(() => {
    console.log(proA)
    const stockTeams = []
    const getTeam = axios
      .get(
        `https://bbapi.buzzerbeater.com/standings.aspx?leagueid=${proA[0].$.id}`,
        {
          headers: {
            Cookie: cookie[0]
          }
        }
      )
      .then(response2 => {
        parseString(response2.data, function (err, result) {
          console.log(
            'retrievingTeams : ',
            result.bbapi.standings[0].regularSeason[0].conference
          )
          for (
            let j = 0;
            j < result.bbapi.standings[0].regularSeason[0].conference.length;
            j++
          ) {
            for (
              let i = 0;
              i <
              result.bbapi.standings[0].regularSeason[0].conference[j].team
                .length;
              i++
            ) {
              stockTeams.push(
                result.bbapi.standings[0].regularSeason[0].conference[j].team[i]
              )
            }
            console.log(stockTeams)
          }
        })
      })
  })
})

module.exports = router
