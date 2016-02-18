var fMinesweeper = fMinesweeper || {};

fMinesweeper.Statistics = (function () {
    'use strict';

    var Statistics = function (statistics) {
        this.vm = new Statistics.VM();

        this._defineProperties();
        this.set(statistics);
    };

    Statistics.prototype.vm = null;

    Statistics.prototype.set = function (statistics) {
        if (!statistics) {
            return;
        } //else

        if (statistics.gamesPlayed !== undefined) {
            this.gamesPlayed = statistics.gamesPlayed;
        }
        if (statistics.lives !== undefined) {
            this.lives = statistics.lives;
        }
        if (statistics.foundMines !== undefined) {
            this.foundMines = statistics.foundMines;
        }
        if (statistics.gameStarted !== undefined) {
            this.gameStarted = statistics.gameStarted;
        }
    };

    Statistics.prototype.toJSON = function () {
        var json = {
            gamesPlayed: this.gamesPlayed,
            lives: this.lives,
            foundMines: this.foundMines,
            gameStarted: this.gameStarted
        };
    };

    Statistics.prototype.reset = function () {
        this.vm.reset();
    };

    Statistics.prototype._defineProperties = function () {
        //statistics
        Object.defineProperty(this, 'gamesPlayed', {
            get: function () {
                return this.vm.gamesPlayed();
            },
            set: function (value) {
                this.vm.gamesPlayed(value);
            }
        });
        Object.defineProperty(this, 'lives', {
            get: function () {
                return this.vm.lives();
            },
            set: function (value) {
                this.vm.lives(value);
            }
        });
        Object.defineProperty(this, 'foundMines', {
            get: function () {
                return this.vm.foundMines();
            },
            set: function (value) {
                this.vm.foundMines(value);
            }
        });
        Object.defineProperty(this, 'gameStarted', {
            get: function () {
                return this.vm.gameStarted();
            },
            set: function (value) {
                this.vm.gameStarted(value);
            }
        });
    };

    Statistics.Constants = {
        localStoragePath: 'fMinesweeper.Statistics'
    };

    //view models
    //#region VM
    Statistics.VM = function () {
        this.gamesPlayed = ko.observable();
        this.lives = ko.observable();
        this.foundMines = ko.observable();
        this.gameStarted = ko.observable();

        this.reset();
    };

    Statistics.VM.prototype.reset = function () {
        this.gamesPlayed(0);
        this.lives(0);
        this.foundMines(0);
        this.gameStarted(false);
    };
    //#endregion

    return Statistics;
})();