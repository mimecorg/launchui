const path = require( 'path' );
const fs = require( 'fs' );
const child_process = require( 'child_process' );

if ( process.platform == 'win32' )
  buildLaunchUIWin32( process.env.npm_config_arch || process.arch );
else
  buildLaunchUI();

function buildLaunchUIWin32( arch ) {
  const { runCMake } = require( './win32-utils' );

  console.log( 'Building launchui for win32-' + arch );

  const buildDir = path.join( __dirname, '../build' );

  runCMake( buildDir, "../src", arch );
}

function buildLaunchUI() {
  console.log( 'Building launchui for ' + process.platform + '-' + process.arch );

  const buildDir = path.join( __dirname, '../build' );

  if ( !fs.existsSync( buildDir ) )
    fs.mkdirSync( buildDir );

  const nodeDir = path.join( __dirname, '../deps/node' );
  const libuiDir = path.join( __dirname, '../deps/libui' );

  const nodeSrc = path.join( nodeDir, 'out/Release/lib.target/libnode.so.57' );
  const nodeDest = path.join ( buildDir, 'libnode.so' );

  if ( !fs.existsSync( nodeDest ) )
    fs.symlinkSync( nodeSrc, nodeDest );

  const libuiSrc = path.join( libuiDir, 'build/out/libui.so.0' );
  const libuiDest = path.join ( buildDir, 'libui.so' );

  if ( !fs.existsSync( libuiDest ) )
    fs.symlinkSync( libuiSrc, libuiDest );

  let result = child_process.spawnSync( 'cmake', [ '-DCMAKE_BUILD_TYPE=Release', '../src' ], { cwd: buildDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;

  result = child_process.spawnSync( 'make', { cwd: buildDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;
}
