const request = require('request')
const cheerio = require('cheerio') 

let movieName = process.argv[2]
let spoilerTime = process.argv[3]

if (movieName == undefined && spoilerTime == undefined) {
    console.log('You forgot to input a movie title and warning time!')
    process.exit()
} else if (isNaN(Number(movieName)) !== true && typeof spoilerTime == 'string') {
    console.log('The movie title and warning time are reversed!')
    process.exit()
} else if (isNaN(Number(movieName)) !== true && spoilerTime == undefined) {
    console.log('You forgot to input a movie title!')
    process.exit()
} else if (spoilerTime == undefined) {
    console.log('You forgot to input a warning time!')
    process.exit()
} else if (Number(spoilerTime) < 0) {
    console.log(`You can't use a negative warning time!`)
    process.exit()
}

let formattedMovieName = movieName.split(' ').join('%20')
const TMDbAPIKey = '89caae3626d6805ff8d425df1e493118'
const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDbAPIKey}&language=en-US&query=${formattedMovieName}&page=1&include_adult=false`

request(movieUrl, function (error, response, body) {
    let movieObj = JSON.parse(body)

    if (movieObj.results.length == 0) {
        console.log('That is not a valid movie title! Try again.')
        process.exit()
    } else {
        console.log(`**spoiler warning** about to spoil the movie ${movieName} in ${spoilerTime} seconds`)
    }
})

setTimeout(function () {

    request(movieUrl, function (error, response, body) {
        let movieObj = JSON.parse(body)
        let spoiler = movieObj.results[0].overview
        console.log(spoiler)
    })

}, Number(spoilerTime) * 1000)

const googleSearchUrl = `https://www.google.ca/search?q=${movieName}film`

request(googleSearchUrl, function (error, response, body) {
    if (error) {
        console.error('error')
        return
    }
    const $ = cheerio.load(body)
    const titles = $('h3.r > a')

    console.log(`The latest google search results for the film ${movieName} are:`)

    titles.each(function (i, title) {
        console.log($(title).text())
    })
})