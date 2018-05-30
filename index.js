const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );

const nugget = require( 'nugget' );

const version = require( './package' ).version;

function download( opts, callback ) {
  if ( typeof opts === 'function' ) {
    callback = opts;
    opts = {};
  }

  const fileVersion = opts.version || version;

  const plaftorm = opts.plaftorm || process.platform;
  const arch = opts.arch || process.arch;

  const cacheDir = opts.cache || path.join( os.homedir(), '.launchui' );

  const fileName = 'launchui-v' + fileVersion + '-' + plaftorm + '-' + arch + '.zip';

  const zipPath = path.join( cacheDir, fileName );

  if ( !fs.existsSync( zipPath ) ) {
    if ( !fs.existsSync( cacheDir ) )
      fs.mkdirSync( cacheDir )

    const url = 'https://github.com/mimecorg/launchui/releases/download/v' + fileVersion + '/' + fileName;

    nugget( url, { target: fileName, dir: cacheDir }, errors => {
      if ( errors != null )
        return callback( errors[ 0 ], null );

      callback( null, zipPath );
    } );
  } else {
    callback( null, zipPath );
  }
}

module.exports = {
  version,
  download
};
