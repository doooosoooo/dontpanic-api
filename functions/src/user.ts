import * as admin from "firebase-admin";

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

export const loginUser = async (data: any): Promise<User> => {
  const db = admin.firestore();
  const newUser = new User(data.body.nickname, data.body.slime_color, null);

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
    },
    { merge: true }
  );

  return newUser;
};
