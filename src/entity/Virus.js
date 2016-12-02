var Cell = require('./Cell');

function Virus() {
    Cell.apply(this, Array.prototype.slice.call(arguments));
    this.cellType = 2;
    this.isSpiked = true;
    this.isMotherCell = false; // Not to confuse bots
    this.setColor({ r: 0x33, g: 0xff, b: 0x33 });
}

module.exports = Virus;
Virus.prototype = new Cell();

// Main Functions

Virus.prototype.canEat = function (cell) {
    return cell.cellType == 3; // virus can eat ejected mass only
};

Virus.prototype.onEat = function (prey) {
    // Called to eat prey cell
    this.setSize(Math.sqrt(this._sizeSquared + prey._sizeSquared));
    
    if (this._size >= this.gameServer.config.virusMaxSize) {
        this.setSize(this.gameServer.config.virusMinSize); // Reset mass
        this.gameServer.shootVirus(this, prey.boostDirection.angle);
    }
};

Virus.prototype.onEaten = function (c) {
    if (c.owner == null) return;

    var minSize = this.gameServer.config.playerMinSize,
    min = (minSize == 32) ? 30 : minSize, // minimun size of small splits
    cellsLeft = this.gameServer.config.playerMaxCells - c.owner.cells.length,
    numSplits = cellsLeft < (c._mass / 16) ? cellsLeft : (c._mass / 16),
    splitMass = (c._mass / numSplits) < min ? (c._mass / numSplits) : min;
    
    // Diverse explosion(s)
    var big = [];
    if (numSplits <= 0) return; // can't split anymore
    if (numSplits == 1) big = [c._mass/2];
    else if (numSplits == 2) big = [c._mass/4,c._mass/4];
    else if (numSplits == 3) big = [c._mass/4,c._mass/4,c._mass/7];
    else if (numSplits == 4) big = [c._mass/5,c._mass/7,c._mass/8,c._mass/10];
    else {
        var threshold = c._mass - numSplits * splitMass; // ckeck size of exploding
        var mults = {                                    // random selection
            v1: ((Math.random() * (4 - 3.8)) + 3.8),     // vanilla mult 1
            v2: ((Math.random() * (3.8 - 3.7)) + 3.7),   // vanilla mult 2
            v3: ((Math.random() * (3.7 - 3.33)) + 3.33), // vanilla mult 3
            v4: ((Math.random() * (2.5 - 2.3)) + 2.3),   // second vanilla mult 1
            v5: ((Math.random() * (2.3 - 2.25)) + 2.25), // second vanilla mult 2
            v6: ((Math.random() * (2.25 - 2)) + 2),      // second vanilla mult 3
        };
        // Monotone explosion(s)
        if (threshold > 466) {
            var exp = 0; // starting mult
            if (Math.random() * 3 <= 1) exp = mults.v1;
            if (Math.random() * 3 <= 2) exp = mults.v2;
            if (Math.random() * 3 <= 3) exp = mults.v3;
            while (threshold / exp > 24) {
                threshold /= exp;
                if (Math.random() * 3 <= 1) exp = mults.v4;
                if (Math.random() * 3 <= 2) exp = mults.v5;
                if (Math.random() * 3 <= 3) exp = mults.v6;
                big.push(threshold >> 0);
            }
        }
    }
    numSplits -= big.length;
    // big splits
    var angle = 0;
    for (var k = 0; k < big.length; k++) {
        angle = 2 * Math.PI * Math.random(); // random directions
        this.gameServer.splitPlayerCell(c.owner, c, angle, big[k]);
    }
    // small splits
    for (var k = 0; k < numSplits; k++) {
        angle = 2 * Math.PI * Math.random(); // random directions
        this.gameServer.splitPlayerCell(c.owner, c, angle, min);
    }
};

Virus.prototype.onAdd = function (gameServer) {
    gameServer.nodesVirus.push(this);
};

Virus.prototype.onRemove = function (gameServer) {
    var index = gameServer.nodesVirus.indexOf(this);
    if (index != -1) 
        gameServer.nodesVirus.splice(index, 1);
};
