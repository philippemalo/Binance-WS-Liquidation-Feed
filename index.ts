const ws = require("ws")

const webSocket = new ws("wss://stream.binancefuture.com/ws/!forceOrder@arr")

interface WSResponseType {
  e: string // Event Type
  E: number // Event Time
  o: {
    s: string // Symbol
    S: string // Side
    o: string // Order Type
    f: string // Time in Force
    q: number // Original Quantity
    p: number // Price
    ap: number // Average Price
    X: string // Order Status
    l: number // Order Last Filled Quantity
    z: number // Order Filled Accumulated Quantity
    T: number // Order Trade Time
  }
}

webSocket.on("open", () => {
  console.log("Connected!")

  let timeOfConnection = new Date(Date.now()).toLocaleTimeString("en-US")

  let timeBetweenForceOrder = Date.now()

  console.log("Time of connection is: ", timeOfConnection)

  webSocket.send('{ "method": "SUBSCRIBE", "params": ["!forceOrder@arr"], "id": 1 }')

  webSocket.on("message", (response: any) => {
    const res = JSON.parse(response)

    let streakCounter = 0

    if (res.e === "forceOrder") {
      const typedRes: WSResponseType = res
      const timeOfEvent = new Date(Date.now()).toLocaleTimeString("en-US")
      console.log(timeOfEvent)
      console.log(typedRes.o.S === "BUY" ? "-- BEAR REKT --" : "-- BULL REKT --")
      console.log(
        "Binance liquidation engine force " +
          (typedRes.o.S === "BUY" ? "bought " : "sold ") +
          Number(typedRes.o.q * typedRes.o.ap).toFixed(2) +
          "$ on " +
          typedRes.o.s
      )
      console.log("Asset price @ " + Number(typedRes.o.ap).toFixed(2))
      console.log("Time elapsed since last force Order: ", typedRes.E - timeBetweenForceOrder)
      timeBetweenForceOrder = typedRes.E

      if (timeBetweenForceOrder < 15000) {
        streakCounter += 1
      } else {
        streakCounter = 0
      }
      console.log(`Streak counter is at: ${streakCounter}`)
    } else {
      const typedTestResponse: WSResponseType = {
        e: "forceOrder", // Event Type
        E: 1568014460893, // Event Time
        o: {
          s: "BTCUSDT", // Symbol
          S: "SELL", // Side
          o: "LIMIT", // Order Type
          f: "IOC", // Time in Force
          q: 0.014, // Original Quantity
          p: 9910, // Price
          ap: 9910, // Average Price
          X: "FILLED", // Order Status
          l: 0.014, // Order Last Filled Quantity
          z: 0.014, // Order Filled Accumulated Quantity
          T: 1568014460893, // Order Trade Time
        },
      }

      const timeOfEvent = new Date(Date.now()).toLocaleTimeString("en-US")
      console.log("TESTING --- " + timeOfEvent)
      console.log(typedTestResponse.o.S === "BUY" ? "-- BEAR REKT --" : "-- BULL REKT --")
      console.log(
        "Binance liquidation engine force " +
          (typedTestResponse.o.S === "BUY" ? "bought " : "sold ") +
          (typedTestResponse.o.q * typedTestResponse.o.ap).toFixed(2) +
          "$ on " +
          typedTestResponse.o.s
      )
      console.log("Asset price @ " + typedTestResponse.o.ap.toFixed(2))
      console.log("Time elapsed since last force Order: ", typedTestResponse.E - timeBetweenForceOrder)
    }
    console.log(
      "--------------------------------------------------------------------------------------------------------------------------------------"
    )
  })
})
