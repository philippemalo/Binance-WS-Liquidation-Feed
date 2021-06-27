const ws = require("ws")

const webSocket = new ws("wss://stream.binancefuture.com/ws/!forceOrder@arr")

webSocket.on("open", () => {
  console.log("Connected!")

  let timeOfConnection = new Date(Date.now()).toLocaleTimeString("en-US")

  let timeBetweenForceOrder = Date.now()

  console.log("Time of connection is: ", timeOfConnection)

  webSocket.send('{ "method": "SUBSCRIBE", "params": ["!forceOrder@arr"], "id": 1 }')

  webSocket.on("message", (response) => {
    const res = JSON.parse(response)

    let streakCounter = 0

    if (res.e === "forceOrder") {
      const timeOfEvent = new Date(Date.now()).toLocaleTimeString("en-US")
      console.log(timeOfEvent)
      console.log(res.o.S === "BUY" ? "-- BEAR REKT --" : "-- BULL REKT --")
      console.log(
        "Binance liquidation engine force " +
          (res.o.S === "BUY" ? "bought " : "sold ") +
          (res.o.q * res.o.ap).toFixed(2) +
          "$ on " +
          res.o.s
      )
      console.log("Asset price @ " + res.o.ap.toFixed(2))
      console.log("Time elapsed since last force Order: ", res.E - timeBetweenForceOrder)
      timeBetweenForceOrder = res.E

      if (timeBetweenForceOrder < 15000) {
        streakCounter++
      } else {
        streakCounter = 0
      }
      console.log(`Streak counter is at: ${streakCounter}`)
    }
    console.log(
      "--------------------------------------------------------------------------------------------------------------------------------------"
    )
  })
})
