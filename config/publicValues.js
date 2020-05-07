// all public values that need to be acessed from different modules 

// the object containing the values
var publicValues = {}

// all the possible topics
publicValues.newsTopics = [
    "world",
    "economy",
    "business",
    "tech",
    "politics",
]

module.exports = publicValues;