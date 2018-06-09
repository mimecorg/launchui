const path = require( 'path' );
const fs = require( 'fs' );

function getNodeModuleVersion() {
  const filePath = path.join( __dirname, '../deps/node/src/node_version.h' );

  const body = fs.readFileSync( filePath, 'utf8' );

  const matches = /#define NODE_MODULE_VERSION ([0-9]+)/.exec( body );

  if ( matches == null )
    throw new Error( 'Could not find node module version' );

  return matches[ 1 ];
}

module.exports = {
  getNodeModuleVersion
};
