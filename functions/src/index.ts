import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as user from "./user";
import * as project from "./project";

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const loginUser = functions.https.onRequest(
  async (request, response) => {
    const data = await user.loginUser(request);
    response.send(data);
  }
);

export const makeNewProject = functions.https.onRequest(
  async (request, response) => {
    const result = await project.makeNewProject(
      request.body.userName,
      request.body.projectName
    );
    response.send(result);
  }
);

export const getProjectList = functions.https.onRequest(
  async (request, response) => {
    const queryName = request.query.name;
    if (queryName !== undefined) {
      const list = await project.getProjects(queryName as string);
      response.send(list);
    } else {
      response.statusCode = 400;
      response.send({
        error: "query error",
      });
    }
  }
);
