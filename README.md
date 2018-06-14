# LaunchUI

Launcher for GUI Node.js applications using [libui-node](https://github.com/parro-it/libui-node).

[![NPM module](https://img.shields.io/npm/v/launchui.svg)](https://npmjs.org/package/launchui)
[![MIT License](https://img.shields.io/github/license/mimecorg/launchui.svg)](https://github.com/mimecorg/launchui/blob/master/LICENSE)

## Introduction

Although native desktop applications can run in the standard Node.js environment, it is recommended to use [LaunchUI](https://github.com/mimecorg/launchui) to package and distribute them to end users.

Thanks to LaunchUI, users don't need to install any packages using npm or to use the command line. They don't even need to have Node.js installed. They can simply download the package, unzip it and run the application by double-clicking its icon.

LaunchUI wraps Node.js with a small executable which automatically runs the application. No console window is opened and in case of a fatal error, it is reported using a message box.

LaunchUI was created for [Vuido](https://github.com/mimecorg/vuido), but it should also work with [Proton Native](https://proton-native.js.org/) and applications using vanilla libui-node.

## Usage

The easiest way to create a package for your application is to use the [LaunchUI Packager](https://github.com/mimecorg/launchui-packager). It provides an API for creating packages for Windows, Linux and OS X.

You can also manually download the binary package for the target platform from [LaunchUI releases](https://github.com/mimecorg/launchui/releases), unpack it and replace the example `app/main.js` script with your application script.

## Installation

Usually there is no need to install LaunchUI, because during development you can use standard Node.js to run your application, and for creating packages it's recommended to use LaunchUI Packager which provides a more robust API.

You can install LaunchUI locally if you want to download the binary packages in your custom build scripts:

```bash
npm install --save-dev launchui
```

## API

LaunchUI provides an API for downloading the binary packages for the given platform and architecture.

```js
const launchui = require( 'launchui' );

launchui.download( {
  version: '0.1.0',
  platform: 'win32',
  arch: 'ia32',
  cache: './.cache'
}, function ( err, zipPath ) {
  // zipPath will be the path of the downloaded or existing package
} );
```

The `download()` function supports the following options:

- `version`: Version of the binary package to download. The default value is the current version of the launchui module.
- `platform`: The platform of the package. The default value is `process.platform`. The supported values are `win32`, `darwin` (OS X) and `linux`.
- `arch`: The architecture of the package. The default value is `process.arch`. The supported values are `x64` (on all platforms) and `ia32` (on win32/linux only).
- `cache`: Path of the directory where the downloaded package is stored. The default cache location is `~/.launchui`.

The current version of the launchui module is available as `launchui.version`.

## Supported platforms

- Windows 7 or newer (32-bit and 64-bit)
- OS X 10.8 or newer (64-bit)
- Linux (32-bit and 64-bit)

## Building

Building LaunchUI is only necessary if you need to make some customizations. In most cases it's enough to use the binary packages provided in the [LaunchUI releases](https://github.com/mimecorg/launchui/releases).

Use the following command to download and extract the source codes of Node.js, libui and libui-node to the `deps/` subdirectory:

```bash
npm run download
```

You can edit `tools/download-deps.json` to change the versions of downloaded packages.

Use the following command to build all dependencies and the LaunchUI executable in 32-bit or 64-bit mode:

```bash
npm run build --arch=[ia32|x64]
```

The `--arch` option is only supported on Windows. It makes it possible to select 32-bit or 64-bit target architecture. On Linux and OS X the target architecture is the same as the host architecture.

To build LaunchUI on Windows, you will need the following prerequisites:

- [Visual Studio 2017](https://www.visualstudio.com/downloads/) with C++ support
- [CMake](https://cmake.org/download/) 3.0 or newer
- [Python](https://www.python.org/downloads/) 2.6 or 2.7
- [NASM](http://www.nasm.us/)
- Unix tools (they are installed as part of [Git for Windows](http://git-scm.com/download/win))

To build LaunchUI on Linux, you will need:

- [build-essential](https://packages.ubuntu.com/xenial/build-essential)
- [GTK+3](https://packages.ubuntu.com/source/xenial/gtk+3.0)
- [CMake](https://cmake.org/download/) 3.0 or newer

To build LaunchUI on OS X, you will need:

- Xcode
- [CMake](https://cmake.org/download/) 3.0 or newer

Use the following command to create a binary package in the `packages/` subdirectory:

```bash
npm run package --arch=[ia32|x64]
```

The `--arch` option is only supported on Windows.

## License

LaunchUI is licensed under the MIT license

Copyright (C) 2018 Michał Męciński
