// todo
import * as path from 'path';
import * as ts from 'typescript';
import * as fs from 'fs';

const distRoot=path.join(__dirname,'../dist');
const {packages:monorepoPackages}=require('../.monorepo.json');

export interface PackageInfo{
    // todo
}

export type PackageMap = {
    [name:string]:PackageInfo
};

function loadPackageJson(p:string){
    const root=require('../package.json');
    const pkg=require(p);

    for(const key of Object.keys(root)){
        switch(key){
            // Keep the following keys from the package.json of the package itself.
            case 'bin':
            case 'description':
            case 'name':
            case 'main':
            case 'peerDependencies':
            case 'optionalDependencies':
            case 'typings':
            case 'version':
            case 'private':
            case 'workspaces':
            case 'resolutions':
                continue;

                // Remove the following keys from the package.json.
            case 'devDependencies':
            case 'script':
                delete pkg[key];
                continue;

                // Merge the following keys with the root package.json.
            case 'keywords':
                const a=pkg[key] ||[];
                const b=Object.keys(
                    root[key].concat(a).reduce((acc:{[k:string]:boolean},curr:string)=>{
                        acc[curr]=true;
                        return acc;
                    },{});
                );
                pgk[key]=b;
                break;
                // Overwrite the package's key with to root one;
            default:
                pkg[key]=root[key];
        }
    }
    return pkg;
}

function _findAllPackageJson(dir:string,exclude:RegExp):string[]{
    const result: string[]=[];
    fs.readdirSync(dir)
        .forEach(fileName=>{
            const p = path.join(dir,fileName);

            if(exclude.test(p)){
                return;
            } else if(/[\/\\]node_modules[\/\\]/.test(p)){
                return;
            } else if(fileName=='package.json'){
                result.push(p);
            } else if (fs.statSync(p).isDirectory()){
                result.push(..._findAllPackageJson(p,exclude));
            }
        });

    return result;
}

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
// Find all the package.json that aren't excluded from tsconfig.
const packageJsonPaths = _findAllPackageJson(path.join(__dirname,'..'),excludeRe);

// All the supported packages. Go through the packages directory and create a map of 
// name => PackageInfo. This map is partial as it lacks some information that requires the
// map itself to finish building.
export const packages:PackageMap = 
    packageJsonPaths
    .map(pkgPath=>({root:path.dirname(pkgPath)}))
    .reduce((packages:PackageMap,pkg)=>{
        const pkgRoot=pkg.root;
        const packageJson=loadPackageJson(path.join(pkgRoot,'package.json'));
        const name=packageJson['name'];
        if(!name){
            // Only build the entry if there's a package name.
            return packages;
        }
        const bin:{[name:string]:string}={};
        Object.keys(packageJson['bin']||{}).forEach(binName=>{
            let p=path.resolve(pkg.root,packageJson['bin'][binName]);
            if(!fs.existsSync(p)){
                p=p.replace(/\.js$/,'.ts');
            }
            bin[binName]=p;
        });

        packages[name]={
            build:path.join(distRoot,pkgRoot.substr(path.dirname(__dirname).length)),
            dist:path.join(distRoot,name),
            root:pkgRoot,
            relative:path.relative(path.dirname(__dirname),pkgRoot),
            main:path.resolve(pkgRoot,'src/index.ts'),
            private:packageJson.private,
            tar:path.join(distRoot,name.replace('/','_')+'.tgz'),
            bin,
            name,
            packageJson,
            snapshot:!!monorepoPackages[name].snapshotRepo,
            snapshotRepo:monorepoPackages[name].snapshotRepo,
            get snapshotHash(){
                return _getSnapshotHash(this);
            },

            dependencies:[],
            hash:'',
            dirty:false,
            version:monorepoPackages[name] && monorepoPackages[name].version || '0.0.0'
        };

        return packages;
        }


        
    },{});  // todo

// todo
