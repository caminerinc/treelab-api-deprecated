const BoxSDK = require('box-node-sdk');

const CLIENT_ID = 'vro9g0dl3ncewxme2wxfailr2hzj5uke',
  CLIENT_SECRET = 'KVj5Jjwb6wpRk9MXhYPYmamTB3T8SSeQ',
  PUBLIC_KEY_ID = '4iqq9xi4',
  PRIVATE_KEY =
    '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIghAPW+IbZaECAggA\nMBQGCCqGSIb3DQMHBAi9eBbPOk7A3gSCBMjKVKaL1To73v2ELmocHbcFhf5dT4Ko\nzsZO2ffco8OFbmcE+o126v3SDoNtWUTJgGoLW2aeTkOzDe8rYUCF83xTb0eFtVcX\nxh2XJuPDIR+TUjod3q5MjneXDxDYXd5fnDtaCyPiX3p7NuNrYZ5Yd8HBvd7dBaR7\n2+86uf5vbJZ8tThzy0YiYe/qzPLTCWsMGaqOv4DxR8G3BRoryVxmuPAwzwQ9TNWw\n3l4YEaumj1a3QupGhydmLnIby0isNg2GXss/SZb2/Wm1wI6RY2hywSTn7xyj3iml\nuOlj/W3+uvO6p0br0dbTCS5XsoZKIi2C8vRqFl1Wy5vC2n71XGIdBn/u4C3J+53V\nn8vTH8dihF0eg0pnrW09V1dMA7LMAFmewFvIrUp0xrb6gFFR3WF9uDIjjecsQKI2\nAZUDoAo0ZlDcM97w68DrQaZSgoF3njDXKF8064Qo48tkWGEaO+Xk8IAKH/VogerQ\n43LK/vl+Ajd3CckBA2uZ8L3FKzb5ZPSC6SO0bDTPLV6pPKGRtqqc5jenmjO9CteN\n3o5qXvg6fLhAoCelOba+zVNdKHCuhkabIeDBDdOdOPwP+AFM+wVfPUvBle3LslXZ\nIkyBVjaeVONvahHDdgKGUhXkgm2aj1pfDcZE7dkr5HdklZlc0WiJUr45cLmi5cZ3\nx2HHNuuHDBITeKdLFr1kg/h+/nerTfiFrjynAKDdPuglt0xuVAME8RHl79TGSRvB\n3aRffItmtVE4gtRVhMUcFepRO9S8yTNs2q4+eXvJ2bw72Ee5wt2VjnKPouYhdzM+\nQ5vTJp0bjqjF0ZUDei/frtUyutIYnNOT4cgQoxPW6hW8GP8eFUHlA5mualSLOieF\nl6Okhy9WAMJTvWa+kCyTw3PruEbz9b7yDPz3/NUGTA08Tn0wABRVOjGN62tbX4+Q\nfOVHb6JUlGfGIlq9Iw4CGNDl9Itv0OzTNcQKpC0Hek4uT9JxeBjwUbLwN9cg3lrV\nc9zwe4b37g0DSg5Wn+7ZoATRChgijy6Z5wp8oo+fEogb+lkq/5CGlpklceOEe9Cr\nMa3o/zadAFLAFNkSZxNFbDcvREqPh2LWauzINQbpmyu2CfxH9Mw6W6BF4PzLW15U\nT+5b7ts1WOOTbBTprLNlYU3OSQoELi6HvBPBQ4Ba/2asHLLn4sUdPtOCwZpNcdLz\nF1vai5jjjSVFIZ6G4BGRt7dnM+H6poaDslWdOE9D9dcOZX7E6Lnfly7RAhqgwUtq\nQEAobp5HbSIpXNHGzC3viWTBPsYJ9fm/2/pbvDVLMHVFvRj9xxv+aE11ixvBnyr0\nTgNN+BFKTMeeEQIGNZwbIX57pV1NlauXTrN8nw3/5CxMw99xkfxH0xzwF2E9VYg7\nbLICkvgK810HoWKdmQqAIAGksGyCwQVHlsmfjUyMdR6r2kjd446aj525qKs7CdZa\nw+FrSWsYpJzbMRxAVOjT+6TOZDGd+dPX7S2Gximye3+HVIm1pnO7x/GpDKTs3T3e\nym0Kd7c7mf+Yg4KiBQu66C2ZlGvWPytlaRqdyun+farL/u+bnXaoE+DopNv+2gya\n8JLgcoxGAK/vVfQEJkR7IQbIQgnT6qdzW4/CxuW1VBI4mJySpcNS5j0e8Zm050fA\nqsE=\n-----END ENCRYPTED PRIVATE KEY-----\n',
  PRIVATE_KEY_PASSPHRASE = '2e643f91b47fbbe3745cdee5486b4848',
  ENTERPRISE_ID = '166203936';

const sdk = new BoxSDK({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  appAuth: {
    keyID: PUBLIC_KEY_ID,
    privateKey: PRIVATE_KEY,
    passphrase: PRIVATE_KEY_PASSPHRASE,
  },
});

const adminAPIClient = sdk.getAppAuthClient('enterprise', ENTERPRISE_ID);

const signUpBoxUser = name => {
  const requestParams = {
    body: {
      name,
      is_platform_access_only: true,
    },
  };
  adminAPIClient.post(
    '/users',
    requestParams,
    adminAPIClient.defaultResponseHandler((err, data) => {
      if (err) {
        console.log('There was an error! -- ', err);
      }

      console.log('Successful client sign up -- ', data);
    }),
  );
};
