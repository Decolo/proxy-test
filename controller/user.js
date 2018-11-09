const sleep = delay => new Promise(resolve => {
  setTimout(() => {
    resolve(true)
  }, delay)
})

module.exports = {
  login(ctx) {
    ctx.body = {
      username: ctx.request.body.username
    }
  },
  async profile(ctx) {
    await sleep(1000)
    ctx.body = {
      username: 'hhhhhhh',
      gender: 'male',
      age: 18
    }
  }
}