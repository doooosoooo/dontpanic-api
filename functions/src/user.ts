import axios from "axios";
import * as admin from "firebase-admin";
import { getAllProjectsId } from "./project";
import { getRandomArbitrary } from "./util";

class User {
  nickname: string;
  slimeColor: string;
  level: number;
  isOnline: boolean;
  userSkill: string[];
  projects: string[];
  sendbirdAccessToken: string | null;
  positionX: number;
  positionY: number;

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
    this.sendbirdAccessToken = null;
    this.positionX = getRandomArbitrary(300, 900);
    this.positionY = getRandomArbitrary(300, 700);
  }
}

export const loginUser = async (data: any): Promise<User> => {
  let sendbirdResponse = null as any;
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

  // AccessToken
  const newUserRef = db.collection("user").doc(newUser.nickname);
  const newUserData = await newUserRef.get();
  if (!newUserData.exists) {
    sendbirdResponse = await axios({
      method: "POST",
      url: "https://api-7F2B58EC-6AF2-463E-B837-84E0B88B593B.sendbird.com/v3/users/",
      headers: {
        "Api-Token": "8797c4050c9ff96007511d01dbe1cba1447e7f70",
      },
      data: {
        user_id: newUser.nickname,
        nickname: newUser.nickname,
        profile_url: "",
        issue_access_token: "true",
      },
    });
  } else {
    sendbirdResponse = await axios({
      method: "PUT",
      url:
        "https://api-7F2B58EC-6AF2-463E-B837-84E0B88B593B.sendbird.com/v3/users/" +
        newUser.nickname,
      headers: {
        "Api-Token": "8797c4050c9ff96007511d01dbe1cba1447e7f70",
      },
      data: {
        issue_access_token: "true",
      },
    });
  }

  newUser.sendbirdAccessToken = (sendbirdResponse.data as any).access_token;

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
