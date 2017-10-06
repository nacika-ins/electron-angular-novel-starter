const glob = require('glob');
const encrypt = require('file-encryptor');
const mkdirp = require('mkdirp');
const path = require('path');
const key = '2ePSoP0&Dt+&!ZRLq?bLGz}KC3$*ar6n';

glob('../../assets/**/*.*', {}, function (er, files) {
  
  files.forEach((filePath) => {
    
    const distFilePath = filePath.replace("../../assets", "../../src/assets");
    const distDirPath = path.dirname(distFilePath);
    
    mkdirp(distDirPath, function (err) {
        if (err) console.error(err)
        else console.log('pow!')
    });
    
    encrypt.encryptFile(filePath, distFilePath, key, { algorithm: 'aes256' }, function(err){
        if(err){
            console.log("Something went wrong", err);
        }
        else{
            console.log("Successfully encrypted");
        }
    })
  });
  
});
