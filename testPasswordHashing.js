const argon2 = require('argon2')

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1
}

const hashPassword = plainPassword => {
  return argon2.hash(plainPassword, hashingOptions)
}

hashPassword('test').then(hashedPassword => {
  console.log(hashedPassword)
})
