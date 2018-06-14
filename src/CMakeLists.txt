cmake_minimum_required( VERSION 3.0 FATAL_ERROR )

set( DEPS_DIR ${CMAKE_SOURCE_DIR}/../deps )

if( WIN32 )
  if( NOT MSVC )
    message( FATAL_ERROR "Compilation for the win32 platform requires Visual Studio" )
  endif()

  add_executable( launchui WIN32 main.cpp launchui.rc )

  target_compile_definitions( launchui PRIVATE UNICODE BUILDING_NODE_EXTENSION )

  target_include_directories( launchui PRIVATE ${DEPS_DIR}/node/src ${DEPS_DIR}/node/deps/v8/include ${DEPS_DIR}/libui )

  target_link_libraries( launchui PRIVATE ${DEPS_DIR}/node/Release/node.lib ${DEPS_DIR}/libui/build/out/libui.lib shlwapi.lib )
else()
  add_executable( launchui main.cpp )

  set_property( TARGET launchui PROPERTY CXX_STANDARD 11 )

  target_compile_definitions( launchui PRIVATE BUILDING_NODE_EXTENSION )

  target_include_directories( launchui PRIVATE ${DEPS_DIR}/node/src ${DEPS_DIR}/node/deps/v8/include ${DEPS_DIR}/libui )

  if( APPLE )
    set_target_properties( launchui PROPERTIES INSTALL_RPATH "@loader_path" BUILD_WITH_INSTALL_RPATH TRUE )
    target_compile_options( launchui PRIVATE -mmacosx-version-min=10.8 -stdlib=libc++ )
    target_link_libraries( launchui PRIVATE -L. -lnode -lui -mmacosx-version-min=10.8 -stdlib=libc++ )
  else()
    target_link_libraries( launchui PRIVATE -no-pie -Wl,-rpath=$ORIGIN -L. -lnode -lui )
  endif()
endif()
