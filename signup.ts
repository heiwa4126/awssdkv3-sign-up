#! /usr/bin/env node
// Amazon Cognitoにユーザを追加して、メールアドレスを認証済みにするNode.jsのコード
// aws-sdk v3でTypeScript(anyだらけでひどい。書くときに補完は効くけど)
// Cognitoの情報は.envに書いてください。
// usage:
// ts-node signup.mjs <username(=email)> <password>

import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { config } from "dotenv";

config();

const cognitoIdp = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

const username = process.argv[2]; // usernameとemail兼用
const password = process.argv[3];

async function signup(): Promise<any> {
  const param = {
    ClientId: process.env.CLIENT_ID,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: username },
      { Name: "given_name", Value: "g" },
      { Name: "family_name", Value: "f" },
    ],
    Username: username,
  };
  return cognitoIdp.send(new SignUpCommand(param));
}

async function updateAttr(signUpData: any): Promise<any> {
  const param = {
    UserAttributes: [
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  };
  return cognitoIdp.send(new AdminUpdateUserAttributesCommand(param));
}

async function main() {
  try {
    const signupData = await signup();
    console.log(signupData);
    const updateData = await updateAttr(signupData);
    console.log(updateData);
  } catch (e: any) {
    console.error("**ERROR**", e.message);
    process.exit(1);
  }
}

main();
