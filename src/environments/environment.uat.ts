export const environment = {
    production: false,
    baseUrl: 'https://api-uat.empiricalcre.com/api/',    
    MediaS3AccessKeyId:'AKIAIB6ILG56YUPNLL7A',
    MediaS3SecretAccessKey: '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',
    MediaS3Region:'us-east-1',
    MediaS3ACL:'public-read',
    MediaS3Bucket: 'empiricalcres3',
    MediaS3Path: '/EmpiricalCRE/UAT',
    MediaS3Base:'https://media.empiricalcre.com',
  
    // AWS Lambda URL for serving dynamic images
    MediaS3DynamicImageBase: 'https://media.empiricalcre.com',
    MediaS3DynamicImageSize: '/Media/Thumbnail/300x300/',
    MediaS3DynamicMainImageSize: '/Media/',
    
    APIBasicAuthKey: 'admin:admin@123',
    EncryptionKey: 'empiricaluser',
    ULMLinkExpiryDays: 30
  };
  