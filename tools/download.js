const fs = require( 'fs' );
const path = require( 'path' );
const { URL } = require( 'url' );

const nugget = require( 'nugget' );
const extract = require( 'extract-zip' );
const rimraf = require( 'rimraf' );

const deps = require( './download-deps' );

downloadPackage( process.argv[ 2 ] );

function downloadPackage( name ) {
  const package = deps[ name ];

  if ( package == null ) {
    console.error( 'Error: Unknown package ' + name );
    process.exit( 1 );
  }

  const version = package.version;
  const url = package.url.replace( '${version}', version );

  const fileName = name + '-' + version + '.zip';

  const cacheDir = path.join( __dirname, '../.cache' );

  const zipPath = path.join( cacheDir, fileName );

  if ( !fs.existsSync( zipPath ) ) {
    if ( !fs.existsSync( cacheDir ) )
      fs.mkdirSync( cacheDir )
    
    nugget( url, { target: fileName, dir: cacheDir }, errors => {
      if ( errors != null )
        throw errors[ 0 ];

      extractPackage( name, zipPath );
    } );
  } else {
    console.log( 'Using cached ' + fileName );

    extractPackage( name, zipPath );
  }
}

function extractPackage( name, zipPath, root ) {
  console.log( 'Extracting ' + name );

  const depsDir = path.join( __dirname, '../deps' );

  if ( !fs.existsSync( depsDir ) )
    fs.mkdirSync( depsDir )
  
  const baseName = path.basename( zipPath, '.zip' );

  const tempDir = path.join( depsDir, baseName );

  if ( fs.existsSync( tempDir ) )
    rimraf.sync( tempDir );

  extract( zipPath, { dir: depsDir }, error => {
    if ( error != null )
      throw error;

    const destDir = path.join( depsDir, name );

    if ( fs.existsSync( destDir ) )
      rimraf.sync( destDir );

    fs.renameSync( tempDir, destDir );
  } );
}
