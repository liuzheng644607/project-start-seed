#!/usr/bin/env bash
PACKNAME=pack.zip
APP_DIR=/var/apps/com.draw.lyan
ZIP_TMP=/var/apps/tmpzip

# 本地先编译好
npm run build:client

zip -r $PACKNAME ./ -x "./node_modules/*" -x ".DS_Store" -x ".git/*" > /dev/null 2>&1

scp -r -P 29687 $PACKNAME root@draw.lyan.me:$ZIP_TMP

rm -rf $PACKNAME

ssh -tt root@draw.lyan.me -p 29687 << eeooff

PACKNAME=pack.zip
APP_DIR=/var/apps/com.draw.lyan
ZIP_TMP_PKG=/var/apps/tmpzip/$PACKNAME

cd /var/apps/tmpzip

rm -rf ./test

mkdir test

unzip $PACKNAME -d ./test

cd test

npm i

# npm run build:client
npm run build:server


# 删除之前的代码
rm -rf /var/apps/com.draw.lyan/*

# 移动新包到目标目录
cp -rf /var/apps/tmpzip/test/* $APP_DIR

rm -rf /var/apps/tmpzip/pack.zip

cd $APP_DIR

npm run stop:all
npm run start

sleep 3

curl localhost:8080/api/monitor/alive

exit

eeooff

echo '部署完成'
