import {prefixed} from '/src/config.js'

const setTextContent = (node, content) => {
    node.textContent = content
    if (!content)
        node.parentNode.append(document.createElement('br'))
}

export class Input extends HTMLPreElement {
    constructor () {
        super()
        this.construct()
        if (this.empty)
            this.newLine()
        this.focus()
    }

    clear () {
        this.textContent = ''
        this.newLine()
        this.selection = {start: {line: 0, col: 0}}
    }

    construct () {
        if (window.coderace == null) window.coderace = {}
        window.coderace.input = this
        this.classList.add(prefixed('input'))
        this.clear()

        this.contentEditable = true
        this.setAttribute('data-gramm_editor', false) // Disable Grammarly.
        this.addEventListener('input',   e => this.input(e))
        this.addEventListener('keydown', e => this.keydown(e))
    }

    get selection () {
        const selection = document.getSelection()

        const lineNumber = node => {
            if (node == this) return [0, this.line(0)]
            return node.nodeType == Node.TEXT_NODE
                ? [this.lineNumber(node.parentNode), node.parentNode]
                : [this.lineNumber(node), node]
        }
        const colNumber = (node, offset) => !node.textContent ? 0 : offset

        const [startLineNumber, startNode] = lineNumber(selection.anchorNode)
        const [endLineNumber,   endNode]   = lineNumber(selection.focusNode)
        const startColNumber  = colNumber(startNode, selection.anchorOffset)
        const endColNumber    = colNumber(endNode,   selection.focusOffset)

        if (startLineNumber < 0 || endLineNumber < 0) // Selection not contained in the editor.
            return

        const start = {
            line: startLineNumber,
            col:  startColNumber
        }
        const end = {
            line: endLineNumber,
            col:  endColNumber
        }

        const backward = start.line == end.line
            ? start.col  > end.col
            : start.line > end.line

        const collapsed   = start.line == end.line && start.col == end.col
        const startOfLine = collapsed   && start.col  == 0
        const endOfLine   = collapsed   && start.col  == startNode.textContent.length
        const firstLine   = collapsed   && start.line == 0
        const lastLine    = collapsed   && start.line == this.lineCount - 1
        const startOfFile = startOfLine && start.line == 0
        const endOfFile   = endOfLine   && start.line == this.lineCount - 1

        return {
            start: backward ? end   : start,
            end:   backward ? start : end,
            collapsed, startOfLine, endOfLine, firstLine, lastLine, startOfFile, endOfFile
        }
    }

    set selection ({start, end = start}) {
        const selection = document.getSelection()
        const range     = document.createRange()
        const startLine = this.line(start.line)
        const endLine   = this.line(end.line)
        if (startLine?.firstChild == null || endLine?.firstChild == null)
            throw 'invalid selection'
        // TODO: Remember last col.
        const startCol = Math.min(start.col, startLine.firstChild.textContent.length)
        const endCol   = Math.min(end.col,   endLine  .firstChild.textContent.length)
        try {
            range.setStart(startLine.firstChild, startCol)
            range.setEnd  (endLine.firstChild,   endCol)
        } catch (e) {
            throw 'invalid selection'
        }
        selection.removeAllRanges()
        selection.addRange(range)
    }

    line (lineNumber) {
        return this.childNodes[lineNumber]
    }

    lineNumber (line) {
        return Array.prototype.indexOf.bind(this.childNodes)(line)
    }


    get lineCount () { return this.childNodes.length }
    get empty     () { return !this.lineCount }

    newLine (line = null) {
        if (line != null && !(line instanceof HTMLElement))
            line = this.line(line)
        const newLine  = document.createElement('div')
        newLine.append(document.createTextNode(''), document.createElement('br'))
        if (line != null)
            line.after(newLine)
        else
            this.append(newLine)
        return newLine
    }

    insert (line, start, end, content) {
        if (!(line instanceof HTMLElement))
            line = this.line(line)
        line.firstChild.textContent =
            line.textContent.substring(0, start) +
            content +
            line.textContent.substring(end)
    }

    split (line, start, end) {
        if (!(line instanceof HTMLElement))
            line = this.line(line)
        const indent = line.textContent.match(/^\t*/)[0] ?? '' // TODO: Spaces?
        const left   = line.textContent.substring(end)
        const right  = line.textContent.substring(0, start)
        this.newLine(line).firstChild.textContent = indent + left
        line.firstChild.textContent = /^\s*$/.test(right)
            ? ''
            : right
        return indent.length
    }

    remove (line, start, end) {
        this.insert(line, start, end, '')
    }

    joinUp (line) {
        if (!(line instanceof HTMLElement))
            line = this.line(line)
        const prevLine = line.previousSibling
        const col      = prevLine.textContent.length
        prevLine.firstChild.textContent += line.textContent
        line.remove()
        return col
    }

