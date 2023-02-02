# awssdkv3-sign-up

[AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)
の練習。

* username(=email)
* password
* given_name
* family_name

が必須の
Amazon Cognitoユーザプールに
ユーザを追加し、
メールアドレスを承認済みにする
スクリプト。


## 前提

* Node.js(v18)で作りました。
* 適切な権限を持ったAWSアカウントが設定されてるものとする。


## 動かし方

プロジェクトルートで
```bash
pnpm i
# or
npm i
```

した後
```bash
cp .env.example .env
vim .env
```
で環境設定して、

```bash
# commonJS version
node signup.cjs <username(=email)> <password>
# or (ES6 version)
node signup.mjs <username(=email)> <password>
# or (TypeScript version)
ts-node signup.ts <username(=email)> <password>
```
で実行。

- メール(=ユーザ名)は実在していなくてもいい(`aaa@example.com`など。`@`は要る)
- passwordはポリシーに従ったもの(「数字を含む」とかのアレ)を渡すこと。


## shell版

説明用に AWS CLI で書くとこんな感じ。

```bash
aws cognito-idp sign-up \
  --client-id <client-id> \
  --username <username> \
  --password <password> \
  --user-attributes '[{"Name": "email", "Value": "<email-address>"}]' \
  --user-pool-id <user-pool-id>
```
(user-attributesはCognitoユーザープールの必須項目にあわせて追加)

これだとメールが「認証済み」にならない(email_verifiedがいっぺんに設定できない)ので、

```bash
aws cognito-idp admin-update-user-attributes \
  --user-pool-id <user-pool-id> \
  --username <username> \
  --user-attributes '[{"Name": "email_verified", "Value": "true"}]'
```

## 感想

やっぱりNodejs入れて プロジェクト落として `npm i` は面倒。
あとでnpxできるようにする(またはGoかRustにする)。

TypeScript版がanyだらけで気持ちが悪い。
まあ作成中に補完が効くのはありがたい。
