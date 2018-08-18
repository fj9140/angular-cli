// todo
import * as path from 'path';
import * as ts from 'typescript';

export interface PackageInfo{
    // todo
}

export type PackageMap = {
    [name:string]:PackageInfo
};

const tsConfigPath=path.join(__dirname,'../tsconfig.json');
const tsConfig=ts.readConfigFile(tsConfigPath,ts.sys.readFile);
const pattern = '^('
    +(tsConfig.config.exclude as string[])
    .map(ex=>path.join(path.dirname(tsConfigPath),ex))
    .map(ex=>'('
        +ex
        .replace(/[\=\[\]{}()+?./\\^$]/g,'\\$&')
        .replace(/(\\\\|\\\/)\*\*/g,'((\/|\\\\).+?)?')
        .replace(/\*/g,'[^/\\\\]*')
        +')')
    .join('|')
    +')($|/|\\\\)';
const excludeRe=new RegExp(pattern);

function _findAllPackageJson(){}

// Find all the package.json that aren't excluded from tsconfig.
const packageJsonPaths = _findAllPackageJson(path.join(__dirname,'..'),excludeRe);

// All the supported packages. Go through the packages directory and create a map of 
// name => PackageInfo. This map is partial as it lacks some information that requires the
// map itself to finish building.
export const packages:PackageMap = 
    packageJsonPaths
    .map()
    .reduce();  // todo

// todo
