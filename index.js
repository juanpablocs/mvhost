var apacheVhost = require('./apache');

var userRoot = process.getuid && process.getuid() === 0;


if( !userRoot ) {
  console.log("You have no permission to run as non-root user. Use sudo");
  return;
}


var st = new apacheVhost().create('gatos1.com', '~/Projects/aecca');

//
console.log(st);