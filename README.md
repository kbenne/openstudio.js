# openstudio.js

This is an experiment in loading [OpenStudio](https://github.com/NREL/OpenStudio) into [electron](https://github.com/atom/electron) using OpenStudio's Node bindings.  In this repository will be notes and files to support that effort.

## Setup

* Clone openstudio.js repository. (Or whatever it should be called)
```
git clone https://github.com/kbenne/openstudio.js.git
cd openstudio.js
```

* Install [io.js](https://iojs.org/en/index.html) or [nodejs](https://nodejs.org).  This will only be used for bootstrapping.  Specific versions of the required dependencies will be installed through npm.

* Install openstudio.js dependencies.
```
npm install
```

* Extract OpenStudio node bindings to the project root.

   [Mac - 64 bit](https://drive.google.com/file/d/0B6AYyX2ggNyBZ0ZZbC1fLXczUm8/view?usp=sharing)

   Windows

   Linux

* Launch the application.
```
./node_modules/.bin/electron .
```

## Building OpenStudio Node Bindings

If precompiled binaries are not available then do this.

* Install the dependencies required to make native node modules that are compatible with electron.  The general method is described [here](https://github.com/atom/electron/blob/master/docs/tutorial/using-native-node-modules.md#the-node-gyp-way).
```
HOME=~/.electron-gyp ./node_modules/.bin/node-gyp install --target=0.28.0 --arch=ia64 --dist-url=https://atom.io/download/atom-shell
```

* Install electron.
```
npm install electron-prebuilt@v0.28.0 --save-dev
```

* Install [swig 3.0.5](http://www.swig.org/download.html).

* Clone OpenStudio
```
cd ../
git clone https://github.com/NREL/OpenStudio/tree/openstudiojs
cd OpenStudio
```
* Configure top level OpenStudio to build node bindings.  Enable BUILD_NODE_MODULES. Set NODE_INCLUDE_DIR to $HOME/.electron-gyp/.node-gyp/0.28.0/ replacing $HOME with path to home, where .electron-gyp is located.

* Build OpenStudio


