const path = require( 'path' );

const arch = process.env.npm_config_arch || process.arch;

if ( process.platform == 'win32' ) {
  buildLibuiWin32( arch );
} else {
  console.error( 'Error: Unsupported platform: ' + process.platform );
  process.exit( 1 );
}

function buildLibuiWin32( arch ) {
  const { runCMake } = require( './win32-utils' );

  console.log( 'Building libui for win32-' + arch );

  const buildDir = path.join( __dirname, '../deps/libui/build' );

  runCMake( buildDir, '..', arch );
}
