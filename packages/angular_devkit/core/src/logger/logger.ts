import {Observable} from 'rxjs';
import {JsonObject} from '../json/interface';

export interface LoggerMetadata extends JsonObject{
    name: string;
    path:string[];
}
export interface LogEntry extends LoggerMetadata{
    message:string;
}

export class Logger extends Observable<LogEntry>{
    private _obs:Observable<LogEntry>;

    protected get _observable(){
        return this._obs;
    };

    protected set _observable(v:Observable<LogEntry>){

    }

    constructor(public readonly name:string, public readonly parent:Logger|null=null){
        super();
    }    
}

// todo