var fs = require('fs');

module.exports = {

  /**
   * Synchronized write data in file
   * @param  string file
   * @param  mixed data
   * @param  object options Options for stream
   * @return boolean
   */
  writeFile : function(file, data, options) {
     try {
       fs.writeFileSync(file, data, options);
       return true;
     }catch(e) {
       console.log(e);
       if('EACCES' == e.code) {
         console.log('ERROR: Permission denied : '+ file);
       }else{
         console.log('ERROR: Not able to write in : '+ file);
       }
       return false;
     }
  },



  /**
   * Synchronized write data in stream-file
   * @param  string file
   * @param  mixed data
   * @param  object options Options for stream
   * @return boolean
   */
  writeStream : function(file, data, options) {
     try {
       var stream = fs.createWriteStream(file, options /*{'flags': 'a'}*/);
       stream.write(data);
       stream.end();
       return true;
     }catch(e) {
       console.log(e);
       if('EACCES' == e.code) {
         return 'ERROR: Permission denied : '+ file;
       }else{
        return 'ERROR: Not able to write in : '+ file;
       }
     }
  },


  fileExists : function(file){
    try {
      fs.accessSync(file, fs.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }
}