var exec        = require('child_process').exec;
var fs          = require('fs');
var inquirer    = require('inquirer');
var path        = require('path');

var validations = require('./validations');
var utils       = require('./utils');

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
      var apache2_site    = "/etc/apache2/sites-available/";
      var apache2_enable  = "/etc/apache2/sites-enabled/";
      var conf_site       = res.nameDomain + ".conf";
      var to              = apache2_site + conf_site;
      var hosts           = '/etc/hosts';
      var matchDomain     = false;

      var commands        = {};
          commands.removeSite = "rm -f " + to + " && rm -f " + (apache2_enable + conf_site);
          commands.restart    = "service apache2 restart";

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

        exec(commands.removeSite, function(err, out, code) {
          if (err instanceof Error)
            throw err;
          utils.message(commands.removeSite);

          exec(commands.restart, function(err){
            if(err instanceof Error)
                throw err;
            utils.message(commands.restart);
          });

        });
      }else{
        return cb('domain not exist in hosts');
      }

    });

  })(this,cb);
  
}


module.exports = removeVhost;