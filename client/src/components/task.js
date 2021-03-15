import {prefixed} from '/src/config.js'

const commonPrefixLength = (a, b) => {
    let i;
    for (i = 0; i < a.length && i < b.length; ++i) if (a[i] != b[i])
        break;
    return i;
}

class Task extends HTMLPreElement {
    constructor () {
        super()
        this.construct()
    }

    start (task) {
        this.task = task
        this.load()
        window.coderace.input.clear()
    }

    construct () {
        if (window.coderace == null) window.coderace = {}
        window.coderace.task = this
        this.classList.add(prefixed('task'))
    }

    load () {
        this.textContent = ''
        for (const lineContent of this.task.split('\n'))
            this.newLine(lineContent)
    }

    line (lineNumber) {
        return this.childNodes[lineNumber]
    }

    newLine (content) {
        const line = document.createElement('div')
        this.setLineContent(line, content)
        this.append(line)
    }

    setLineContent (line, content = null, lastCorrect = 0, lastWritten = lastCorrect) {
        content ??= this.getLineContent(line)
        if (line != null && !(line instanceof HTMLElement))
            line = this.line(line)
        const correct   = content.substring(0, lastCorrect)
        const incorrect = content.substring(lastCorrect, lastWritten)
        const rest      = content.substring(lastWritten)
        const split =
            (correct   ? `<span data-correct>${correct}</span>` : '') +
            (incorrect ? `<span data-incorrect>${incorrect}</span>` : '') +
            rest
        const html = split.replace(/\t/g, '<span data-tab>→   </span>')
        line.innerHTML = html
        line.append(document.createElement('br'))
    }

    getLineContent (line) {
        return line.innerHTML
            .replace(/<span data-tab[^>]*>[^<]*<\/span>/g, '\t') // TODO: Possible whitespace and other attributes in the span.
            .replace(/<span[^>]*>([^<]*)<\/span>/g, (_, content) => content) // TODO: Possible whitespace and other attributes in the span.
            .replace(/<br>/,    '')
            .replace(/&amp;/g,  '&')
            .replace(/&lt;/g,   '<')
            .replace(/&gt;/g,   '>')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, '\'')
            .replace(/&#x60;/g, '`')
    }

    get rawText () {
        return Array.from(this.childNodes, line => this.getLineContent(line)).join('\n')
    }

    send (input) {
        const rawText       = this.rawText
        const goalLength    = rawText.length
        const correctLength = commonPrefixLength(input, rawText)
        const totalLengths  = input.split('\n').map(lineContent => lineContent.length).reverse()
        window.coderace.status.send(goalLength, correctLength)
        let restLength = correctLength
        for (const line of this.childNodes) {
            const totalLength = totalLengths.pop()
            const lineLength = this.getLineContent(line).length
            if (restLength > lineLength) { // Whole line correct.
                line.classList.add('done')
                this.setLineContent(line, null, restLength, totalLength)
                restLength -= lineLength + 1
            } else if (restLength == 0) { // No more correct characters. While line incorrect.
                this.setLineContent(line, null, restLength, totalLength)
                line.classList.remove('done')
            } else { // Part of the line is correct. (Last correct line.)
                this.setLineContent(line, null, restLength, totalLength)
                line.classList.remove('done')
                restLength = 0
            }
        }
    }
}

customElements.define(prefixed('task'), Task, {extends: 'pre'})
