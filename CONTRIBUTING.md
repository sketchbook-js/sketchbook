# Contributing to Sketchbook

The project roadmap is managed in GitHub projects:

https://github.com/sketchbook-js/sketchbook/projects/1

General discussion happens in the Github Discussions section:

https://github.com/sketchbook-js/sketchbook/discussions

## Contributor setup

Prerequisite:

- Node.js 10.x
- Yarn 1.x

Steps to set up your local repo:

1.  Fork the repo:

    https://github.com/sketchbook-js/sketchbook/fork

2.  Clone your fork:

    ```shell
    git clone git@github.com:<YOUR_GITHUB_ACCOUNT>/sketchbook.git
    ```

3.  Change into the directory:

    ```shell
    cd sketchbook
    ```

4.  Install dependencies:

    ```shell
    yarn install
    ```

5.  Run the app:

    ```shell
    yarn run start
    ```

6.  Run the tests:

    ```shell
    yarn run test
    ```

## Testing the npm package works

1. Create a package.json file:

   ```shell
   yarn init
   ```

2. Download the sketchbook npm package:

   ```shell
   yarn add -D @sketchbook-js/sketchbook@dev
   ```

   or use this command for the production version:

   ```shell
   yarn add -D @sketchbook-js/sketchbook
   ```

3. Test running the app with:

   ```shell
   yarn init && yarn start
   ```

   or test any commands you want to test.
