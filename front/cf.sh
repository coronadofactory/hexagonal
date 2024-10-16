#!/bin/sh

# Installer
# 
# Copyright (c) 1984-2024 Jose Garcia
# Released under the MIT license
# https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
#
# Date: 2024-10-03
#

git="https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/front"
src="src"
infrastructure="src/infrastructure"
public="public"

module=$1

if [ ! -d "node_modules" ]; then
      echo "https://create-react-app.dev"

      echo "In main dir"
      echo "npx create-react-app my-app"

      exit
fi

if [ ! -d "$infrastructure" ]; then
  mkdir $infrastructure
fi

re="(appia|backend|form|react)"
if [[ $module =~ $re ]]; then

      curl $git/$module.js -o $infrastructure/$module.js

fi

re="(react)"
if [[ $module =~ $re ]]; then
      if [ ! -f "$infrastructure/appia.js" ]; then
            curl $git/appia.js -o $infrastructure/appia.js
      fi
      if [ ! -f "$infrastructure/backend.js" ]; then
            curl $git/backend.js -o $infrastructure/backend.js
      fi

      rm -f $src/*.css
      rm -f $src/*.js
      rm -f $src/*.svg
      rm -f $public/*.ico
      rm -f $public/*.png
      rm -f $public/*.json
      rm -f $public/*.txt

      curl $git/index.html -o $public/index.html
      curl $git/index-react-backend.js -o $src/index.js

      echo "REACT_APP_WIRE=/api" > .env
      echo "REACT_APP_LANGUAGE=es" >> .env

fi

re="(appia|backend|form|react|proxy)"
if [[ $module =~ $re ]]; then
      # https://create-react-app.dev/docs/proxying-api-requests-in-development/

      npm install http-proxy-middleware --save
      curl $git/setupProxy.js -o $src/setupProxy.js

fi
