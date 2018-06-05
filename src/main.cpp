#ifdef WIN32
#include <SDKDDKVer.h>
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shlwapi.h>
#else
#include <string.h>
#include <unistd.h>
#endif

#include <node.h>
#include <ui.h>

static void ShowErrorMessage( const char* message )
{
    uiWindow* parent = uiNewWindow( "Hidden Window", 100, 100, 0 );

    uiMsgBoxError( parent, "Fatal Error", message );

    uiControlDestroy( uiControl( parent ) );
}

static void UncaughtException( const v8::FunctionCallbackInfo<v8::Value>& args )
{
    v8::Isolate* isolate = args.GetIsolate();

    v8::Local<v8::Object> error = args[ 0 ].As<v8::Object>();

    v8::Local<v8::String> stack_string = v8::String::NewFromUtf8( isolate, "stack" );
    v8::Local<v8::Value> trace_value = error->Get( stack_string );

    v8::Local<v8::String> string = trace_value->ToString( isolate );

    int length = string->Length();
    char* buffer = new char[ length + 1 ];
    string->WriteUtf8( buffer );

    ShowErrorMessage( buffer );

    delete[] buffer;

    exit( 1 );
}

#if WIN32

static HINSTANCE app_instance;

static void UpdateWindowIcon()
{
    WNDCLASSEX wcex;
    ZeroMemory( &wcex, sizeof( wcex ) );
    wcex.cbSize = sizeof( wcex );

    HINSTANCE dll_instance = LoadLibrary( L"libui.dll" );

    GetClassInfoEx( dll_instance, L"libui_uiWindowClass", &wcex );

    int small_cx = GetSystemMetrics( SM_CXSMICON );
    int small_cy = GetSystemMetrics( SM_CYSMICON );

    wcex.hIcon = LoadIcon( app_instance, MAKEINTRESOURCE( 1 ) );
    wcex.hIconSm = (HICON)LoadImage( app_instance, MAKEINTRESOURCE( 1 ), IMAGE_ICON, small_cx, small_cy, LR_DEFAULTCOLOR );

    UnregisterClass( wcex.lpszClassName, dll_instance );
    RegisterClassEx( &wcex );
}

#endif

static void register_launchui( v8::Local<v8::Object> exports, v8::Local<v8::Value> module, v8::Local<v8::Context> context, void* priv )
{
#if WIN32
    UpdateWindowIcon();
#endif

    v8::Isolate* isolate = context->GetIsolate();

    v8::Local<v8::FunctionTemplate> function_template = v8::FunctionTemplate::New( isolate, UncaughtException );
    v8::Local<v8::Function> function = function_template->GetFunction();

    v8::Local<v8::String> name = v8::String::NewFromUtf8( isolate, "uncaughtException" );

    exports->Set( name, function );
}

static node::node_module launchui_module =
{
    NODE_MODULE_VERSION,
    1, /* NM_F_BUILTIN */
    NULL,
    __FILE__,
    NULL,
    register_launchui,
    NODE_STRINGIFY( launchui ),
    NULL,
    NULL
};

static int StartNode( const char* app_path )
{
    node::node_module_register( &launchui_module );

    int node_argc = 3;
    const char* node_argv[ 4 ] =
    {
        app_path, "-e",
        "require('libui-node');"
        "process.on('uncaughtException', process.binding('launchui').uncaughtException);"
        "require('./app/main.js');",
        NULL
    };

    int length = 0;
    for ( int i = 0; i < node_argc; i++ )
        length += strlen( node_argv[ i ] ) + 1;

    char* buffer = new char[ length ];

    int pos = 0;
    for ( int i = 0; i < node_argc; i++ ) {
        node_argv[ i ] = strcpy( buffer + pos, node_argv[ i ] );
        pos += strlen( node_argv[ i ] ) + 1;
    }

    int exit_code = node::Start( node_argc, const_cast<char**>( node_argv ) );

    delete[] buffer;

    return exit_code;
}

#ifdef WIN32

static const char* ToUTF8( const WCHAR* utf16 )
{
    int size = WideCharToMultiByte( CP_UTF8, 0, utf16, -1, NULL, 0, NULL, NULL );
    char* result = new char[ size ];
    WideCharToMultiByte( CP_UTF8, 0, utf16, -1, result, size, NULL, NULL );
    return result;
}

static const char* GetApplicationPath()
{
    WCHAR app_path[ MAX_PATH + 1 ];
    GetModuleFileName( NULL, app_path, MAX_PATH + 1 );

    WCHAR app_dir_path[ MAX_PATH + 1 ];
    wcscpy_s( app_dir_path, app_path );
    PathRemoveFileSpec( app_dir_path );

    SetCurrentDirectory( app_dir_path );

    return ToUTF8( app_path );
}

int APIENTRY wWinMain( HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow )
{
    app_instance = hInstance;

    const char* app_path = GetApplicationPath();

    int exit_code = StartNode( app_path );

    delete[] app_path;

    return exit_code;
}

#else

int main( int argc, char** argv )
{
    char* separator = strrchr( argv[ 0 ], '/' );

    if ( separator != NULL ) {
        int length = separator - argv[ 0 ];
        char* app_dir_path = new char[ length + 1 ];
        strncpy( app_dir_path, argv[ 0 ], length );
        chdir( app_dir_path );
        delete[] app_dir_path;
    }

    return StartNode( argv[ 0 ] );
}

#endif
