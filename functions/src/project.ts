import * as admin from "firebase-admin";

function getRandomArbitrary(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

class Project {
  id: string;
  name: string;
  placeX: number;
  placeY: number;

  constructor(projectName: string) {
    this.id = "";
    this.name = projectName;
    this.placeX = getRandomArbitrary(100, 800);
    this.placeY = getRandomArbitrary(100, 500);
  }
}

export const makeNewProject = async (projectName: string): Promise<Project> => {
  const db = admin.firestore();
  const newProjectRef = db.collection("project").doc();
  const newProject = new Project(projectName);
  newProject.id = newProjectRef.id;

  await newProjectRef.set(JSON.parse(JSON.stringify(newProject)));

  return newProject;
};

export const getProjects = async (userName: string): Promise<any[]> => {
  const db = admin.firestore();
  const userData = (await db.collection("user").doc(userName).get()).data();
  const projectIds = userData?.projects;

  const projectList: any[] = [];

  for await (const id of projectIds) {
    const projectData = (await db.doc(id).get()).data();
    projectList.push(projectData);
  }

  return projectList;
};

export const getAllProjectsId = async (): Promise<any[]> => {
  const db = admin.firestore();
  const projectCollectionSnapt = await db.collection("project").get();
  const projectIdList: string[] = [];

  for await (const projectSnapshot of projectCollectionSnapt.docs) {
    projectIdList.push("project/" + projectSnapshot.id);
  }

  return projectIdList;
};
