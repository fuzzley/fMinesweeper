var fMinesweeper = fMinesweeper || {};

fMinesweeper.Cell = (function () {
    'use strict';

    var Cell = function (row, column) {
        this.row = row;
        this.column = column;

        this._defineProperties();
    };

    Cell.prototype.$cell = null;
    Cell.prototype.row = 0;
    Cell.prototype.column = 0;

    Cell.prototype.build = function () {
        //cell looks like this:
        //<div class="mnsw-cell">
        //  <div class="mnsw-cell-content"></div>
        //  <div class="mnsw-cell-guess" style="display: none;">x</div>
        //</div>

        this.$cell = $('<div />').addClass('mnsw-cell');
        this.$cell.append($('<div />').addClass('mnsw-cell-content'));
        this.$cell.append($('<div />').addClass('mnsw-cell-guess').text('x').hide());
    };

    Cell.prototype.toggleGuess = function () {
        this.hasGuess = !this.hasGuess;
    };

    Cell.prototype.on = function (event, callback) {
        this.$cell.on(event, function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(this); //first argument should be the cell obj itself
            if (typeof (callback) === 'function') {
                callback.apply(this, args);
            }
        }.bind(this));
    };

    Cell.prototype.off = function (event, callback) {
        this.$cell.off.apply(this.$cell, arguments);
    };

    Cell.prototype._defineProperties = function () {
        //most of the cell state is stored in the element itself
        //these properties provide an easy way to query and modify the state
        Object.defineProperty(this, 'hasMine', {
            get: function () {
                return this.$cell.hasClass('mnsw-mine');
            },
            set: function (value) {
                if (value) {
                    this.$cell.addClass('mnsw-mine');
                    this.hiddenContent = 'x';
                } else {
                    this.$cell.removeClass('mnsw-mine');
                    this.hiddenContent = '';
                }
            }
        });

        Object.defineProperty(this, 'numMinesSurrounding', {
            get: function () {
                return parseInt(this.hiddenContent || '0');
            },
            set: function (value) {
                if (value == 0) {
                    this.hiddenContent = '';
                } else {
                    this.hiddenContent = String(value);
                }
            }
        })

        Object.defineProperty(this, 'hiddenContent', {
            get: function () {
                return this.$cell.find('.mnsw-cell-content').text();
            },
            set: function (value) {
                return this.$cell.find('.mnsw-cell-content').text(value);
            }
        });

        Object.defineProperty(this, 'revealed', {
            get: function () {
                return this.$cell.hasClass('mnsw-reveal');
            },
            set: function (value) {
                if (value) {
                    this.$cell.addClass('mnsw-reveal');
                } else {
                    this.$cell.removeClass('mnsw-reveal');
                }
            }
        });

        Object.defineProperty(this, 'hasGuess', {
            get: function () {
                return this.$cell.find('.mnsw-cell-guess').is(':visible');
            },
            set: function (value) {
                if (value) {
                    this.$cell.find('.mnsw-cell-guess').show();
                } else {
                    this.$cell.find('.mnsw-cell-guess').hide();
                }
            }
        });
    };

    return Cell;
})();