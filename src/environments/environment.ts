// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  isDebugMode: true,
 CLIENT_URL : 'http://localhost:4200/',
 // CLIENT_URL : 'https://xamplify.io/', // xamplify client app server
 // SERVER_URL: 'https://aravindu.com/',  
  // SERVER_URL: 'https://xamp.io/'
SERVER_URL: 'http://localhost:8090/' 
};
