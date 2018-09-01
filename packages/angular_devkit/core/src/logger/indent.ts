import {map} from 'rxjs/operators';
import {Logger} from './logger';

const indentationMap: {[indentationType: string]: string[]} = {};

export class IndentLogger extends Logger{
    constructor(name: string, parent: Logger | null = null, indentation = '  ') {
        super(name, parent);

        indentationMap[indentation] = indentationMap[indentation] || [''];
        const indentMap = indentationMap[indentation];

        this._observable = this._observable.pipe(map(entry => {
            const l = entry.path.filter(x => !!x).length;
            if (l >= indentMap.length) {
                let current = indentMap[indentMap.length - 1];
                while (l >= indentMap.length) {
                    current += indentation;
                    indentMap.push(current);
                }
            }

            entry.message = indentMap[l] + entry.message.split(/\n/).join('\n' + indentMap[l]);

            return entry;
        }));
    }
}

// todo
