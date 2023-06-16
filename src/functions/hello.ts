import { app, HttpHandler, HttpRequest, HttpResponse, InvocationContext } from '@azure/functions'
import * as df from 'durable-functions'
import { ActivityHandler, OrchestrationContext, OrchestrationHandler } from 'durable-functions'

const helloOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
    const outputs = []

    const random = yield context.df.callActivity('random', 100)
    const helloTokyo = yield context.df.callActivity('hello', 'Tokyo')
    const helloSeattle = yield context.df.callActivity('hello', 'Seattle')
    const helloCairo = yield context.df.callActivity('hello', 'Cairo')

    outputs.push(
        random,
        helloTokyo,
        helloSeattle,
        helloCairo,
    )

    return outputs
}

df.app.orchestration('helloOrchestrator', helloOrchestrator)

const helloOrchestratorParallel: OrchestrationHandler = function* (context: OrchestrationContext) {

    const random = yield context.df.callActivity('random', 100)

    const parallelRandomTasks = [
        context.df.callActivity('random', 100),
        context.df.callActivity('random', 100),
        context.df.callActivity('random', 100),
    ]

    yield context.df.Task.all(parallelRandomTasks)

    const randomResults = parallelRandomTasks.map(t => Number(t.result))
    const randomSum = randomResults.reduce((total, x) => total + x, 0)

    const helloTokyoTask = context.df.callActivity('hello', 'Tokyo')
    const helloSeattleTask = context.df.callActivity('hello', 'Seattle')
    const helloCairoTask = context.df.callActivity('hello', 'Cairo')

    const parallelHelloTasks = [
        helloTokyoTask,
        helloSeattleTask,
        helloCairoTask,
    ]

    yield context.df.Task.all(parallelHelloTasks)

    const helloResults = parallelHelloTasks.map(t => t.result)
    context.log({ parallelHelloTasks, helloResults })

    const outputs = [
        random,
        randomResults,
        randomSum,
        ...helloResults
    ]

    return outputs
}

df.app.orchestration('helloOrchestratorParallel', helloOrchestratorParallel)

const hello: ActivityHandler = (input: string): string => {
    return `Hello, ${input}`
}

df.app.activity('hello', {
    handler: hello
})


const random: ActivityHandler = (input: number): number => {
    return Math.floor(Math.random() * Math.max(0, input))
}

df.app.activity('random', {
    handler: random
})

const orchestratorStarter: HttpHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponse> => {
    const client = df.getClient(context)
    const body: unknown = await request.text()
    const instanceId: string = await client.startNew(request.params.orchestratorName, { input: body })

    context.log(`Started orchestration with ID = '${instanceId}'.`)

    return client.createCheckStatusResponse(request, instanceId)
}

app.http('helloHttpStart', {
    route: 'orchestrators/{orchestratorName}',
    extraInputs: [df.input.durableClient()],
    handler: orchestratorStarter,
})