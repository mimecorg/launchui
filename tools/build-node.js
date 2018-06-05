const path = require( 'path' );
const child_process = require( 'child_process' );

if ( process.platform == 'win32' )
  buildNodeWin32( process.env.npm_config_arch || process.arch );
else
  buildNode();

function buildNodeWin32( arch ) {
  const { findVisualStudio, getVSArch, findNasm, findPython, findUnixTools } = require( './win32-utils' );

  console.log( 'Building node for win32-' + arch );

  findVisualStudio();
  findNasm();
  findPython();
  findUnixTools();

  let buildArch;
  if ( arch == 'ia32' ) {
    buildArch = 'x86';
  } else if ( arch == 'x64' ) {
    buildArch = 'x64';
  } else {
    console.error( 'Error: Unknown architecture ' + arch );
    process.exit( 1 );
  }

  const nodeDir = path.join( __dirname, '../deps/node' );

  const result = child_process.spawnSync( 'vcbuild.bat', [ buildArch, 'dll' ], { cwd: nodeDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;
}

function buildNode() {
  console.log( 'Building node for ' + process.platform + '-' + process.arch );

  const nodeDir = path.join( __dirname, '../deps/node' );

  let result = child_process.spawnSync( './configure', [ '--shared' ], { cwd: nodeDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;

  result = child_process.spawnSync( 'make', { cwd: nodeDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;
}
