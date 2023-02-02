# awssdkv3-sign-up

AWS SDK for JavaScript v3 の練習。

* username(=email)
* password
* given_name
* family_name

が必須のAmazon Cognitoにユーザを設定し、メールアドレスを承認済みにするスクリプト

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
node signup.cjs <username(=email)> <password>
# or
node signup.mjs <username(=email)> <password>
# or
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

TypeScriptがanyだらけで気持ちが悪い。
