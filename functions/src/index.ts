import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as user from "./user";
import * as project from "./project";

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const loginUser = functions.https.onRequest(
  async (request, response) => {
    console.log(request.body);
    const data = await user.loginUser(request);
    response.set("Access-Control-Allow-Origin", "*");
    response.send(data);
  }
);

export const getUser = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  const queryName = request.query.name;
  if (queryName !== undefined) {
    const userData = await user.userData(queryName as string);
    response.send(userData);
  } else {
    response.statusCode = 400;
    response.send({
      error: "query error",
    });
  }
});

export const makeNewProject = functions.https.onRequest(
  async (request, response) => {
    const result = await project.makeNewProject(
      request.body.userName,
      request.body.projectName
    );
    response.set("Access-Control-Allow-Origin", "*");
    response.send(result);
  }
);

export const getProjectList = functions.https.onRequest(
  async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
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
