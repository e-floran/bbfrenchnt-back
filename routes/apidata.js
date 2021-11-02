const express = require('express')
const mysql = require('../db-config')
const parseString = require('xml2js').parseString
const axios = require('axios')

const router = express.Router()

const cookie = [
  '.ASPXAUTH=284FB86180B234AFC33E815362F77087DC65600314D912DCD9F14B31DBF59954AB2466CDD285E28DE1125BED62271F1AC56D02F4EAC774D191D51FD46A98BB87807DFA22B4ABDB4730F1DCBA999638CA638B9AD471FCD7A34D2835C09ECEA64AE4E7E51AD3D49461CA0AACBE7B2960F13D24823A; ASP.NET_SessionId=32jwsiw03cb5ke2ypzspzv3x'
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
