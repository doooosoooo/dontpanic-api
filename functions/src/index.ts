import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as user from "./user";

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const loginUser = functions.https.onRequest(
  async (request, response) => {
    const data = await user.loginUser(request);
    response.send(data);
  }
);
