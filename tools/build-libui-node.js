const path = require( 'path' );
const fs = require( 'fs' );
const child_process = require( 'child_process' );

if ( process.platform == 'win32' )
  buildLibuiNodeWin32( process.env.npm_config_arch || process.arch );
else
  buildLibuiNode();

function buildLibuiNodeWin32( arch ) {
  const { findVisualStudio, findPython } = require( './win32-utils' );

  console.log( 'Building libui-node for win32-' + arch );

  findVisualStudio();
  findPython();

  if ( arch != 'ia32' && arch != 'x64' ) {
    console.error( 'Error: Unknown architecture ' + arch );
    process.exit( 1 );
  }

  const nodeDir = path.join( __dirname, '../deps/node' );
  const libuiDir = path.join( __dirname, '../deps/libui' );
  const libuiNodeDir = path.join( __dirname, '../deps/libui-node' );

  const libSrc = path.join( libuiDir, 'build/out/libui.lib' );
  const libDest = path.join ( libuiNodeDir, 'libui.lib' );

  fs.copyFileSync( libSrc, libDest );

  const headerSrc = path.join( libuiDir, 'ui.h' );
  const headerDest = path.join ( libuiNodeDir, 'ui.h' );

  fs.copyFileSync( headerSrc, headerDest );

  const autogypiPath = path.join( __dirname, '../node_modules/.bin/autogypi.cmd' );
  const nodeGypPath = path.join( __dirname, '../node_modules/.bin/node-gyp.cmd' );

  let result = child_process.spawnSync( autogypiPath, { cwd: libuiNodeDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;

  result = child_process.spawnSync( nodeGypPath, [ 'configure', '--nodedir=' + nodeDir, '--arch=' + arch ], { cwd: libuiNodeDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;

  result = child_process.spawnSync( nodeGypPath, [ 'build' ], { cwd: libuiNodeDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;
}

function buildLibuiNode() {
  console.log( 'Building libui-node for ' + process.platform + '-' + process.arch );

  const nodeDir = path.join( __dirname, '../deps/node' );
  const libuiDir = path.join( __dirname, '../deps/libui' );
  const libuiNodeDir = path.join( __dirname, '../deps/libui-node' );

  const libSrc = path.join( libuiDir, 'build/out/libui.so.0' );
  const libDest = path.join ( libuiNodeDir, 'libui.so' );

  if ( !fs.existsSync( libDest ) )
    fs.symlinkSync( libSrc, libDest );

  const headerSrc = path.join( libuiDir, 'ui.h' );
  const headerDest = path.join ( libuiNodeDir, 'ui.h' );

  if ( !fs.existsSync( headerDest ) )
    fs.symlinkSync( headerSrc, headerDest );

  const autogypiPath = path.join( __dirname, '../node_modules/.bin/autogypi' );
  const nodeGypPath = path.join( __dirname, '../node_modules/.bin/node-gyp' );

  let result = child_process.spawnSync( autogypiPath, { cwd: libuiNodeDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;

  result = child_process.spawnSync( nodeGypPath, [ 'configure', '--nodedir=' + nodeDir ], { cwd: libuiNodeDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;

  result = child_process.spawnSync( nodeGypPath, [ 'build' ], { cwd: libuiNodeDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;
}
