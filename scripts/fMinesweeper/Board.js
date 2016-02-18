var fMinesweeper = fMinesweeper || {};

fMinesweeper.Board = (function () {
    'use strict';

    var Board = function ($board, settings) {
        this.$board = $($board);
        this.settings = settings;
        this.statistics = new fMinesweeper.Statistics();
        this.cells = [];

        this._defineProperties();
    };

    Board.prototype.$board = null;
    Board.prototype.settings = null;
    Board.prototype.statistics = null;
    Board.prototype.cells = null;

    Board.prototype.build = function () {
        this.$board.empty();
        this.cells.length = 0;

        //board looks like this:
        //<div id="mnsw-board">
        //  <div class="mnsw-row">
        //    <div class="mnsw-cell">...</div>
        //    <div class="mnsw-cell">...</div>
        //    ...
        //  </div>
        //  <div class="mnsw-row">
        //    <div class="mnsw-cell">...</div>
        //    <div class="mnsw-cell">...</div>
        //    ...
        //  </div>
        //  ...
        //</div>

        for (var i = 0; i < this.settings.rows; i++) {
            var $row = $('<div />').addClass('mnsw-row');

            for (var j = 0; j < this.settings.columns; j++) {
                var cell = new fMinesweeper.Cell(i, j);
                cell.build();
                this.cells.push(cell);
                $row.append(cell.$cell);
            }

            this.$board.append($row);
        }
    };

    Board.prototype.startNewGame = function (placeNewMines) {
        this._reset();
        if (placeNewMines) {
            this._placeMines();
        }
        this._hookCells();

        this.statistics.lives = this.settings.totalLives;
        this.gameStarted = true;
        this.statistics.gamesPlayed++;
    };

    Board.prototype.findSurroundingCells = function (cell) {
        var topLeft = _.find(this.cells, { row: cell.row - 1, column: cell.column - 1 });
        var top = _.find(this.cells, { row: cell.row - 1, column: cell.column });
        var topRight = _.find(this.cells, { row: cell.row - 1, column: cell.column + 1 });
        var right = _.find(this.cells, { row: cell.row, column: cell.column + 1 });
        var botRight = _.find(this.cells, { row: cell.row + 1, column: cell.column + 1 });
        var bot = _.find(this.cells, { row: cell.row + 1, column: cell.column });
        var botLeft = _.find(this.cells, { row: cell.row + 1, column: cell.column - 1 });
        var left = _.find(this.cells, { row: cell.row, column: cell.column - 1 });

        var cells = [topLeft, top, topRight, right, botRight, bot, botLeft, left].filter(function (cell) {
            return !!cell;
        });

        return cells;
    };

    Board.prototype.revealCell = function (cell) {
        //if cell already revealed, don't worry about it
        if (cell.revealed) {
            return;
        } //else

        //reveal cell
        cell.revealed = true;
        this.refreshFoundMines();

        if (cell.hasMine) { //if it's a mine
            this.mineTriggered();
        } if (cell.numMinesSurrounding == 0) { //if it has a 0
            var surroundingCells = this.findSurroundingCells(cell);
            surroundingCells.forEach(function (cell) {
                this.revealCell(cell);
            }.bind(this));
        }
    };

    Board.prototype.revealNeighborsIfAllMinesGuessed = function (cell) {
        var surroundingCells = this.findSurroundingCells(cell);
        var numMines = cell.numMinesSurrounding;
        var foundMines = 0;
        surroundingCells.forEach(function (cell) {
            //if the cell has a mine, and the player either revealed or guessed the mine
            if ((cell.hasMine && cell.revealed) || cell.hasGuess) {
                foundMines++;
            }
        });
        //if all mines found, reveal the cells that don't have a guess
        if (foundMines == numMines) {
            surroundingCells.filter(function (cell) {
                return !cell.hasGuess;
            }.bind(this)).forEach(function (cell) {
                this.revealCell(cell);
            }.bind(this));
            this.checkVictory();
        }
    };

    Board.prototype.refreshFoundMines = function () {
        var numFound = 0;

        this.cells.forEach(function (cell) {
            if ((cell.hasMine && cell.revealed) || cell.hasGuess) {
                numFound++;
            }
        });

        this.statistics.foundMines = numFound;
    };

    Board.prototype.mineTriggered = function () {
        this.statistics.lives--;
        if (this.statistics.lives <= 0) {
            this._unhookCells();
            this.gameStarted = false;
            alert('You ran out of lives. Game over :(.');
        }
    };

    Board.prototype.checkVictory = function () {
        var revealedCells = this.cells.filter(function (cell) { return cell.revealed; }).length;
        var foundMines = this.statistics.foundMines;

        if (this.statistics.lives > 0 && foundMines + revealedCells >= this.settings.totalCells) {
            this._unhookCells();
            this.gameStarted = false;
            alert('You found all the mines without dying. Congratulations!');
        }
    };

    Board.prototype.get$Cells = function () {
        return this.cells.map(function (cell) { return cell.$cell; });
    };

    Board.prototype._defineProperties = function () {
        Object.defineProperty(this, 'gameStarted', {
            get: function () {
                return this.statistics.gameStarted;
            },
            set: function (value) {
                this.statistics.gameStarted = value;
            }
        });
    };

    Board.prototype._reset = function () {
        this.statistics.foundMines = 0;
        this.statistics.lives = 0;
        this.cells.forEach(function (cell) {
            cell.revealed = false;
            cell.hasGuess = false;
        }.bind(this));
    };

    Board.prototype._placeMines = function () {
        this.cells.forEach(function (cell) {
            cell.hasMine = false;
        }.bind(this));

        var availCells = this.cells.slice(0);
        for (var i = 0; i < this.settings.totalMines; i++) {
            //place a mine at a random empty cell
            var rand = Math.round(Math.random() * (availCells.length - 1));
            var cell = availCells[rand];
            cell.hasMine = true;
            //remove the cell from list of empty cells
            _.remove(availCells, cell);
        }

        //determine the number of mines around each empty cell
        for (var i = 0; i < availCells.length; i++) {
            var cell = availCells[i];
            var surroundingCells = this.findSurroundingCells(cell);
            var numMines = surroundingCells.filter(function (cell) {
                return cell.hasMine;
            }).length;
            cell.numMinesSurrounding = numMines;
        }
    };

    Board.prototype._hookCells = function () {
        this.cells.forEach(function (cell) {
            cell.on('click', function (cell, event) {
                if (event.which == 1) { //left click
                    this.revealCell(cell);
                    this.checkVictory();
                }
            }.bind(this));

            cell.on('dblclick', function (cell, event) {
                if (event.which == 1) { //left click
                    if (cell.revealed && !cell.hasMine) { //if cell is revealed and not a mine
                        this.revealNeighborsIfAllMinesGuessed(cell);
                        this.checkVictory();
                    }
                }
            }.bind(this));

            cell.on('mouseup', function (cell, event) {
                if (event.which == 3) { //right click
                    if (!cell.revealed) {
                        cell.toggleGuess();
                        this.refreshFoundMines();
                        this.checkVictory();
                    }
                }
            }.bind(this));

            cell.on('contextmenu', function (cell, event) {
                event.preventDefault();
                return false;
            }.bind(this));
        }.bind(this));
    };

    Board.prototype._unhookCells = function () {
        this.cells.forEach(function (cell) {
            cell.off('click dblclick mouseup');
        });
    };

    return Board;
})();