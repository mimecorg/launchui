const path = require( 'path' );
const child_process = require( 'child_process' );

const arch = process.env.npm_config_arch || process.arch;

if ( process.platform == 'win32' ) {
  buildNodeWin32( arch );
} else {
  console.error( 'Error: Unsupported platform: ' + process.platform );
  process.exit( 1 );
}

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
