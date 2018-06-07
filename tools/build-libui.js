const path = require( 'path' );
const fs = require( 'fs' );
const child_process = require( 'child_process' );

if ( process.platform == 'win32' )
  buildLibuiWin32( process.env.npm_config_arch || process.arch );
else
  buildLibui();

function buildLibuiWin32( arch ) {
  const { runCMake } = require( './win32-utils' );

  console.log( 'Building libui for win32-' + arch );

  const buildDir = path.join( __dirname, '../deps/libui/build' );

  runCMake( buildDir, '..', arch );
}

function buildLibui() {
  console.log( 'Building libui for ' + process.platform + '-' + process.arch );

  const buildDir = path.join( __dirname, '../deps/libui/build' );

  if ( !fs.existsSync( buildDir ) )
    fs.mkdirSync( buildDir );

  let cmakePath = 'cmake';
  if ( process.platform == 'darwin' && fs.existsSync( '/Applications/CMake.app/Contents/bin/cmake' ) )
    cmakePath = '/Applications/CMake.app/Contents/bin/cmake';

  let result = child_process.spawnSync( cmakePath, [ '-DCMAKE_BUILD_TYPE=Release', '..' ], { cwd: buildDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;

  result = child_process.spawnSync( 'make', { cwd: buildDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;
}
