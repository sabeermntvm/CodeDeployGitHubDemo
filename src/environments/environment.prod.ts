
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  baseUrl: 'https://api.empiricalcre.com/api/',    

  MediaS3AccessKeyId:'AKIAIB6ILG56YUPNLL7A',
  MediaS3SecretAccessKey: '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',
  MediaS3Region:'us-east-1',
  MediaS3ACL:'public-read',
  MediaS3Bucket: 'empiricalcres3',
  MediaS3Path: '/EmpiricalCRE/PROD',
  MediaS3Base:'https://media.empiricalcre.com',

  // AWS Lambda URL for serving dynamic images
  MediaS3DynamicImageBase: 'https://media.empiricalcre.com',
  MediaS3DynamicImageSize: '/Media/Thumbnail/300x300/',
  MediaS3DynamicMainImageSize: '/Media/',
  
  APIBasicAuthKey: 'admin:admin@123',
  EncryptionKey: 'empiricaluser',
  ULMLinkExpiryDays: 30
};
