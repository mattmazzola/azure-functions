import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"

export async function multiply(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`)

    let bodyContent = {}
    try {
        bodyContent = await request.json()
    }
    catch (e) {
        context.log(`Exception when attempting to parse JSON from body:\n${e}`)
        bodyContent = await request.text()
    }

    context.log(`Request body: ${JSON.stringify(bodyContent)}`)

    return { jsonBody: { value: 10 + 4 } }
};

app.http('multiply', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: multiply
})
