var exec        = require('exec');
var fs          = require('fs');
var inquirer    = require('inquirer');
var path        = require('path');

var validations = require('./validations');


function removeVhost(cb){
  this.questions = [{
    type: "input",
    name: "nameDomain",
    message: "Remove domain",
    validate: validations.domain
    }
  ];

  (function(self, cb){

    inquirer.prompt(self.questions, function(res){
      var apache2_site = "/etc/apache2/sites-available/";
      var conf_site = res.nameDomain + ".conf";
      var to = apache2_site + conf_site;
      var hosts = '/etc/hosts';
      var matchDomain = false;

      try{
        var domains = fs.readFileSync(hosts).toString().split('\n');
      }catch(err){
        return cb(err);
      }

      domains.forEach(function(domain,i){
        var re = new RegExp(res.nameDomain,"i");
        if(re.test(domain)){
          delete domains[i];
          matchDomain = true;
        }
      });

      if(matchDomain){
        try{
          fs.writeFileSync(hosts, domains.join('\n').toString());
        } catch(err){
          return cb(err);
        }

        var exec_removeSiteConf = "rm -f " + to;
        exec(exec_removeSiteConf, function(err, out, code) {
          if (err instanceof Error)
            throw err;
          console.log('-----------------------');
          console.log('RUN: ' + exec_removeSiteConf);
          console.log(' ');

          var exec_restart = 'service apache2 restart';
          exec(exec_restart, function(err){
            if(err instanceof Error)
                throw err;
            console.log('-----------------------');
            console.log('RUN: ' + exec_restart);
            console.log(' ');
          });

        });
      }else{
        return cb('domain not exist in hosts');
      }

      return cb(false);

    });

  })(this,cb);
  
}


module.exports = removeVhost;