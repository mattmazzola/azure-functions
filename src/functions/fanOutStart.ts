import * as df from "durable-functions"

df.app.orchestration("fanOutFanInDemo", function* (context) {
    context.log(`fanOutFanInDemo function starting!`)
    
    const maxValue = 10
    const initialGetRandomResponse = yield context.df.callActivity("getRandom")
    context.log({ initialGetRandomResponse })
    
    const parallelTasks = []
    for (let i = 0; i < maxValue; i += 1) {
        const functionTask = context.df.callActivity("getRandom")
        parallelTasks.push(functionTask)
    }

    yield context.df.Task.all(parallelTasks)

    context.log({ parallelTasks })

    // Aggregate all N outputs and send the result to F3.
    const sum = parallelTasks.reduce((total: number, funcResponse) => {
        const value = funcResponse.value
        return total + value
    }   , 0)

    context.log({ sum })
    context.log(`fanOutFanInDemo function ending!`)

    return {
        initialGetRandomResponse,
        parallelTasks,
        sum
    }
})