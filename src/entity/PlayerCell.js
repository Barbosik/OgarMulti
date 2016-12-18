var Cell = require('./Cell');

function PlayerCell() {
    Cell.apply(this, Array.prototype.slice.call(arguments));
    
    this.cellType = 0;
    this._speed = null;
    this._canRemerge = false;
}

module.exports = PlayerCell;
PlayerCell.prototype = new Cell();

// Main Functions

PlayerCell.prototype.canEat = function (cell) {
    return true; // player cell can eat anyone
};

PlayerCell.prototype.getSpeed = function () {
    var speed = 2.1106 / Math.pow(this._size, 0.449);
    // tickStep = 40ms
    this._speed = speed * 40 * this.gameServer.config.playerSpeed;
    return this._speed;
};

PlayerCell.prototype.onAdd = function (gameServer) {
    // Gamemode actions
    gameServer.gameMode.onCellAdd(this);
};

PlayerCell.prototype.onRemove = function (gameServer) {
    // Remove from player cell list
    var index = this.owner.cells.indexOf(this);
    if (index != -1) {
        this.owner.cells.splice(index, 1);
    }
    // Gamemode actions
    gameServer.gameMode.onCellRemove(this);
};
