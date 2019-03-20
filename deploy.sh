#!/usr/bin/env bash
PACKNAME=pack.zip
APP_DIR=/var/apps/com.draw.lyan
ZIP_TMP=/var/apps/tmpzip

zip -r $PACKNAME ./ -x "./node_modules/*" -x "./static/*" -x ".DS_Store" -x ".git/*" > /dev/null 2>&1

scp -r -P 29687 $PACKNAME root@draw.lyan.me:$ZIP_TMP

rm -rf $PACKNAME

ssh -tt root@draw.lyan.me -p 29687 << ssh

PACKNAME=pack.zip
APP_DIR=/var/apps/com.draw.lyan
ZIP_TMP_PKG=/var/apps/tmpzip/$PACKNAME

# 删除之前的代码
rm -rf /var/apps/com.draw.lyan/**

# 移动新包到目标目录
cp /var/apps/tmpzip/pack.zip $APP_DIR

rm -rf /var/apps/tmpzip/pack.zip

cd $APP_DIR
# 解压
unzip $PACKNAME > /dev/null 2>&1

npm i

npm run build:client
npm run build:server

npm run stop:all
npm run start

curl localhost:8080/api/monitor/alive

exit
