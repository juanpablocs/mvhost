#!/usr/bin/env node
var apacheVhost = require('./apache');
var path        = require('path');
var program     = require('commander');
var inquirer    = require('inquirer');

var userRoot = process.getuid && process.getuid() === 0;


if( !userRoot ) {
  console.log("You have no permission to run as non-root user. Use sudo");
  return;
}

program
  .version('0.0.1')

  .command('create <domain>')
  .description('create domain.com for create virtualhost')
  .action(function(domain){
    new apacheVhost().create(domain, program.path);
  });

program
  .option('-r, --remove', 'remove virtualhost, this not remove proyect (danger: this action is not reverse)')
  .option('-c, --create', 'Add domain in virtualhost')
  .option('-p, --path', 'path folder')

  .parse(process.argv);

// if(program.create){
//   new createVhost(myCallback);
// }else if(program.remove){
//   new removeVhost(myCallback);
// }else{
//   new createVhost(myCallback);
// }


