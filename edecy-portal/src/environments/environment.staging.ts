export const environment = {
    envName: 'staging',
    production: false,
    staging: true,
    matomo: {
      tracking: true,
      sideId: 2
    },
    parse: {
      appID: 'edecy_parse',
      masterKey: 'edecyParse2019',
      serverURL: 'https://parse-staging.edecy.com/parse',
      liveQueryServerURL: 'wss://parse-staging.edecy.com/parse',
      appName: 'edecy-parse'
    },
    features: {
      favorites: false,
      faq: false
    },

    froala: {
      key: 'bMA6aB7E5C3G2C-8ppdanfnG5nhhmvC1rD-11B-9hB3D3C10D7C3B4F5F3D3A2=='
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
