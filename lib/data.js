// Library for storing and editing data

// Dependencies

const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

// Container for the module to be exported

let lib = {};

// Based directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// Write data to a file

lib.create = (dir, file, data, callback) => {
  // Open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to string
        let stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing new file");
              }
            });
          } else {
            callback("Error while writing to new file");
          }
        });
      } else {
        console.log(err)
        callback("Error could not create file, may already exist");
      }
    }
  );
};

// Read data from file

lib.read = (dir, file, callback) => {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf-8",
    (err, data) => {
      if (!err && data) {
        let parsedData = helpers.parseJsonToObject(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

lib.update = (dir, file, data, callback) => {

    // Open the file for writing

    fs.open(lib.baseDir+dir+'/'+file+'.json','r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {

            // Convert data to string
            let stringData = JSON.stringify(data)

            fs.ftruncate(fileDescriptor, (err) => {
                if (!err){
                    // Write to the file and close it

                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if(!err){

                            fs.close(fileDescriptor, (err)=> {
                                if(!err) {
                                    callback(false, JSON.parse(stringData))
                                } else {
                                    callback('Error closing the file')
                                }
                            })

                        } else {
                            callback('Error writing to existing file')
                        }
                    })
                } else {
                    callback('Error truncating file')
                }
            })

        } else {
            callback('Could not open the file for updating, may not exist yet')
        }
    })
}

// Delete a file 

lib.delete = (dir, file, callback) => {

    // Unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err) => {
        if(!err){
             callback(false)
        } else {
            callback('Error deleting file')
        }
    })
}


// List all the items in a directory

lib.list = async(dir, callback) => {
    let trimmedFileNames = []
    try {
        const files = await fs.promises.readdir(lib.baseDir+dir+"/")
        for(const file of files) {
            const fileContent = await fs.promises.readFile(
                lib.baseDir + dir + "/" + file,
                {encoding: "utf-8"}
              );
            const toObject = await helpers.parseJsonToObject(fileContent)
            trimmedFileNames.push(toObject)
        }

        callback(false, trimmedFileNames)
    } catch (e) {
        callback(e, [])
    }
    // fs.readdir(lib.baseDir+dir+"/", (err, data)=>{
    //     if(!err && data && data.length > 0){
    //         console.log
    //         data.forEach(async (file)=>{
    //             // trimmedFileNames.push(file.replace('.json',''))
    //             const fileContent = await fs.promises.readFile(
    //                 lib.baseDir + dir + "/" + file,
    //                 {encoding: "utf-8"}
    //               );
    //             console.log(fileContent)
    //         })
            
    //         callback(false, trimmedFileNames)
    //     } else {
    //         callback(err, data)
    //     }
    // })
}








// Export the module

module.exports = lib;