cmake_minimum_required( VERSION 3.0 FATAL_ERROR )

add_executable( launchui WIN32 main.cpp )

set( DEPS_DIR ${CMAKE_SOURCE_DIR}/../deps )

target_include_directories( launchui PRIVATE ${DEPS_DIR}/node/src ${DEPS_DIR}/node/deps/v8/include ${DEPS_DIR}/libui )

if( WIN32 )
  if( NOT MSVC )
    message( FATAL_ERROR "Compilation for the win32 platform requires Visual Studio" )
  endif()

  target_compile_definitions( launchui PRIVATE UNICODE _CRT_SECURE_NO_WARNINGS BUILDING_NODE_EXTENSION )

  target_link_libraries( launchui PRIVATE ${DEPS_DIR}/node/Release/node.lib ${DEPS_DIR}/libui/build/out/libui.lib shlwapi.lib )
else()
  message( FATAL_ERROR "Currently only the win32 platform is supported by launchui" )
endif()
