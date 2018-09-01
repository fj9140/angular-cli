export function mapObject<T,V>(obj:{[k:string]:T},
    mapper:(k:string,v:T)=>V): {[k:string]:V}{
        return Object.keys(obj).reduce((acc:{[k:string]:V},k:string)=>{
            acc[k]=mapper(k,obj[k]);
            return acc;
        },{});
    }
