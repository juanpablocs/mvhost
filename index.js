#!/usr/bin/env node
var program     = require('commander');
var createVhost = require('./bin/create-vhost');
var removeVhost = require('./bin/remove-vhost');

program
  .version('0.0.1')
  .option('-r, --remove', 'remove virtualhost, this not remove proyect (danger: this action is not reverse)')
  .option('-c, --create', 'Add domain in virtualhost')
  .parse(process.argv);

if(program.create){
  new createVhost();
}else if(program.remove){
  new removeVhost(function(err){
    if(err){
      console.log('error:');
      console.log(' ', err);
    }else{
      console.log('task is finish!!!');
    }
  });
}else{
  new createVhost();
}
