import {prefixed} from '/src/config.js'

class Alert extends HTMLElement {
    types = ['info', 'warn', 'error']

    constructor () {
        super()
        this.construct()
        this.load()
        if (window.coderace == null) window.coderace = {}
        window.coderace.alert = this
    }

    construct () {
        this.classList.add(prefixed('alert'))
        this.close()
    }

    load () {

    }

    set type (type) {
        if (!this.types.includes(type))
            type = this.types[0]
        this.classList.remove(...this.types)
        this.classList.add(type)
    }

    get type () {
        for (const type of this.types) if (this.classList.contains(type))
            return type
    }

    set message (message) {
        this.textContent = message
    }

    get message () {
        return this.textContent
    }

    close () {
        this.setAttribute('hidden', '')
    }

    alert (message, type) {
        this.textContent = message
        this.type        = type
        this.removeAttribute('hidden')
        setTimeout(() => this.close(), 2000)
    }

    info  (message) { return this.alert(message, 'info')  }
    warn  (message) { return this.alert(message, 'warn')  }
    error (message) { return this.alert(message, 'error') }
}

customElements.define(prefixed('alert'), Alert)
