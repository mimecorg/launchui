const path = require( 'path' );
const fs = require( 'fs' );
const child_process = require( 'child_process' );

const programFiles64 = process.env[ 'ProgramFiles' ];
const programFiles32 = process.env[ 'ProgramFiles(x86)' ];

function findVisualStudio() {
  const vswherePath64 = path.join( programFiles64, 'Microsoft Visual Studio/Installer/vswhere.exe' );
  const vswherePath32 = path.join( programFiles32, 'Microsoft Visual Studio/Installer/vswhere.exe' );

  let vswherePath;
  if ( fs.existsSync( vswherePath64 ) ) {
    vswherePath = vswherePath64;
  } else if ( fs.existsSync( vswherePath32 ) ) {
    vswherePath = vswherePath32;
  } else {
    console.error( 'Error: Could not find vswhere.exe, make sure that you have Visual Studio 2017 installed' );
    process.exit( 1 );
  }

  const vswhereArgs = '-latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath -version "[15.0,16.0)"';

  const vsPath = child_process.execSync( '"' + vswherePath + '" ' + vswhereArgs, { encoding: 'utf8', windowsHide: true } ).trim();

  console.log( 'Visual Studio 2017 found: ' + vsPath );

  return vsPath;
}

function findNasm() {
  const nasmPath64 = path.join( programFiles64, 'NASM/nasm.exe' );
  const nasmPath32 = path.join( programFiles32, 'NASM/nasm.exe' );

  let nasmPath;
  if ( fs.existsSync( nasmPath64 ) ) {
    nasmPath = nasmPath64;
  } else if ( fs.existsSync( nasmPath32 ) ) {
    nasmPath = nasmPath32;
  } else {
    console.error( 'Error: Could not find nasm.exe, make sure that you have NASM installed' );
    process.exit( 1 );
  }

  console.log( 'nasm.exe found: ' + nasmPath );

  return nasmPath;
}

function findPython() {
  let pythonPath;
  try {
    pythonPath = child_process.execSync( 'where python.exe 2>NUL', { encoding: 'utf8' } ).trim();
  } catch ( error ) {
    console.error( 'Error: Could not find python.exe, make sure you have Python 2.x installed' );
    process.exit( 1 );
  }

  console.log( 'python.exe found: ' + pythonPath );

  return pythonPath;
}

function findUnixTools() {
  let mvPath;
  try {
    mvPath = child_process.execSync( 'where mv.exe 2>NUL', { encoding: 'utf8' } ).trim();
  } catch ( error ) {
    console.error( 'Error: Could not find mv.exe, make sure you have Unix tools installed' );
    process.exit( 1 );
  }

  const unixToolsPath = path.dirname( mvPath );

  console.log( 'Unix tools found: ' + unixToolsPath );

  return unixToolsPath;
}

function findCMake() {
  const cmakePath64 = path.join( programFiles64, 'CMake/bin/cmake.exe' );
  const cmakePath32 = path.join( programFiles32, 'CMake/bin/cmake.exe' );

  let cmakePath;
  if ( fs.existsSync( cmakePath64 ) ) {
    cmakePath = cmakePath64;
  } else if ( fs.existsSync( cmakePath32 ) ) {
    cmakePath = cmakePath32;
  } else {
    console.error( 'Error: Could not find cmake.exe, make sure that you have CMake installed' );
    process.exit( 1 );
  }

  console.log( 'cmake.exe found: ' + cmakePath );

  return cmakePath;
}

function runCMake( buildDir, srcDir, arch ) {
  const vsPath = findVisualStudio();
  const cmakePath = findCMake();

  let vsArch;
  if ( arch == 'ia32' ) {
    vsArch = 'x64_x86';
  } else if ( arch == 'x64' ) {
    vsArch = 'x64';
  } else {
    console.error( 'Error: Unknown architecture ' + arch );
    process.exit( 1 );
  }

  if ( !fs.existsSync( buildDir ) )
    fs.mkdirSync( buildDir );

  const scriptPath = path.join( buildDir, 'vcbuild.bat' );

  const scriptCommands = [
    '@echo off',
    'set VSCMD_START_DIR=%CD%',
    'call "' + vsPath + '\\VC\\Auxiliary\\Build\\vcvarsall.bat" ' + vsArch,
    'if errorlevel 1 goto :EOF',
    '"' + cmakePath + '" -G "NMake Makefiles" -DCMAKE_BUILD_TYPE=Release ' + srcDir,
    'if errorlevel 1 goto :EOF',
    'nmake'
  ];

  fs.writeFileSync( scriptPath, scriptCommands.join( '\r\n' ) + '\r\n' );

  const result = child_process.spawnSync( 'vcbuild.bat', { cwd: buildDir, stdio: 'inherit' } );

  if ( result.error != null )
    throw result.error;
}

module.exports = {
  findVisualStudio,
  findNasm,
  findPython,
  findUnixTools,
  findCMake,
  runCMake
}
