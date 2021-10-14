import * as admin from "firebase-admin";
import { getAllProjectsId } from "./project";

class User {
  nickname: string;
  slimeColor: string;
  level: number;
  isOnline: boolean;
  userSkill: string[];
  projects: string[];

  constructor(
    nickname: string,
    slimeColor: string,
    level: number | null,
    userSkill: string[]
  ) {
    this.nickname = nickname;
    this.slimeColor = slimeColor;
    this.level = level === null ? 1 : level;
    this.isOnline = true;
    this.userSkill = userSkill;
    this.projects = [];
  }
}

export const loginUser = async (data: any): Promise<User> => {
  const db = admin.firestore();
  const newUser = new User(
    data.body.nickname,
    data.body.slimeColor,
    null,
    data.body.userSkill
  );

  // Set User Level
  const userData = await db.collection("user").doc(newUser.nickname).get();
  if (!userData.exists) {
    newUser.level = 1;
  } else {
    newUser.level = userData.data()?.level;
  }

  // Set User's project
  newUser.projects = await getAllProjectsId();

  await db
    .collection("user")
    .doc(data.body.nickname)
    .set(JSON.parse(JSON.stringify(newUser)), { merge: true });

  return newUser;
};

export const userData = async (
  userName: string
): Promise<FirebaseFirestore.DocumentData | undefined> => {
  const db = admin.firestore();
  const userData = (await db.collection("user").doc(userName).get()).data();
  return userData;
};
