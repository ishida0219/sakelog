2026/04/13

カレントディレクトリですが、manusで作成したSPAアプリケーションが入っています。これを手元のcentos 7の環境で動作させたいのですが何を用意すればよいでしょうか。

html配下にNode.js用のアプリケーションが入っています。これを動作させるためのコンテナを docker/docker-compose.yml として作成して頂けますでしょうか。ログファイルなど静的に保存する場合は docker/nodejs/logs のディレクトリを作成して保存してください。

コンテナをビルドして起動しました。

そうですね。DB作らないとですね。DBの情報は下記のようになっています。まだデータベースだけでテーブルを作っていません。
HOSTNAME=192.168.100.32
USERNAME=mysql
PASSWORD=mysql
DATABASE=sakelog_db

1を作っていただいても良いでしょうか。

http://192.168.100.26:3000/ にアクセスしました。下記のようなエラーがでています。どうすればよいでしょうか。

TypeError: Invalid URL
    at getLoginUrl (http://192.168.100.26:3000/src/const.ts:7:15)
    at useAuth (http://192.168.100.26:3000/src/_core/hooks/useAuth.ts:6:61)
    at NavBar (http://192.168.100.26:3000/src/components/NavBar.tsx:15:37)
    at Object.react_stack_bottom_frame (http://192.168.100.26:3000/@fs/app/node_modules/.vite/deps/react-dom_client.js?v=de6d3f1f:18509:20)
    at renderWithHooks (http://192.168.100.26:3000/@fs/app/node_modules/.vite/deps/react-dom_client.js?v=de6d3f1f:5654:24)
    at updateFunctionComponent (http://192.168.100.26:3000/@fs/app/node_modules/.vite/deps/react-dom_client.js?v=de6d3f1f:7475:21)
    at beginWork (http://192.168.100.26:3000/@fs/app/node_modules/.vite/deps/react-dom_client.js?v=de6d3f1f:8525:20)
    at runWithFiberInDEV (http://192.168.100.26:3000/@fs/app/node_modules/.vite/deps/react-dom_client.js?v=de6d3f1f:997:72)
    at performUnitOfWork (http://192.168.100.26:3000/@fs/app/node_modules/.vite/deps/react-dom_client.js?v=de6d3f1f:12561:98)
    at workLoopSync (http://192.168.100.26:3000/@fs/app/node_modules/.vite/deps/react-dom_client.js?v=de6d3f1f:12424:43)

これ、SNSアカウント等でログインする場合はこれらの変数設定が必要ということでしょうか。

現在までの作業内容を　codex.md と　readme.md に記載して頂けますでしょうか。

http://192.168.100.26:3000/

