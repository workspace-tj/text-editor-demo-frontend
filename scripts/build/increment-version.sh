# 旧バージョン(X.Y.Z)
OLD_VERSION=$(node -p -e "require('./package.json').version")
# バージョンを配列で分割
ARRAY=( ${OLD_VERSION//./ } )
# Yをインクリメント
((ARRAY[1]++))
# X.Y.Zで代入
NEW_VERSION=${ARRAY[0]}.${ARRAY[1]}.${ARRAY[2]}
# NEW_VERSIONに書き換え
sed -i -e "s/\"version\":.*\"/\"version\": \"${NEW_VERSION}\"/" package.json
# バックアップファイル削除
rm -f package.json-e

