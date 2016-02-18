var fMinesweeper = fMinesweeper || {};

fMinesweeper.Settings = (function () {
    'use strict';

    var Settings = function (settings) {
        this.vm = new Settings.VM();

        this._defineProperties();
        this.set(settings);
    };

    Settings.prototype.vm = null;

    Settings.prototype.set = function (settings) {
        if (!settings) {
            return;
        } //else

        if (settings.rows !== undefined) {
            this.rows = settings.rows;
        }
        if (settings.columns !== undefined) {
            this.columns = settings.columns;
        }
        if (settings.totalLives !== undefined) {
            this.totalLives = settings.totalLives;
        }
    };

    Settings.prototype.toJSON = function () {
        var json = {
            rows: this.rows,
            columns: this.columns,
            totalLives: this.totalLives,
        };
    };

    Settings.prototype.reset = function () {
        this.vm.reset();
    };

    Settings.prototype._defineProperties = function () {
        //settings
        Object.defineProperty(this, 'rows', {
            get: function () {
                return this.vm.rows();
            },
            set: function (value) {
                this.vm.rows(value);
            }
        });
        Object.defineProperty(this, 'columns', {
            get: function () {
                return this.vm.columns();
            },
            set: function (value) {
                this.vm.columns(value);
            }
        });
        Object.defineProperty(this, 'totalLives', {
            get: function () {
                return this.vm.totalLives();
            },
            set: function (value) {
                this.vm.totalLives(value);
            }
        });
        //readonly
        Object.defineProperty(this, 'totalCells', {
            get: function () {
                return this.vm.totalCells();
            }
        });
        Object.defineProperty(this, 'totalMines', {
            get: function () {
                return this.vm.totalMines();
            }
        });
    };

    Settings.Constants = {
        totalMinesPercent: .25,
        defaultRows: 20,
        defaultColumns: 20,
        defaultLives: 3,
        localStoragePath: 'fMinesweeper.Settings'
    };

    //view models
    //#region VM
    Settings.VM = function () {
        this.rows = ko.observable();
        this.columns = ko.observable();
        this.totalLives = ko.observable();

        this.totalCells = ko.computed(function () {
            return this.rows() * this.columns();
        }, this);
        this.totalMines = ko.computed(function () {
            var numCells = this.totalCells();
            var numMines = Math.round(numCells * Settings.Constants.totalMinesPercent);
            return numMines;
        }, this);

        this.reset();
    };

    Settings.VM.prototype.reset = function () {
        this.rows(Settings.Constants.defaultRows);
        this.columns(Settings.Constants.defaultColumns);
        this.totalLives(Settings.Constants.defaultLives);
    };
    //#endregion

    return Settings;
})();