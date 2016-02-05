#!/usr/bin/env bash

cat > /etc/php/7.0/fpm/conf.d/20-xdebug.ini << EOF
zend_extension=xdebug.so

xdebug.remote_enable = 1
xdebug.remote_connect_back = 1
xdebug.remote_port = 9000
xdebug.scream=0
xdebug.cli_color=1
xdebug.show_local_vars=1
EOF
service php7.0-fpm restart
