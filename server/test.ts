import {
    Server,
    ServerRequest,
    Response
} from 'https://deno.land/std@0.90.0/http/server.ts';
import {
    Cookie,
    setCookie,
    getCookies
} from 'https://deno.land/std@0.90.0/http/cookie.ts';

const socket  = '/var/www/coderace/coderace.sock'

const listener = Deno.listen({path: socket, transport: "unix"});
const server = new Server(listener);

const decoder = new TextDecoder()
const decode  = (data: BufferSource) => decoder.decode(data)

const parse = (data: string) => {
    try {
        const result = JSON.parse(data)
        if (typeof result == 'object')
            return result
        else
            return {}
    } catch (e) {
        return {}
    }
}

class Player {
    name:      string
    progress:  number
    alive:     boolean
    #interval: number

    static aliveTime = 30_000 // ms

    constructor (name: string) {
        this.name     = name
        this.progress = 0
        this.alive    = false

        this.#interval = setInterval(() => this.checkAlive(), Player.aliveTime)
        console.log('player constructed')
    }

    checkAlive () {
        if (!this.alive) {
            removePlayer(this.name)
            clearInterval(this.#interval)
        } else {
            this.alive = false
        }
    }
}

interface Player {
    name:     string,
    progress: number
}

interface Game {
    id:      number,
    task:    string | null,
    lastWin: string | null,
    leading: string | null
}

const players: Player[] = []

const game: Game = {
    id:      0,
    task:    null,
    lastWin: null,
    leading: null
}

const newGame = () => {
    game.id     += 1
    game.task    = getTask()
    game.lastWin = game.leading
    game.leading = null
    for (const player of players) {
        player.progress = 0
    }
}

const getPlayer = (playerName: string): Player | null => players.find(player => player.name == playerName) ?? null

//const removePlayer = (playerName: string) => { delete players[] }
const removePlayer = (playerName: string) => {
    const index = players.findIndex(player => player.name == playerName)
    if (index >= 0)
        players.splice(index)
}

const enum HTTPStatus {
    Ok            = 200,
    BadRequest    = 400,
    Unauthorized  = 401,
    Forbidden     = 403,
    NotFound      = 404,
    InternalError = 500,
}

const errorMessages = {
    [HTTPStatus.Ok]:            'ok',
    [HTTPStatus.BadRequest]:    'bad request',
    [HTTPStatus.Unauthorized]:  'unauthorized',
    [HTTPStatus.Forbidden]:     'forbidden',
    [HTTPStatus.NotFound]:      'not found',
    [HTTPStatus.InternalError]: 'internal error'
}

const successResponse = (data: Record<string, unknown> = {}): Response =>
    ({status: HTTPStatus.Ok, body: JSON.stringify({status: 'success', statusCode: HTTPStatus.Ok, data})})
const errorResponse = (statusCode = HTTPStatus.InternalError, message: string | null = errorMessages[statusCode] ?? 'unknown error'): Response =>
    //({status: statusCode, body: JSON.stringify({status: 'error', statusCode, message})})
    // Returning with 200 status, to avoid CORS problems.
    ({status: HTTPStatus.Ok, body: JSON.stringify({status: 'error', statusCode, message})})

const code = (strings: TemplateStringsArray, ...vars: unknown[]) => {
    const str = strings
        .reduce((a, b, i) => a + b + (vars[i] ?? ''), '')
        .replace(/^(\s*(\n|$))*/, '')
    const initIndent = str.match(/^[ \t]*/)?.[0] ?? ''
    return str
        .replace(new RegExp(`^${initIndent}`, 'mg'), '')
        // TODO: Option to configure whether to use spaces or tabs and how many spaces make a tab.
        .replace(/    /g, '\t')
        .replace(/(\s*(\n)?)*$/, '')
}

const getTask = () => {
    // TODO
    const foo = `'boo'`
    const sample = code`
        function Point (x, y) {
            this.x = x

            this.y = y
            console.log(${foo})
        }
    `
    return sample
}





console.log(`Listening on ${socket}.`);

for await (const request of server) {
    request.respond({});
}
