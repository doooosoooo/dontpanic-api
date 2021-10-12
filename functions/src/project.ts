import * as admin from "firebase-admin";

class Project {
  id: string;
  name: string;
  code: ProjectCode;

  constructor(id: string, name: string) {
    this.id = "";
    this.name = name;
    this.code = new ProjectCode("");
  }
}

class ProjectCode {
  projectId: string;
  html: string;
  css: string;
  javascript: string;

  constructor(id: string) {
    this.projectId = id;
    this.html = "";
    this.css = "";
    this.javascript = "";
  }
}

export const makeNewProject = async (userName: string, name: string) => {
  const db = admin.firestore();

  const newProjectRef = db.collection("project").doc();
  const newProject = new Project(newProjectRef.id, name);

  db.collection("user")
    .doc(userName)
    .update({
      projects: admin.firestore.FieldValue.arrayUnion(newProjectRef.path),
    });

  await newProjectRef.set({
    name: newProject.name,
    user: [db.collection("user").doc(userName).path],
    code: {
      html: newProject.code.html,
      css: newProject.code.css,
      javascript: newProject.code.javascript,
    },
  });

  return {
    projectId: newProjectRef.id,
  };
};

export const getProjects = async (userName: string): Promise<any[]> => {
  const db = admin.firestore();
  const userData = (await db.collection("user").doc(userName).get()).data();
  const projectIds = userData?.projects;
  const projectList: any[] = [];
  for await (const id of projectIds) {
    const projectData = await db.doc(id).get();
    projectList.push(projectData.data());
  }
  return projectList;
};
