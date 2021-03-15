import {prefixed} from '/src/config.js'

window.cookies = {}

const setCookie = (name, value = '') => {
    document.cookie = `${name}=${value}; path=/`
}

const updateCookies = () => window.cookies =
    Object.fromEntries(document.cookie.split(';').map(entry => {
        const parts = entry.split('=').map(part => part.trim())
        return parts.length == 2 ? parts : false
    }).filter(Boolean))

const clearCookies = () => {
    //document.cookie = ''
    document.cookie.split(';').forEach(c => { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/') })
    updateCookies()
}

updateCookies()

const serverUrl = location.hostname == 'localhost'
    ? 'http://localhost:9011'
    : `${location.protocol}//server.${location.hostname}/`

const request = async (params, errorHandler = null) => {
    try {
        const response = await fetch(serverUrl, {
            method:      'POST',
            mode:        'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept':       'application/json'
            },
            body: JSON.stringify(params)
        })
        updateCookies()
        const json = await response.json()
        if (json.status != 'success')
            throw [
                ...(json.statusCode != null ? [json.statusCode] : []),
                ...(json.message    != null ? [json.message]    : [])
            ].join(': ') || 'unknown error'
        if (typeof json.data == 'object')
            return json.data
        else
            return {}
    } catch (e) {
        if (typeof errorHandler == 'function')
            errorHandler(e)
        else {
            console.error(e)
            window.coderace.alert.error(e)
        }
        return {}
    }
}

const api = new Proxy({}, {
    get: (_, action) => (params = {}, errorHandler = null) => request({...params, action}, errorHandler)
})

export class Status extends HTMLElement {
    colorBase = '#edff7c'
    colorDone = '#7cff89'

    constructor () {
        super()

        this.construct()
        this.load()
        setInterval(() => this.load(), 500)
    }

    async load () {
        if (this.joining)
            return
        await this.auth()
        await this.fetchPlayers()
        this.constructPlayers()
    }

    async auth () {
        if (window.cookies.playerName == null) {
            this.joining = true
            const playerName = prompt('Join as...')
            await api.join({playerName})
            setCookie('playerName', playerName)
            this.joining = false
        } else {
            const playerName = window.cookies.playerName
            await api.rejoin({playerName}, () => {
                clearCookies()
                window.coderace.alert.warn('Left.')
                //this.auth()
            })
        }
    }

    async fetchPlayers () {
        const response = await api.getPlayers()
        this.players   = Array.isArray(response.players) ? response.players : []
        const winner   = typeof response.game?.lastWin == 'string' ? response.game.lastWin : null
        const gameId   = typeof response.game?.id      == 'number' ? response.game.id      : null
        const task     = typeof response.game?.task    == 'string' ? response.game.task    : ''

        if (this.gameId == null || this.gameId != gameId) {
            if (this.gameId == null) {
                window.coderace.alert.info('Joining a game.')
            } else if (this.gameId != gameId) {
                if (winner != null)
                    window.coderace.alert.info(`Player ${winner} wins!`)
                else
                    window.coderace.alert.info('New game.')
            }

            this.gameId = gameId
            window.coderace.task.start(task)
        }

        this.goal = task.length
    }

    construct () {
        if (window.coderace == null) window.coderace = {}
        window.coderace.status = this
    }

    constructPlayers () {
        this.textContent = ''
        this.progressBars = {}
        for (const player of this.players ?? []) {
            const progressBar = this.progressBars[player.name] = document.createElement('div')
            this.displayProgress(player.name, player.progress)
            this.append(progressBar)
        }
    }

    displayProgress (playerName, progress) {
        const progressBar = this.progressBars[playerName]
        const perc = Math.floor((progress / this.goal) * 100)
        progressBar.innerHTML = `<div>${playerName}</div><div>${perc}% <span class="count">${progress} / ${this.goal}</span></div>`
        progressBar.style.background = `linear-gradient(90deg, ${this.colorDone} ${perc}%, transparent ${perc}%`
    }

    send (goal, correct) {
        this.sendProgress(correct)
        /*const perc = Math.floor((correct / goal) * 100)

        this.innerHTML = `${perc}% <span class="count">${correct} / ${goal}</span>`

        this.style.background = `linear-gradient(90deg, ${this.colorDone} ${perc}%, ${this.colorBase} ${perc}%`*/
    }

    async sendProgress (correct) {
        const response = await api.progress({progress: correct})
    }
}

customElements.define(prefixed('status'), Status)
