export const environment = {
  production: true,
  staging: false,
  matomo: {
    tracking: true,
    sideId: 1
  },
  parse: {
    appID: 'edecy_prod',
    masterKey: 'cHg8C1)M?43X^ZI',
    serverURL: 'https://parse.edecy.de/parse',
    liveQueryServerURL: 'wss://parse.edecy.de/parse',
    appName: 'Edecy Prod'
  },
  features: {
    favorites: false,
    faq: false
  },
  froala: {
    key: 'nQE2uG3H2F1I2rD-16E-13cfrxD1ssB-16zcA2xxbA2B6C4A3F4B2D2C3H2C1=='
  },
  webPush: {
    publicKey: 'BGAys7jDiMV9vWWqsuWn8z7vwC2reJCiVuDI-nn0C5dd9LPworahP5iLo8qZ3FI1HOGzizzp5NEwv2DtEAI6sIQ',
    privateKey: 'Q5Hb64-rwsnSkzaZzP31kF9L5W0CK_I0LPLtN3zJs24'
  },

  sentry:  {
    dsn: 'https://c7026325e77b4a2394e3351d9e650169@sentry.io/4034315'
  },
  version: '2.1.0',
  elasticSearch: {
    baseURL: 'https://api.edecy.de/search/'
  }
};
