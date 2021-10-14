import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as user from "./user";
import * as project from "./project";
const cors = require("cors")({ origin: true });

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const loginUser = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const data = await user.loginUser(request);
    response.send(data);
  });
});

export const getUser = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
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
});

export const makeNewProject = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const result = await project.makeNewProject(request.body.projectName);
    response.send(result);
  });
});

export const getProjectList = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
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
  });
});
