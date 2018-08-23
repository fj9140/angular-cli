'use strict';

const fs=require('fs');
const path=require('path');
const ts=require('typescript');

let _istanbulRequireHook=null;
if(process.env['CODE_COVERAGE'] || process.argv.indexOf('--code-coverage')!==-1){
    // todo
    //_istanbulRequireHook=require('./istanbul-local').istanbulRequireHook;
}

//Check if we need to profile this CLI run.
let profiler = null;
if(process.env['DEVKIT_PROFILING']){
    // todo
}

if(process.env['DEVKIT_LONG_STACK_TRACE']){
    // todo
}

global._DevKitIsLocal=true;
global._DevKitRoot=path.resolve(__dirname,'..');

const compilerOptions=ts.readConfigFile(path.join(__dirname,'../tsconfig.json'),p=>{
    return fs.readFileSync(p,'utf-8');
}).config;

const oldRequireTs =  require.extensions['.ts'];
require.extensions['.ts']=function(m,filename){
    // If we're in node module, either call the old hook or simply compile the
    // file without transpilation. We do not touche node_modules/**.
    // We do touch 'Angular DevK' files anywhere though.
    if(!filename.match(/@angular\/cli\b/) && filename.match(/node_modules/)){
        if(oldRequireTs){
            return oldRequireTs(m,filename);
        }
        return m._compile(fs.readFileSync(filename),filename);
    }

    // Node requires all require hooks to be sync
    const source=fs.readFileSync(filename).toString();

    try {
        let result = ts.transpile(source,compilerOptions['compilerOptions'],filename);

        if(_istanbulRequireHook){
            // todo
        }
    
        // Send it to node to excute.
        return m._compile(result,filename);
    } catch(err){
        console.error("Error while running script \" "+filename+"\":");
        console.error(err.stack);
        throw err;
    }
}

require.extensions['.ejs']=function(m,filename){
    // todo
}

const builtinModules = Object.keys(process.binding("natives"));
const packages=require('./packages').packages;
// If we're running locally, meaning npm linked. This is basically "developer mode".
if(!__dirname.match(new RegExp(`\\${path.sep}node_modules\\${path.sep}`))){

    // We mock the module loader so that we can fake our packages when running locally.
    const Module=require('module');
    const oldLoad=Module._load;
    const oldResolve=Module._resolveFilename;

    Module._resolveFilename=function(request,parent){
        if(request in packages){
            return packages[request].main;
        } else if(builtinModules.includes(request)){
            // It's a native Node module.
            return oldResolve.call(this,request,parent);
        } else{
            const match=Object.keys(packages).find(pkgName=>request.startsWith(pkgName+'/'));
            if(match){
                const p=path.join(packages[match].root,request.substr(match.length));
                return oldResolve.call(this,p,parent);
            }else{
                return oldResolve.apply(this,arguments);
            }
        }
    };
}

// Set the resolve hook to allow resolution of packages from a local dev enviroment.
require('@angular-devkit/core/node/resolve').setResolveHook(function(request,options){
    // todo
    console.log("setResolveHook");
    process.exit();

});
