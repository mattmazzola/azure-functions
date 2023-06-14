import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"

type User = {
    userId: string
    username: string
    email: string
    avatar: string
    password: string
    birthDate: Date
    registeredAt: Date
}

export function createRandomUser(): User {
    return {
        userId: `userId`,
        username: `username`,
        email: `email`,
        avatar: `avatar`,
        password: `password`,
        birthDate: new Date(),
        registeredAt: new Date(),
    }
}

export async function getUser(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`)

    const count = request.query.get('count') ?? 5
    const users = Array(count).fill(0).map(_ => createRandomUser())

    return {
        jsonBody: users,
        headers: {
            'x-users-count': count.toString()
        }
    }
};

app.http('getUser', {
    methods: ['GET'],
    authLevel: 'function',
    handler: getUser
})
