var
  appjs  = require('appjs'),
  irc = require('irc'),
  fs     = require('fs'),
  config, window;

try {
  config = require(process.env.HOME + '.tirc');
} catch(e) {
  config = require('./config.json');
}

appjs.serveFilesFrom('assets');

window = appjs.createWindow('http://appjs/', {
  width           : 640,
  height          : 460,
  left            : -1,    // optional, -1 centers
  top             : -1,    // optional, -1 centers
  autoResize      : false, // resizes in response to html content
  resizable       : true, // controls whether window is resizable by user
  showChrome      : true,  // show border and title bar
  opacity         : 1,     // opacity from 0 to 1 (Linux)
  alpha           : true,  // alpha composited background (Windows & Mac)
  fullscreen      : false, // covers whole screen and has no border
  disableSecurity : true   // allow cross origin requests
});



var client = new irc.Client(config.server, config.nick, {
  channels : config.channels
});

window.on('ready', function() {
  var $ = window.$;

  window.title = 'tirc (' + config.nick + ')';

  client.on('join', function(channel) {
    $('#channel ul').append(
      '<li class="system join">' +
      'you have joined <span class="channel">' +
      channel + '</span></li>'
    )
  });

  client.on('message', function(from, to, message) {
    var li = $(
      '<li><a class="channel" href="' + to + '">' + to +
      '</a> <em class="nick">&lt;' + from +
      '&gt;</em> <span class="msg"></span>'
    );

    message = $('<div/>').text(message).html();

    if (message.indexOf(config.nick) > -1) {
      li.addClass('highlight');
      message = message.replace(
        new RegExp('(' + config.nick + ')', 'g'),
        '<span class="highlight">$1</span>'
      );
    }

    li.find('.msg').html(message);


    $('#channel ul').append(li);
  });

  $('#user-input').on('keydown', function(ev) {
    var key = ev.which, text = $(this).val();

    switch (key) {
      case 13:
        var
          matches = text.match(/(#[^ ]*) (.*)/),
          // TODO: use the current filter
          channel = '#reflexjs';

        if (matches.length > 2) {
          channel = matches[1];
          text = matches[2];
        }

        client.emit('message', config.nick, channel, text);
        client.say(channel, text);
        $(this).val('');
      break;
    }

  });

  this.require = require;
  this.process = process;
  this.module = module;
  //this.console.open();
  //this.console.log('process', process);
  //this.frame.center();
  this.frame.show();
  console.log("Window Ready");
});

