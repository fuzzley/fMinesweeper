import { fMinesweeper } from "./fMinesweeper.namespace.js";
import "./fMinesweeper/Statistics.js";
import "./fMinesweeper/Settings.js";
import "./fMinesweeper/Cell.js";
import "./fMinesweeper/Board.js";

fMinesweeper.Page = (function () {
    'use strict';

    var Page = {};

    Page.$context = null;
    Page.board = null;
    Page.vm = null;

    Page.initialize = function () {
        Page.$context = $('#minesweeper-page');

        Page.board = new fMinesweeper.Board(Page.$context.find('#mnsw-board'), new fMinesweeper.Settings());
        Page.board.build();
        Page.initUI();
    };

    Page.initUI = function () {
        Page.vm = {
            settings: Page.board.settings.vm,
            statistics: Page.board.statistics.vm
        };
        ko.applyBindings(Page.vm, Page.$context.get(0));

        Page.$context.find('#mnsw-ui-restart-btn').on('click', function () {
            if (!Page.board.gameStarted || confirm('Your current progress will be lost. Are you sure you want to start a new game?')) {
                Page.board.startNewGame(false);
            }
        });
        Page.$context.find('#mnsw-ui-new-game-btn').on('click', function () {
            if (!Page.board.gameStarted || confirm('Your current progress will be lost. Are you sure you want to start a new game?')) {
                Page.board.gameStarted = false;
            }
        });
        Page.$context.find('#msnw-overlay-new-game-btn').on('click', function () {
            Page.board.build();
            Page.board.startNewGame(true);
        });
    };

    return Page;
})();

$(document).ready(function () {
    fMinesweeper.Page.initialize();
});
