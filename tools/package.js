const path = require( 'path' );
const fs = require( 'fs' );

const archiver = require( 'archiver' );

const version = require( '../package' ).version;

const arch = process.env.npm_config_arch || process.arch;

if ( process.platform == 'win32' ) {
  packageWin32( arch );
} else {
  console.error( 'Error: Unsupported platform: ' + process.platform );
  process.exit( 1 );
}

function packageWin32( arch ) {
  const { findVisualStudio } = require( './win32-utils' );

  console.log( 'Creating package for win32-' + arch );

  const vsPath = findVisualStudio();

  const vcToolsVersion = fs.readFileSync( path.join( vsPath, 'VC/Auxiliary/Build/Microsoft.VCToolsVersion.default.txt' ), { encoding: 'utf8' } ).trim();

  let vcToolsArch;
  let ucrtArch;
  if ( arch == 'ia32' ) {
    vcToolsArch = 'HostX86/x86';
    ucrtArch = 'x86';
  } else if ( arch == 'x64' ) {
    vcToolsArch = 'HostX64/x64';
    ucrtArch = 'x64';
  } else {
    console.error( 'Error: Unknown architecture ' + arch );
    process.exit( 1 );
  }

  const vcToolsDir = path.join( vsPath, 'VC/Tools/MSVC/' + vcToolsVersion + '/bin/' + vcToolsArch );

  const ucrtDir = 'C:\\Program Files (x86)\\Windows Kits\\10\\Redist\\ucrt\\DLLs\\' + ucrtArch;

  const packagesDir = path.join( __dirname, '../packages' );

  if ( !fs.existsSync( packagesDir ) )
    fs.mkdirSync( packagesDir );

  const zipName = 'launchui-v' + version + '-win32-' + arch + '.zip';

  const output = fs.createWriteStream( path.join( packagesDir, zipName ) );
  const archive = archiver( 'zip', { zlib: { level: 9 } } );

  archive.pipe( output );

  archive.file( path.join( __dirname, '../build/launchui.exe' ), { name: 'launchui.exe' } );
  archive.file( path.join( __dirname, '../deps/node/Release/node.dll' ), { name: 'node.dll' } );
  archive.file( path.join( __dirname, '../deps/libui/build/out/libui.dll' ), { name: 'libui.dll' } );

  archive.file( path.join( vcToolsDir, 'msvcp140.dll' ), { name: 'msvcp140.dll' } );
  archive.file( path.join( vcToolsDir, 'vcruntime140.dll' ), { name: 'vcruntime140.dll' } );

  archive.glob( '*.dll', { cwd: ucrtDir } );

  archive.file( path.join( __dirname, '../deps/node/LICENSE' ), { name: 'LICENSE.node' } );
  archive.file( path.join( __dirname, '../deps/libui/LICENSE' ), { name: 'LICENSE.libui' } );
  archive.file( path.join( __dirname, '../LICENSE' ), { name: 'LICENSE.launchui' } );

  [ 'package.json', 'readme.md', 'license', 'index.js', 'nbind.node' ].forEach( name => {
    archive.file( path.join( __dirname, '../deps/libui-node/' + name ), { name: 'node_modules/libui-node/' + name } );
  } );

  [ 'package.json', 'README.md', 'LICENSE' ].forEach( name => {
    archive.file( path.join( __dirname, '../node_modules/@mischnic/async-hooks/' + name ), { name: 'node_modules/@mischnic/async-hooks/' + name } );
  } );

  archive.glob( '**/*.js', { cwd: path.join( __dirname, '../node_modules/@mischnic/async-hooks/' ) }, { prefix: 'node_modules/@mischnic/async-hooks/' } );

  [ 'package.json', 'README.md', 'LICENSE', 'es6-shim.js' ].forEach( name => {
    archive.file( path.join( __dirname, '../node_modules/es6-shim/' + name ), { name: 'node_modules/es6-shim/' + name } );
  } );

  [ 'package.json', 'README.md', 'LICENSE', 'dist/nbind.js' ].forEach( name => {
    archive.file( path.join( __dirname, '../node_modules/nbind/' + name ), { name: 'node_modules/nbind/' + name } );
  } );

  archive.file( path.join( __dirname, '../app/main.js' ), { name: 'app/main.js' } );

  archive.finalize();
}
