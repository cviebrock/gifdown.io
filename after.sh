#!/usr/bin/env bash

echo "== Enabling Xdebug =="
cat > /etc/php/7.0/fpm/conf.d/20-xdebug.ini << EOB
zend_extension=xdebug.so

xdebug.remote_enable = 1
xdebug.remote_connect_back = 1
xdebug.remote_port = 9000
xdebug.scream=0
xdebug.cli_color=1
xdebug.show_local_vars=1
EOB
service php7.0-fpm restart


echo "== Prerequisities for node server =="
apt-get install -y libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

echo "== Proxy pass for node =="
cat /etc/nginx/sites-enabled/gifdown.local | sed -e 's|^}||' | sed -e 's|/index.php?$query_string|=404|' > /tmp/gifdown.local
cat >> /tmp/gifdown.local << 'EOB'
    location ~ "^/i/\d{2}/\d{2}/\d{2}.gif$" {
        root /home/vagrant/gifdown/storage;
        try_files $uri @gifServer;
    }

    location @gifServer {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOB
cat /tmp/gifdown.local > /etc/nginx/sites-enabled/gifdown.local
service nginx restart

echo "== Running node server =="
cd ~/gifdown
node gifServer.js &

