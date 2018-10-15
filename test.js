
const generateString = (stringLength) => {
    const randomstring = require('randomstring')
    const s = new Set()
    s.add(randomstring.generate(stringLength))
    return s
  }

  const string = generateString(10)
  console.log(string)
