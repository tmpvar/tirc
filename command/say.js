module.exports = {
  regex : /(#[^ ]*) (.*)/,
  execute : function (client, target, message) {
    client.emit('message', config.nick, channel, text);
    client.say(channel, text);
  }
};