var
  appjs  = require('appjs'),
  irc = require('irc'),
  fs     = require('fs'),
  commands = require('./command'),
  config = require('./lib/config'),
  window, channel;

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
  channels : config.channels,
  userName: process.env.USER,
  realName: process.env.USER
});

window.on('ready', function() {
  var $ = window.$;

  client.on('join', function(channel, nick) {
    if (nick === config.nick) {
      $('#channel ul').append(
        '<li class="system join">' +
        'you have joined <span class="channel">' +
        channel + '</span></li>'
      )
    }
  });

  $('.expando').live('click', function() {
    $('img', this).removeClass('hide');
  });

  client.on('error', function() {
    console.log(arguments);
  })

  client.on('message', function(from, to, message) {
    var str = '<li>';
    if (to[0] === '#') {
      str += '<a class="channel" href="' + to + '">' + to +'</a>'
    }
    str += ' <em class="nick">&lt;' + from + '&gt;</em> <span class="msg"></span>';
    var li = $(str);

    message = $('<div/>').text(message).html();

    if (message.indexOf(config.nick) > -1) {
      li.addClass('highlight');
      message = message.replace(
        new RegExp('(' + config.nick + ')', 'g'),
        '<span class="highlight">$1</span>'
      );
    }

    message = message.replace(
      /(\b(https?|ftp|file):\/\/[^ ]+\.)(png|jpeg|jpg|bpm)/ig,
      '<div class="expando"><img src="$1$3" width="90%" /><p><a href="$1$3" target="_blank">$1$3</a></p></div>'
    );

    /*var urls = message.match(/(https?[^ "]+)/g);
    console.log(urls);
    urls && urls.forEach(function(url) {
      if (url.match(/\.(png|jpeg|jpg|bmp)$/)) {

        // TODO: load the image first to figure out its dimensions
        message = message.replace(url, [
          '<div href="#" class="expando">',
          '<img class="" src="',
          url,
          '" width="90%" /><p>' + url + '</p></div>'
        ].join(''));
      } else {

        //message = message.replace(url, '<iframe src="' + url + '"></iframe>');
      }
    });*/
console.log(message)

    li.find('.msg').html(message);


    $('#channel ul').append(li);
  });

  function log(message) {
    $('#channel ul').append(
      '<li class="log">' + message + '</li>'
    );
  }

  var history = [];

  $('#user-input').focus();
  $('#user-input').on('keydown', function(ev) {
    var key = ev.which, text = $(this).val();

    if (!text) { return; }

    switch (key) {
      case 13:

        var
          parts = text.split(' ');

          switch (parts[0]) {
            case '/nick':
              if (parts.length === 2) {
                client.send('NICK', parts[1]);
                config.nick = parts[1];
              } else {
                // TODO: consolidate errors/system messages
              }
            break;

            case '/join':
              config.channels.push(parts[1]);
              client.send('JOIN', parts[1]);
            break;

            case '/part':
              // TODO: error if you try to leave a conversation
              config.channels.filter(function(val) {
                return !(val === parts[1])
              });
              client.send('PART', channel);
            break;

            case '/channels':
              var prefix = '<span class="channel">', suffix = "</span>";
              log('you are currently in ' + prefix + config.channels.join(suffix+', '+ prefix) + suffix)
            break;

            case '/servers':

            break;

            case '/connect':

            break;

            // send a message
            default:

              // switch the current context
              if (parts[0][0] === "#" || parts[0][0] === "@") {
                $('#input .context').text(parts[0]);

                var cls = parts[0][0] === "@" ? 'user' : 'channel';
                console.log('add', cls);
                $('#input .context').removeClass('user channel');
                $('#input .context').addClass(cls);

                channel = parts[0].replace('@', '');
                parts.shift();
                text = parts.join(' ');
              }

              client.emit('message', config.nick, channel, text);
              client.say(channel, text);

            break;
          }
          $(this).val('');
      break;
    }
  });

  this.require = require;
  this.process = process;
  this.module = module;

  this.frame.show();
  console.log("Window Ready");
});

