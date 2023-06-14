import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"

export async function getrandom(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`)

    const maxValueString = request.query.get('max')
        ?? (await request.text()
            || 100)
    const maxValue = Number(maxValueString)
    const randomValue = Math.floor(Math.random() * maxValue)

    return { jsonBody: { value: randomValue } }
};

app.http('getRandom', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getrandom
})
