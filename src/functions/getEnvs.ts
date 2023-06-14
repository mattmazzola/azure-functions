import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"

export async function getEnvs(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`)

    return {
        jsonBody: process.env
    }
};

app.http('getEnvs', {
    methods: ['GET'],
    authLevel: 'function',
    handler: getEnvs
})
