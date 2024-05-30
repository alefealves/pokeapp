// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://pokeapi.co/api/v2/pokemon',
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  firebase : {
    apiKey: "AIzaSyDMdSnB6JC6DWpSSLZ6AX7Ta3JNJa1HKCA",
    authDomain: "auth-pokeapp.firebaseapp.com",
    projectId: "auth-pokeapp",
    storageBucket: "auth-pokeapp.appspot.com",
    messagingSenderId: "23891484374",
    appId: "1:23891484374:web:50ea09a38a01aeb7d53377",
    measurementId: "G-HNL8JZBEGM"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
