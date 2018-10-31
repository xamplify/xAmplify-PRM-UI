// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  isDebugMode: true,

  /****BEE ClientId/Client Secret********/
  clientId : "18ff022e-fa4e-47e7-b497-39a12ca4600a",
  clientSecret : "FPzc1oxLx3zFjvwrma82TWiP0o3tk1yRVDwyAQqrIZ6jbfdssVo",

  CLIENT_URL: "http://localhost:4200/",
  // CLIENT_URL : 'https://xamplify.io/', // xamplify client app server
  //SERVER_URL: "https://aravindu.com/"
  // SERVER_URL: 'https://xamp.io/'
  SERVER_URL: 'http://localhost:8080/'
};
