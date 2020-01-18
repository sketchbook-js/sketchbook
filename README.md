<div align="center">
  <h1>
    <img src="logo.png" alt="Sketchbook" width="160" />
  </h1>
  <p>The design tool that lives in your repo.</p>
  <p>
    <a href="https://travis-ci.com/haydn/sketchbook"><img alt="Travis CI build status" src="https://img.shields.io/travis/com/haydn/sketchbook.svg" /></a>
  </p>
</div>

## Demo

https://sketchbook.particlesystem.com/

![](screenshot.png)

## Installation

The plan is to make it possible to install Sketchbook from npm, but that's still
a little way off. In the meantime, your best bet is to clone this repo and
add your project's repo as a submodule in the `src` directory:

```shell
git submodule add <PATH_TO_YOUR_REPO> src/
```

If your project's build is compatible you should be able to import
your own components into the `config.js` file to use them.

## Getting Involved

Take a look at the roadmap to see what's planned:

https://github.com/haydn/sketchbook/projects/1

Join the Spectrum community to ask questions and discuss ideas:

https://spectrum.chat/sketchbook-js

Have a read of the guidelines to start contributing:

https://github.com/haydn/sketchbook/blob/master/CONTRIBUTING.md
