var exec        = require('exec');
var fs          = require('fs');
var inquirer    = require('inquirer');
var path        = require('path');

var validations = require('./validations');


function createVhost(cb){
  this.vhostFile = './.vhost';

  this.questions = [{
    type: "input",
    name: "nameDomain",
    message: "Add domain",
    validate: validations.domain
    },{
    type: "input",
    name:"namePath",
    message:"Absolute path of project",
    default: path.resolve("."),
    validate: validations.path
    }
  ];

  (function(self){
    inquirer.prompt(self.questions, function(res){
      try {
        var str = fs.readFileSync(self.vhostFile)
                    .toString()
                    .replace(/\{\{domain\}\}/g, res.nameDomain)
                    .replace(/\{\{path\}\}/g, res.namePath);

        console.log(str);
        var apache2_site = "/etc/apache2/sites-available/";
        var conf_site = res.nameDomain + ".conf";
        var to = apache2_site + conf_site;

        try{
          fs.writeFileSync(to, str);
          var exec_a2ensite = "cd /etc/apache2/sites-enabled && ln -s " + to;
          exec(exec_a2ensite, function(err, out, code) {
          if (err instanceof Error)
            throw err;
          console.log('-----------------------');
          console.log('RUN: ' + exec_a2ensite);
          // console.log('out' + out);
          console.log(' ');

          var exec_host = 'echo "127.0.0.1  '+res.nameDomain+'" >> /etc/hosts';
          exec(exec_host, function(err, out){
            if(err instanceof Error)
                throw err;
            console.log('-----------------------');
            console.log('RUN: ' + exec_host);
            // console.log('out' + out);
            console.log(' ');
          });

          var exec_restart = 'service apache2 restart';
          exec(exec_restart, function(err){
            if(err instanceof Error)
                throw err;
            console.log('-----------------------');
            console.log('RUN: ' + exec_restart);
            // console.log('out' + out);
            console.log(' ');
          });

        });

        } catch(err){
        console.log('createfile error: ');
        console.log(err);
        }

      } catch (err) {
        console.log('readfile error: ');
        console.error(err);
      }
    });

  })(this);
  
}


module.exports = createVhost;