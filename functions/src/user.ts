import * as admin from "firebase-admin";

class User {
  nickname: string;
  slimeColor: string;
  level: number;
  isOnline: boolean;

  constructor(nickname: string, slimeColor: string, level: number | null) {
    this.nickname = nickname;
    this.slimeColor = slimeColor;
    this.level = level === null ? 1 : level;
    this.isOnline = true;
  }
}

export const loginUser = async (data: any): Promise<User> => {
  const db = admin.firestore();
  const newUser = new User(data.body.nickname, data.body.slimeColor, null);

  const userData = await db.collection("user").doc(newUser.nickname).get();
  if (!userData.exists) {
    newUser.level = 1;
  } else {
    newUser.level = userData.data()?.level;
  }

  await db.collection("user").doc(data.body.nickname).set(
    {
      nickname: newUser.nickname,
      slimeColor: newUser.slimeColor,
      level: newUser.level,
      projects: [],
      isOnline: true,
    },
    { merge: true }
  );

  return newUser;
};

export const userData = async (
  userName: string
): Promise<FirebaseFirestore.DocumentData | undefined> => {
  const db = admin.firestore();
  const userData = (await db.collection("user").doc(userName).get()).data();
  return userData;
};
