#include <SDKDDKVer.h>
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shlwapi.h>

#include <node.h>

int APIENTRY wWinMain( HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow )
{
    WCHAR exePath[ MAX_PATH + 1 ];
    WCHAR dirPath[ MAX_PATH + 1 ];
    WCHAR scriptPath[ MAX_PATH + 1 ];

    GetModuleFileName( NULL, exePath, MAX_PATH + 1 );

    wcscpy( dirPath, exePath );
    PathRemoveFileSpec( dirPath );

    SetCurrentDirectory( dirPath );

    PathCombine( scriptPath, dirPath, L"app\\main.js" );

    char exePathUtf8[ MAX_PATH + 1 ];
    char scriptPathUtf8[ MAX_PATH + 1 ];

    wcstombs( exePathUtf8, exePath, MAX_PATH + 1 );
    wcstombs( scriptPathUtf8, scriptPath, MAX_PATH + 1 );

    char* node_argv[ 3 ] = { exePathUtf8, scriptPathUtf8, NULL };

    return node::Start( 2, node_argv );
}
