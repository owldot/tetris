# Overview

The name is pretty obvious. This is Tetris game.

Tetris was written as a seperate module, to split the game logic and rendering.

# Run on development env

Tetris needs server running. You cannot locally just double click on `index.html`.

If you have `ruby`, you can use the following one-liner server (run from the project's directory)
```
$ ruby -rwebrick -e'WEBrick::HTTPServer.new(:Port => 9090, :DocumentRoot => Dir.pwd).start'
```
Then go to `http://localhost:9090` to see tetris game.

# Development

Since I want to use `require` in javascript, which is unsupported in browsers (links will be added later),
you need [browserify](http://browserify.org/). To install it:

`npm install -g browserify`

To create updated `bundle.js` run

```browserify index.js -o bundle.js```

To run tests in watch mode:

```npm run test:debug```
