#! /usr/bin/env node
// Amazon Cognitoにユーザを追加して、メールアドレスを認証済みにするNode.jsのコード
// aws-sdk v3風でES6
// Cognitoの情報は.envに書いてください。
// usage:
// node signup.mjs <username(=email)> <password>

import { AdminConfirmSignUpCommand, AdminUpdateUserAttributesCommand, CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

import { config } from "dotenv";

config();

const cognitoIdp = new CognitoIdentityProviderClient({ region: process.env.REGION });

const username = process.argv[2]; // usernameとemail兼用
const password = process.argv[3];

async function main() {
  try {
    const signupData = await cognitoIdp.send(new SignUpCommand({
      ClientId: process.env.CLIENT_ID,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: username },
        { Name: "given_name", Value: "g" },
        { Name: "family_name", Value: "f" },
      ],
      Username: username,
    }));
    console.log(signupData);

    const updateData = await cognitoIdp.send(new AdminUpdateUserAttributesCommand({
      UserAttributes: [
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
    }));
    console.log(updateData);

    const confirmData = await cognitoIdp.send(new AdminConfirmSignUpCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: username
    }));
    console.log(confirmData);

  } catch (e) {
    console.error("**ERROR**", e.message);
    process.exit(1);
  }
}

main();
