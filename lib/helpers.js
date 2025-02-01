const path = require('path')
const fs = require('fs')

// Container for all the helpers
let helpers = {}

// Pase a JSON string to an object in all cases, without throwing an error

helpers.parseJsonToObject = (str)=> {
    try {
        let object = JSON.parse(str)
        return object
    } catch (e) {
        return {}
    }
}

// Create a string of random alphanumeric characters of a given length

helpers.createRandomString = (strLength) => {
    strLength = typeof (strLength) === "number" && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into a string
        const possibleCharacters = `abcdefghijklmnopqrstuvwxyz1234567890`

        // Start the final string
        let str = ''
        for (let i = 1; i <= strLength; i++) {
            // Get a random character from the possibleCharacters string and append it
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
            str += randomCharacter
        }

        return str
    }
}

// Export Module
module.exports = helpers