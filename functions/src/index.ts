import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

class User {
  nickname: string;
  slimeColor: string;
  level: number;

  constructor(nickname: string, slimeColor: string, level: number | null) {
    this.nickname = nickname;
    this.slimeColor = slimeColor;
    this.level = level === null ? 1 : level;
  }
}

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const loginUser = functions.https.onRequest(
  async (request, response) => {
    const newUser = new User(
      request.body.nickname,
      request.body.slime_color,
      null
    );

    const userData = await db.collection("user").doc(newUser.nickname).get();
    if (!userData.exists) {
      newUser.level = 1;
    } else {
      newUser.level = userData.data()?.level;
    }

    db.collection("user")
      .doc(request.body.nickname)
      .set(newUser, { merge: true });

    response.send(request.body);
  }
);
