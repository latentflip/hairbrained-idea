var test = require('tape');
//var fs = require('fs');
var parse = require('../parse');
var stringify = require('../stringify');
//var html = fs.readFileSync(__dirname + '/fixture.html', 'utf8');


test('parse', function (t) {
    var html = '<div class="oh"><p>hello <a href="thing">there</a></p><img/></div>';
    var parsed = parse(html);
    console.log(JSON.stringify(parsed, null, 2));
    console.log(stringify(parsed));
    //console.log(JSON.stringify(parsed, null, 2));
    t.end();
});