    joinDown (line) {
        if (!(line instanceof HTMLElement))
            line = this.line(line)
        const nextLine = line.nextSibling
        const col      = line.textContent.length
        line.firstChild.textContent += nextLine.textContent
        nextLine.remove()
        return col
    }

    write (content) {
        const selection = this.selection
        if (selection.start.line != selection.end.line)
            throw 'Multiline range editing not supported yet.'

        this.insert(selection.start.line, selection.start.col, selection.end.col, content)
        this.selection = {start: {...selection.start, col: selection.start.col + content.length}}
    }

    writeNewLine () {
        const selection = this.selection
        if (selection.start.line != selection.end.line)
            throw 'Multiline range editing not supported yet.'

        const indent = this.split(selection.start.line, selection.start.col, selection.end.col)

        this.selection = {start: {line: selection.start.line + 1, col: indent}}
    }

    removeBackward () {
        const selection = this.selection
        if (selection.start.line != selection.end.line)
            throw 'Multiline range editing not supported yet.'

        if (selection.startOfFile)
            return

        if (selection.startOfLine && !selection.startOfFile) {
            const col = this.joinUp(selection.start.line)
            this.selection = {start: {line: selection.start.line - 1, col}}
            return
        }

        if (selection.collapsed)
            selection.start.col -= 1

        this.remove(selection.start.line, selection.start.col, selection.end.col)

        this.selection = {start: selection.start}
    }

    removeForward () {
        const selection = this.selection
        if (selection.start.line != selection.end.line)
            throw 'Multiline range editing not supported yet.'

        if (selection.endOfFile)
            return

        if (selection.endOfLine) {
            const col = this.joinDown(selection.start.line)
            this.selection = {start: {line: selection.start.line, col}}
            return
        }

        if (selection.collapsed)
            selection.end.col += 1

        this.remove(selection.start.line, selection.start.col, selection.end.col)

        this.selection = {start: selection.start}
    }

    moveBackward () {
        const selection = this.selection

        if (selection.startOfFile)
            return

        if (selection.startOfLine) {
            const col = this.line(selection.start.line).previousSibling.textContent.length
            this.selection = {start: {line: selection.start.line - 1, col: col}}
            return
        }

        if (selection.collapsed)
            selection.start.col -= 1

        this.selection = {start: {line: selection.start.line, col: selection.start.col}}
    }

    moveForward () {
        const selection = this.selection

        if (selection.endOfFile)
            return

        if (selection.endOfLine) {
            this.selection = {start: {line: selection.start.line + 1, col: 0}}
            return
        }

        if (selection.collapsed)
            selection.end.col += 1

        this.selection = {start: {line: selection.end.line, col: selection.end.col}}
    }

    moveUp () {
        const selection = this.selection

        if (selection.firstLine)
            return

        if (selection.collapsed)
            selection.start.line -= 1

        this.selection = {start: {line: selection.start.line, col: selection.start.col}}
    }

    moveDown () {
        const selection = this.selection

        if (selection.lastLine)
            return

        if (selection.collapsed)
            selection.end.line += 1

        this.selection = {start: {line: selection.end.line, col: selection.end.col}}
    }


    keydown (e) {
        try {
            switch (e.key) {
            case 'Tab':
                e.preventDefault()
                this.write('\t') // TODO: Spaces?
                break
            case 'Enter':
                e.preventDefault()
                this.writeNewLine()
                break
            case 'Delete':
                e.preventDefault()
                this.removeForward()
                break
            case 'Backspace':
                e.preventDefault()
                this.removeBackward()
                break
            case 'ArrowLeft':
                e.preventDefault()
                this.moveBackward()
                break
            case 'ArrowRight':
                e.preventDefault()
                this.moveForward()
                break
            case 'ArrowUp':
                e.preventDefault()
                this.moveUp()
                break
            case 'ArrowDown':
                e.preventDefault()
                this.moveDown()
                break
            default:
                if (e.key.length == 1 && !e.ctrlKey && !e.metaKey) { // TODO
                    this.write(e.key)
                    e.preventDefault()
                }
            }
        } catch (e) {
            window.coderace.alert.error(e)
        }

        window.coderace.task.send(this.rawText)
        window.scrollTo(0, document.body.scrollHeight);

    }

    get rawText () {
        //return this.innerHTML.replace(/<div>([^<]*)<br><\/div>/g, (_, content) => `${content}\n`)
        return Array.from(this.childNodes, line => line.textContent).join('\n')
    }

    input (e) {
        //console.log('input', e)
    }
}

window.addEventListener('keydown', function (e) {
    if (e.key == 'Escape')
        e.preventDefault()
})

customElements.define(prefixed('input'), Input, {extends: 'pre'})
