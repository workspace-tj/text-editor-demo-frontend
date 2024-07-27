#!/bin/bash

# JSONファイルのパス
file_list=("./src/i18n/ja/translation.json" "./src/i18n/en/translation.json")
is_file=()

for json_file in "${file_list[@]}"; do
    if [ -f "$json_file" ]; then
        is_file+=(true)
    else
        echo "ファイル '$json_file' は見つかりませんでした。"
        is_file+=(false)
    fi
done

# 見つかったファイルの数をカウント
found_files=$(grep -o true <<< "${is_file[*]}" | wc -l)

# 見つかったファイルの数に応じて処理を行う
if [ "$found_files" -eq "${#file_list[@]}" ]; then
    echo "全てのファイルが見つかりました。"
    # ファイルが全て見つかった場合
    # ユーザーに値の入力を求める
    read -p "値を入力してください: " input_value

    for json_file in "${file_list[@]}"; do

      # 特殊文字をエスケープする
      input_value_escaped=$(printf '%s\n' "$input_value" | sed 's,[\/&],\\&,g;s/$/\\/')
      # クォートされた文字列を生成する
      input_value_quoted="\"$input_value_escaped\": \"$input_value_escaped\""

      # ファイルが存在する場合にのみ書き込み処理を実行する
      if [ -f "$json_file" ]; then
          # JSONファイルに新しいエントリを追加する
          if ! grep -q "\"$input_value_escaped\":" "$json_file"; then
              if grep -q "\"sentence\":" "$json_file"; then
                  sed -i "/\"sentence\": {/a\\
    $input_value_quoted," "$json_file"
              else
                  echo "\"sentence\": {" >> "$json_file"
                  echo "    $input_value_quoted" >> "$json_file"
                  echo "}" >> "$json_file"
              fi
              echo "値がファイルに書き込まれました。"
          else
              echo "エラー：指定された値はすでにJSONファイルに存在します。"
          fi
      fi

    done
else
    echo "一部のファイルが見つかりませんでした。"
fi
