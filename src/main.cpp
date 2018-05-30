#ifdef WIN32
#include <SDKDDKVer.h>
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shlwapi.h>
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

static void register_launchui( v8::Local<v8::Object> exports, v8::Local<v8::Value> module, v8::Local<v8::Context> context, void* priv )
{
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

    return node::Start( node_argc, const_cast<char**>( node_argv ) );
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
    const char* app_path = GetApplicationPath();

    int exit_code = StartNode( app_path );

    delete[] app_path;

    return exit_code;
}

#else

int main( int argc, char** argv )
{
    return StartNode( argv[ 0 ] );
}

#endif
