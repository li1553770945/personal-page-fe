yarn build
cd dist
msg='deploy'
myUrl=git@124.223.181.152:/srv/personal-page-fe/personal.git


git init
git add -A
git commit -m "${msg}"
git push -f $myUrl master:master # 推送
cd -
rm -rf dist
