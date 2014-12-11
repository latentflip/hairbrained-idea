var test = require('tape');
var parse = require('../parse');
var stringify = require('../stringify');
var diffObjects = require('deep-diff');
var patcher = require('../patch');
//var html = "<div class=\"landing\"><div class=\"container\"><section id=\"pages\"><section role=\"main\" class=\"page create\"><div class=\"room cf\"><a href=\"/\" title=\"Welcome to Talky!\" class=\"talky-logo\"></a><form id=\"createRoom\" class=\"cf\"><p>Truly simple video chat and screen sharing for small groups.</p><input id=\"sessionInput\" placeholder=\"Name the conversation\" autofocus=\"autofocus\" type=\"text\"/><button type=\"submit\" class=\"primary large\">Let’s go!</button></form></div><div class=\"features cf\"><h2>Anonymous. Peer‑to‑peer. No plugins, signup, or payment required.</h2><div class=\"feature\"><h3>Group video chat</h3><p>Add up to 5 people to the conversation </p></div><div class=\"feature\"><h3>Screen sharing</h3><p>Easily add anyone's screen to the conversation</p></div><div class=\"feature\"><h3>Locked rooms</h3><p>Add a shared key to a room for added privacy</p></div><div class=\"feature\"><h3>Mobile, too!</h3><p> \nTalky iOS is available</p><a href=\"https://itunes.apple.com/app/talky-free-video-conferencing/id882057960\" title=\"Talky iOS\">on the App Store</a></div></div><div class=\"quote cf\"><blockquote>“Talky is awesome.”</blockquote><p> <a href=\"https://twitter.com/waxpancake\" title=\"Andy Baio on Twitter\">Andy Baio </a></p><p>From the Internet</p></div><div class=\"awesome\"><div class=\"cf\"><h2>Help make the Internet more awesome</h2><p>WebRTC is transforming collaboration, but it's still early days.</p><p>By submitting anonymous feedback on a Talky call, you're helping provide data for browser vendors to improve the platform for the web.</p><p> \nRead more about this effort at <a href=\"http://iswebrtcreadyyet.com\">isWebRTCreadyyet.com</a></p></div></div><div class=\"aboutUs cf\"><div class=\"yetis\"><h2>About us</h2><p>Talky is made by <a href=\"http://andyet.com/talky\" title=\"&amp;yet Site\">&amp;yet</a>, a small, independent software and design team based in Richland, WA.</p><p>We don't sell ads based on your conversations, resell your information, or keep track of what you do online.</p></div><div class=\"webrtc\"><h2>Built with open source</h2><p>Talky is based entirely on open-source technologies like <a href=\"https://simplewebrtc.com/\" title=\"SimpleWebRTC\">SimpleWebRTC</a> and our Otalk platform.</p><p>If you'd like to build your own collaboration apps for web and mobile, <a href=\"https://andyet.com/talky\">we'd love to talk.</a></p></div></div><footer role=\"contentinfo\"><nav><ul><li> <a href=\"help/\" title=\"Helpful information\">Help</a></li><li><a href=\"mailto:support@talky.io\" title=\"Contact Support\">Contact Support</a></li><li><a href=\"help/security\" title=\"Privacy Policy\">Privacy Policy</a></li><li><a href=\"https://apps.andyet.com/legal\" title=\"Legal, Contact links\">Legal</a></li><li><a href=\"https://twitter.com/usetalky\" title=\"Talky on Twitter\">@UseTalky</a></li></ul></nav><a href=\"http://andyet.com/talky\" title=\"Made with love by &amp;yet\" class=\"andyet-logo\"></a></footer></section></section></div></div>";
//var html = "<div></div>";
var html = '<div><p>It is a title</p><p><span>omg! it\'s</span><span>47</span></p></div>'
//var html = "<form id=\"createRoom\" class=\"cf\"><p>Truly simple video chat and screen sharing for small groups.</p><input id=\"sessionInput\" placeholder=\"Name the conversation\" autofocus=\"autofocus\" type=\"text\"/><button type=\"submit\" class=\"primary large\">Let’s go!</button></form>"
//var html = '<p>Talky is made by <a href="http://andyet.com/talky" title="&amp;yet Site">&amp;yet</a>, a small, independent software and design team based in Richland, WA.</p>'
//var html = '<p>Talky is made by <a href="http://andyet.com/talky" title="&amp;yet Site">&amp;yet</a>, a small, <i>independent</i> software and design team based in Richland, WA.</p>'

test('parse', function (t) {
    //var html = '<div class="oh"><p>hello <a href="thing">there</a></p><img/></div>';
    var parsed = parse(html);
    
    console.log(JSON.stringify(parsed, null, 2));

    t.equal(stringify(parse(html)), html);
    t.end();
});

/*
test('diff', function (t) {
    var parsed = parse(html);
    
    var modified = html.replace("cf", "other");

    console.log(modified === html);

    //var diff = diffObjects(parsed, parse(modified));

    console.log(html);
    console.log(modified);


    console.log('diff');
    console.log(diff);

    //patcher(diff[0])

//    console.log(JSON.stringify(diff, null, 2));


    t.end();
});
*/
