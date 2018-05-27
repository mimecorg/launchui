const path = require( 'path' );

const arch = process.env.npm_config_arch || process.arch;

if ( process.platform == 'win32' ) {
  buildLaunchUIWin32( arch );
} else {
  console.error( 'Error: Unsupported platform: ' + process.platform );
  process.exit( 1 );
}

function buildLaunchUIWin32( arch ) {
  const { runCMake } = require( './win32-utils' );

  console.log( 'Building launchui for win32-' + arch );

  const buildDir = path.join( __dirname, '../build' );

  runCMake( buildDir, "../src", arch );
}
