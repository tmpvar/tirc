# tirc

tmpvar's irc client


## Install (osx only, for now)

If you dont have appjs installed already:
    npm install -g https://github.com/appjs/appjs/tarball/osx-global-install

Then install tirc globally
    npm install -g tirc

## Commands

items with a `*` specify commands that will automatically update your configuration file

`?` for help

`? command` for detailed help

### Nick

`/nick` - prints your current nickname

`/nick <name>` - sets your nickname `*`

### Server

`/server` - lists all connected servers

`/server alias <id> <name>` - make the display of a server pretty`*`

`/connect <ip[:port]>` - connects to a server`*`

`/disconnect <ip[:port]>` - disconnects from a server `*`


### Channels

`/channel` - list the channels you are currently in, grouped by server

`/join #<channel name>` - joins a channel `*`

`/part #<channel name>` - leaves a channel `*`

`/focus #<channel name` - only show events from the selected channel.  This can also be achieved by clicking on the `#<channel>` link in the interface

