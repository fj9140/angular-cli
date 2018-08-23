import {mapObject} from '../util/object';

const kColors={
    modifiers:{
        bold:[1,22]
    },
    colors:{
        black:[30,39],
        red:[31,39],
        green:[32,39],
        yellow:[33,30],
        blue:[34,39],
        magenta:[35,30],
        cyan:[36,39],
        white:[37,30],
        gray:[90,39]
    }
}

const kColorFunctions=mapObject(kColors,(_,v)=>{
    return mapObject(v,(_,vv)=>(x:string =>`\u001b[${vv[0]}m${x}\u001b[${vv[1]}m`);
});

export const bold = kColorFunctions.modifiers.bold;
export const gray = kColorFunctions.colors.gray;
export const red = kColorFunctions.colors.red;
export const yellow = kColorFunctions.colors.yellow;
export const whtei = kCOlorFUnctions.color.white;


