#! /usr/bin/env node
// Amazon Cognitoにユーザを追加して、メールアドレスを認証済みにするNode.jsのコード
// aws-sdk v2風記述
// Cognitoの情報は.envに書いてください。
// usage:
// node signup.cjs
const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const cognitoIdp = new AWS.CognitoIdentityServiceProvider({ region: process.env.REGION });

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

cognitoIdp.signUp(signUpParams, (err, signUpData) => {
  if (err) {
    console.error(err, err.stack);
  } else {
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
      // Username: signUpData.UserSub
    };
    cognitoIdp.adminUpdateUserAttributes(updateParams, (updateError, updateData) => {
      if (updateError) {
        console.error(updateError, updateError.stack);
      } else {
        console.log(updateData);
      }
    });
  }
});
