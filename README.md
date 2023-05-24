# Homepa.gg

## Setup

This guide assumes you have [Yarn](https://yarnpkg.com/) and
[NVM](https://github.com/nvm-sh/nvm) installed globally.

1. Run `nvm install` to install the appropriate version of Node.js.
2. Run `yarn install` to install relevant packages.

## Running This Repo

| Command              | Options | Description                                                                                       |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| `yarn dev`           |         | Start a local server that is accessible from http://localhost:5173/.                              |
| `yarn build`         |         | Build the site for production and place it in a `build` folder in the root directory.             |
| `yarn preview`       |         | Build the site for production and makes it accessible from http://localhost:5173/.                |
| `yarn test`          |         | Start the test server in your terminal.                                                           |
| `yarn test:coverage` |         | Start the test server in your terminal and shows test coverage.                                   |
| `yarn lintcss`       | `--fix` | Alert you of any SCSS linter errors and fill autofix them with the `--fix` option.                |
| `yarn lintjs`        | `--fix` | Alert you of any JS linter errors and fill autofix them with the `--fix` option.                  |
| `yarn pretty`        |         | Will run through all JS, JSX, TS and TSX files and format them based on Prettier's configuration. |

## Code Editor Configuration

While not required, it is strongly recommended that you use
[Visual Studio Code](https://code.visualstudio.com/) as your editor. Doing so
will allow you to use the default repo settings and install any recommended
extensions. If not, make sure to properly configure TypeScript, ESLint and
Stylelint in your editor of choice.
