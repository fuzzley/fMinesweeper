> [!NOTE]
> This code was branched off into [fuzzley-games](https://github.com/fuzzley/fuzzley-games) in October 2026, and the newest version lives there, in [`frontend/games/minesweeper/`](https://github.com/fuzzley/fuzzley-games/tree/main/frontend/games/minesweeper). This repository keeps the code as it was when it branched; the two may diverge.

Just a simple Minesweeper clone, written in TypeScript and Angular.
The project utilizes [Phaser](https://phaser.io/) for the game rendering/canvas and [Angular](https://angular.dev/) for the user interface.

The [latest version of the game](https://fuzzley.games/play/minesweeper/) is hosted on https://fuzzley.games/play/minesweeper/.

Have fun!

## Development

This project uses [yarn](https://yarnpkg.com/) for dependency management and
[Vite](https://vite.dev/) for the dev server and production build.

```sh
yarn install     # install dev dependencies
yarn dev         # start the dev server on http://localhost:9000
yarn build       # produce a production build in dist/
yarn preview     # serve the production build locally
yarn test        # run tests with Vitest
yarn lint        # run ESLint
yarn prettier    # format the code with Prettier
```

## License

This project source code is licensed under the [GNU General Public License v3.0 or later](LICENSE).
