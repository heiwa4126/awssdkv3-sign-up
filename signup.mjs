#! /usr/bin/env node
// Amazon Cognitoにユーザを追加して、メールアドレスを認証済みにするNode.jsのコード
// aws-sdk v3風でES6
// Cognitoの情報は.envに書いてください。
// usage:
// node signup.mjs <username(=email)> <password>
import { CognitoIdentityProviderClient, SignUpCommand, UpdateCommand } from "@aws-sdk/client-cognito-identity-provider";
import { config } from "dotenv";

config();

const cognitoIdp = new CognitoIdentityProviderClient({ region: process.env.REGION });

const username = process.argv[2]; // usernameとemail兼用
const password = process.argv[3];

const signUpParams = {
  ClientId: process.env.CLIENT_ID,
  Password: password,
  UserAttributes: [
    { Name: "email", Value: username },
    { Name: "given_name", Value: "g" },
    { Name: "family_name", Value: "f" },
  ],
  Username: username,
};

cognitoIdp
  .send(new SignUpCommand(signUpParams))
  .catch((err) => {
    console.error("**ERROR**", err.message);
    process.exit(1);
  })
  .then((signUpData) => {
    console.log(signUpData);

    const updateParams = {
      UserAttributes: [
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
    };
    cognitoIdp
      .send(new UpdateCommand(updateParams))
      .catch((err) => {
        console.error("**ERROR**", err.message);
        process.exit(1);
      })
      .then((updateData) => {
        console.log(updateData);
      });
  });