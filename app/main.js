const libui = require( 'libui-node' );

const window = new libui.UiWindow( 'LaunchUI', 500, 200, false );
window.margined = true;

const box = new libui.UiVerticalBox();
box.padded = true;
window.setChild( box );

const label1 = new libui.UiLabel( 'This is a placeholder for the application using LaunchUI.' );
box.append( label1, false );

const label2 = new libui.UiLabel( 'Replace app/main.js with your application script.' );
box.append( label2, false );

window.onClosing( () => {
  libui.stopLoop();
} );

window.show();

libui.startLoop();
