'use strict';

const fs=require('fs');

const path=require('path');
const ts=require('typescript');

let _istanbuRequireHook=null;
if(process.env['CODE_COVERAGE'] || process.argv.indexOf('--code-coverage')!==-1){
    // todo
    //_istanbulRequireHook=require('./istanbul-local').istanbulRequireHook;
}

//Check if we need to profile this CLI run.
let profile = null;
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

const oldRequiresTs =  require.extensions['.ts'];
require.extensions['.ts']=function(m,filename){
    // todo
}

require.extensions['.ejs']=function(m,filename){
    // todo
}

const builtinModules = Object.keys(process.binding("natives"));
const packages=require('./packages').packages;console.log(require('./packages'));
