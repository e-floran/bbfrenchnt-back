const express = require('express')
const mysql = require('../db-config')
const parseString = require('xml2js').parseString
const axios = require('axios')

const router = express.Router()

const cookie = [
  '.ASPXAUTH=DA72FF33252043E7E8766786F4C892C2F20532A3C8DC30CF57CEB7EA330A915298395DC9E5C24D68051A882E224AE1365C7EF5C8DF3B0F662718F6D0DBF2A34C0AF2F790C005E1A1468B0D83722D4B7891B2472C2BA030337B45AD5673B60CA5349C06DB88BCDDFB4AE57B9DC13F4D80A02B02CF; ASP.NET_SessionId=gbvwczwmatfkd325p34ghnbw'
]

router.get('/', (req, res) => {
  const proA = []
  const getApiData = async () => {
    try {
      const getApiData = await axios
        .get(
          `https://bbapi.buzzerbeater.com/leagues.aspx?countryid=11&level=2`,
          {
            headers: {
              Cookie: cookie[0]
            }
          }
        )
        .then(response => {
          console.log('retrieving leagues : ', response)
          parseString(response.data, function (err, result) {
            // console.log(
            //   'retrievingLeagues 2: ',
            //   result.bbapi.division[0].league[0]
            // )
            for (let j = 0; j < result.bbapi.division[0].league.length; j++) {
              proA.push(result.bbapi.division[0].league[j])
            }
          })
        })
    } catch (error) {
      console.error(error)
    }
  }
  getApiData().then(() => {
    console.log('all leagues', proA[0])
    const stockTeams = []
    const getTeam = async () => {
      for (let j = 0; j < proA.length; j++) {
        await axios
          .get(
            `https://bbapi.buzzerbeater.com/standings.aspx?leagueid=${proA[j].$.id}`,
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
                j <
                result.bbapi.standings[0].regularSeason[0].conference.length;
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
                    result.bbapi.standings[0].regularSeason[0].conference[j]
                      .team[i]
                  )
                }
                console.log(stockTeams)
              }
            })
          })
      }
    }
    getTeam().then(() => {
      const stockPlayers = []
      axios
        .get(
          `https://bbapi.buzzerbeater.com/roster.aspx?teamid=${stockTeams[0].$.id}`,
          {
            headers: {
              Cookie: cookie[0]
            }
          }
        )
        .then(response3 => {
          parseString(response3.data, function (err, result) {
            for (let j = 0; j < result.bbapi.roster[0].player.length; j++) {
              stockPlayers.push(result.bbapi.roster[0].player[j])
            }
          })
          console.log(stockPlayers[0].skills[0])
        })
    })
  })
})

module.exports = router
