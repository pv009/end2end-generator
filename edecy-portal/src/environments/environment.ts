// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  staging: false,
  matomo: {
    tracking: true,
    sideId: 3
  },
  parse: {
    appID: 'edecy_parse',
    masterKey: 'edecyParse2019',
    serverURL: 'https://parse-staging.edecy.com/parse',
    liveQueryServerURL: 'wss://parse-staging.edecy.com/parse',
    appName: 'edecy-parse'
  },
  features: {
    favorites: true,
    faq: false
  },

  froala: {
    key: '' // not needed for localhost
  },

  webPush: {
    publicKey: 'BIdVdjkAlJRRrmI-SB2oRK06EPzGGjHuukhw2HuH8lThG3s2RrEAz0VQqXtOMpUvKpN3U1zccfzA9y24iRZsmK8',
    privateKey: '7y4ukNpcqhoaberfJwfln7gvx0nqUvOj495s2Cdd91A'
  },

  sentry:  {
    dsn: 'https://c7026325e77b4a2394e3351d9e650169@sentry.io/4034315'
  },

  version: '190',

  elasticSearch: {
    baseURL: 'https://api.edecy.de/search/'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
