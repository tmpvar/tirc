dir=`dirname "$0"`
target=`readlink "$0"`
target_dir=`dirname "$target"`

/usr/bin/env appjs $dir/$target_dir/../index.js
