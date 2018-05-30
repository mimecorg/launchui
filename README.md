# LaunchUI

Launcher for GUI Node.js applications using [libui-node](https://github.com/parro-it/libui-node).

[![NPM module](https://img.shields.io/npm/v/launchui.svg)](https://npmjs.org/package/launchui)
[![MIT License](https://img.shields.io/github/license/mimecorg/launchui.svg)](https://github.com/mimecorg/launchui/blob/master/LICENSE)

## Introduction

LaunchUI is a wrapper for Node.js which makes it easier to package and distribute GUI applications using libui-node to end users.

Although libui-node is designed to work with standard Node.js, most regular users don't know how to install packages using npm and run them using the command line. Usually they don't even have Node.js installed. So applications using libui-node must be shipped with the Node.js executable.

The problem is that Node.js is designed to create command line applications, not GUI applications. It means that:

- You have to create a wrapper script which runs node with the path to your application. But most users will click on the Node icon, not on the wrapper script.
- On Windows, a console window is opened when you run the application.
- If there is an error, it is printed to the console window, which is then immediately closed.

LaunchUI wraps Node.js with a small executable which automaticaly runs your application. No console window is opened and in case of a fatal error, it is reported using a message box.

LaunchUI was created for [Vuido](https://github.com/mimecorg/vuido), but it should also work with [Proton Native](https://proton-native.js.org/) and applications using vanilla libui-node.

## Usage

Download the binary package for your platform from [Releases](https://github.com/mimecorg/launchui/releases), unpack it and replace the example `app/main.js` script with your application script.

You can rename `launchui.exe` to a different name. You can also replace the default icon and version information, for example using [rcedit](https://github.com/electron/rcedit).

## API

LaunchUI provides an API for downloading the binary package for the given platform and architecture.

```js
const launchui = require( 'launchui' );

launchui.download( {
  version: '0.1.0',
  platform: 'win32',
  arch: 'ia32',
  cache: './.cache'
}, ( err, zipPath ) {
  // zipPath will be the path of the downloaded or existing package
} );
```

The `download()` function supports the following options:

- `version`: Version of the binary package to download. The default value is the current version of the launchui module.
- `platform`: The platform of the package. The default value is `process.platform`.
- `arch`: The architecture of the package. The default value is `process.arch`.
- `cache`: Path of the directory where the downloaded package is stored. The default cache location is `~/.launchui`.

The current version of the launchui module is available as `launchui.version`.

## Building

Use the following command to download and extract the source codes of Node.js, libui and libui-node to the `deps/` subdirectory:

```bash
npm run download
```

You can edit `tools/download-deps.json` to change the versions of downloaded packages.

Use the following command to build all dependencies and the LaunchUI executable in 32-bit or 64-bit mode:

```bash
npm run build --arch=[ia32|x64]
```

To build LaunchUI on Windows, you will need the following prerequisites:

- [Visual Studio 2017](https://www.visualstudio.com/downloads/) with C++ support
- [CMake](https://cmake.org/download/) 3.0 or newer
- [Python](https://www.python.org/downloads/) 2.6 or 2.7
- [NASM](http://www.nasm.us/)
- Unix tools (they are installed as part of [Git for Windows](http://git-scm.com/download/win))

Support for Linux and OS X will be added soon.

## Development status

At the moment LaunchUI is in an early stage of development. Currently only Windows is supported. Here's the high level roadmap for future versions:

- [ ] Create a utility for automatic packaging
- [ ] Add Linux support
- [ ] Add OS X support

## License

LaunchUI is licensed under the MIT license

Copyright (C) 2018 Michał Męciński
