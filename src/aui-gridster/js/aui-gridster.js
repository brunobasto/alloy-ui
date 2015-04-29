/**
 * The Gridster Utility
 *
 * @module aui-gridster
 */

/**
 * A base class for Gridster
 *
 * Check the [live demo](http://alloyui.com/examples/gridster/).
 *
 * @class A.Gridster
 * @extends Base
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */

var MAX_INTERSECTION = 1000;

A.Gridster = A.Base.create('gridster', A.Widget, [], {
    RESIZE_DIRECTION_KEYS: {
        br: 'BottomRight',
        bl: 'BottomLeft',
        tr: 'TopRight',
        tl: 'TopLeft'
    },

    INVERSE_RESIZE_DIRECTION_KEYS: {
        BottomRight: 'br',
        BottomLeft: 'bl',
        TopRight: 'tr',
        TopLeft: 'tl'
    },

    BUTTON_SIZE: 5,

    _createLevels: function() {
        var spaces = this.get('spaces'),
            levels = [],
            counter;

        for (counter = 0; counter < 16; counter += 1) {
            levels[counter] = 0;
        }

        for (counter = 0; counter < 16; counter += 1) {
            levels[spaces[counter]] += 1;
        }

        this.set('levels', levels);
    },

    getGrouping: function(cell) {
        var spaces = this.get('spaces'),
            counter,
            adjacents = [];

        for (counter = 0; counter < 16; counter += 1) {
            if (spaces[counter] === cell) {
                adjacents.push(counter);
            }
        }

        return adjacents;
    },

    breakBrick: function(cell) {
        this._prepareBreakBrick(cell);
        this.updatePositions();
    },

    _prepareBreakBrick: function(cell) {
        var spaces = this.get('spaces'),
            levels = this.get('levels'),
            counter;

        cell = spaces[cell];

        for (counter = 0; counter < 16; counter += 1) {
            if (spaces[counter] === cell) {
                spaces[counter] = counter;
                levels[counter] = 1;
            }
        }
    },

    _reserveSpace: function(cell, receivers) {
        var spaces = this.get('spaces');

        receivers.forEach(function(rec) {
            this._prepareBreakBrick(rec);
        }, this);

        receivers.forEach(function(rec) {
            spaces[rec] = cell;
        }, this);
    },

    isCellEmpty: function(cell) {
        var currentNode = this.get('cells').item(cell);

        return currentNode.one('.gridster-cell-content').getHTML() === '';
    },

    isCellAvailable: function(cell) {
        var spaces = this.get('spaces');

        return this.isCellEmpty(spaces[cell]);
    },

    _isAdjacentCellAvailableLeft: function(cell, diagonalShown, counter) {
        var a = cell + counter,
            b = diagonalShown - counter;

        return !((a <= 15 && !this.isCellAvailable(a)) ||
            (b >= 0 && !this.isCellAvailable(b)));
    },

    _isAdjacentCellAvailableRight: function(cell, diagonalShown, counter) {
        var a = cell - counter,
            b = diagonalShown + counter;

        return !((a >= 0 && !this.isCellAvailable(a)) ||
            (b <= 15 && !this.isCellAvailable(b)));
    },

    _isAdjacentCellAvailableTop: function(cell, diagonalShown, counter) {
        var a = cell + (4 * counter),
            b = diagonalShown - (4 * counter);

        return !((a <= 15 && !this.isCellAvailable(a)) ||
            (b >= 0 && !this.isCellAvailable(b)));
    },

    _isAdjacentCellAvailableBottom: function(cell, diagonalShown, counter) {
        var a = cell - (4 * counter),
            b = diagonalShown + (4 * counter);

        return !((a >= 0 && !this.isCellAvailable(a)) ||
            (b <= 15 && !this.isCellAvailable(b)));
    },

    _areAdjacentCellsAvailable: function(cell, diagonal, level, dirX, dirY) {
        var spaces = this.get('spaces'),
            methodX = '_isAdjacentCellAvailable' + dirX,
            methodY = '_isAdjacentCellAvailable' + dirY,
            counter;

        if (!this.isCellAvailable(spaces[diagonal])) {
            return false;
        }

        for (counter = 1; counter <= level; counter += 1) {
            if (!this[methodX](cell, spaces[diagonal], counter) ||
                !this[methodY](cell, spaces[diagonal], counter)) {
                return false;
            }
        }

        return true;
    },

    _syncArrowOnCell: function(direction, cell) {
        var level = this.get('levels')[cell],
            grouping,
            directions,
            opt,
            diagonal,
            dirX,
            dirY;

        if (level > 1) {
            this._displayArrowOnCell(cell, direction);
            return;
        }

        grouping = this.getGrouping(cell);

        directions = {
            BottomRight: [grouping[grouping.length - 1] + 5, 'Left', 'Top'],
            BottomLeft: [grouping[[0, 2, 6][level - 1]] + 3, 'Right', 'Top'],
            TopRight: [grouping[level - 1] - 3, 'Left', 'Bottom'],
            TopLeft: [grouping[0] - 5, 'Right', 'Bottom']
        };

        opt = directions[direction];

        diagonal = opt[0];
        dirX = opt[1];
        dirY = opt[2];

        if ((diagonal < 0 || diagonal > 15 ||
            (((((cell + 1) % 4) === 0) && (direction === 'TopRight' || direction === 'BottomRight')))) ||
            ((((cell + 1) % 4) === 1) && (direction === 'TopLeft' || direction === 'BottomLeft'))) {
            return;
        }

        if (this._areAdjacentCellsAvailable(cell, diagonal, level, dirX, dirY)) {
            this._displayArrowOnCell(cell, direction);
        }
    },

    _displayArrowOnCell: function(cell, direction) {
        var currentNode = this.get('cells').item(cell);

        currentNode.one('> .yui3-resize-handles-wrapper .yui3-resize-handle-' +
            this.INVERSE_RESIZE_DIRECTION_KEYS[direction]).setStyle('display', 'block');
    },

    syncControllerToCell: function(cell) {
        this.set('controllerCell', cell);

        this._hideAllResizingHandles();

        A.Array.each(['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'], function(direction) {
            this._syncArrowOnCell(direction, cell);
        }, this);

        this.fire('controller-sync');
    },

    hideControllers: function() {
        this._hideAllResizingHandles();
    },

    mouseOverCellHandler: function(event) {
        var index;

        if (!this.get('showController')) {
            return;
        }

        index = this.get('cells').indexOf(event.currentTarget);

        this.syncControllerToCell(index);
    },

    mouseLeaveGridsterHandler: function() {
        this.hideControllers();
    },

    _expandTopRight: function(cell) {
        var levels = this.get('levels'),
            level = levels[cell],
            grouping = this.getGrouping(cell),
            ne = grouping[level - 1],
            receivers;

        switch(level) {
            case 1:
                receivers = [ne + 1, ne - 3, ne - 4];
                break;
            case 2:
                receivers = [ne - 5, ne - 4, ne - 3, ne + 1, ne + 5];
                break;
            default:
                receivers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        }

        this._reserveSpace(cell, receivers);
        this.updatePositions();
    },

    _expandBottomRight: function(cell) {
        var levels = this.get('levels'),
            level = levels[cell],
            grouping = this.getGrouping(cell),
            se = grouping[0],
            receivers;

        switch(level) {
            case 1:
                receivers = [se + 1, se + 4, se + 5];
                break;
            case 2:
                receivers = [se + 2, se + 6, se + 8, se + 9, se + 10];
                break;
            default:
                receivers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        }

        this._reserveSpace(cell, receivers);
        this.updatePositions();
    },

    _expandBottomLeft: function(cell) {
        var levels = this.get('levels'),
            level = levels[cell],
            grouping = this.getGrouping(cell),
            nw,
            receivers;

        switch(level) {
            case 1:
                nw = grouping[0];
                receivers = [nw - 1, nw + 3, nw + 4];
                break;
            case 2:
                nw = grouping[2];
                receivers = [nw - 5, nw - 1, nw + 3, nw + 4, nw + 5];
                break;
            default:
                receivers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        }

        this._reserveSpace(cell, receivers);
        this.updatePositions();
    },

    _expandTopLeft: function(cell) {
        var levels = this.get('levels'),
            level = levels[cell],
            grouping = this.getGrouping(cell),
            nw = grouping[0],
            receivers;

        switch(level) {
            case 1:
                receivers = [nw - 5, nw - 4, nw - 1];
                break;
            case 2:
                receivers = [nw + 3, nw - 1, nw - 3, nw - 4, nw - 5];
                break;
            default:
                receivers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        }

        this._reserveSpace(cell, receivers);
        this.updatePositions();
    },

    _intersect: function(region, altRegion) {
        var off;

        function getOffsets(r1, r2) {
            return {
                top: Math.max(r1.top, r2.top),
                right: Math.min(r1.right, r2.right),
                bottom: Math.min(r1.bottom, r2.bottom),
                left: Math.max(r1.left, r2.left)
            };
        }

        off = getOffsets(region, altRegion);

        return {
            top: off.top,
            right: off.right,
            bottom: off.bottom,
            left: off.left,
            area: ((off.bottom - off.top) * (off.right - off.left)),
            yoff: ((off.bottom - off.top)),
            xoff: (off.right - off.left)
        };
    },

    _extractTopLeftPositionFromSelection: function(originalGrouping, currentNodeRegion, boundingBoxRegion) {
        var boxWidth = boundingBoxRegion.width / 4,
            boxHeight = boundingBoxRegion.height / 4,
            top = (currentNodeRegion.top - boundingBoxRegion.top) / boxHeight,
            left = (currentNodeRegion.left - boundingBoxRegion.left) / boxWidth,
            index = (Math.floor(top) * 4) + Math.floor(left);

        return index;
    },

    _moveCellContent: function(cell, expansionCell) {
        var cells = this.get('cells'),
            expansionNode = cells.item(expansionCell),
            cellNode = cells.item(cell),
            oldNode = expansionNode.replaceChild(
                cellNode.one('.gridster-cell-content'),
                expansionNode.one('.gridster-cell-content'));

        cellNode.append(oldNode);
    },

    _resizeCell: function(cell, position, level, currentNodeRegion, boundingBoxRegion) {
        var levels = this.get('levels'),
            spaces = this.get('spaces'),
            originalGrouping = this.getGrouping(cell),
            pastLevel = levels[spaces[cell]],
            expansionCell = cell,
            counter;

        if (level === pastLevel) {
            return;
        }

        if (level < pastLevel) {
            this.breakBrick(cell);
            pastLevel = levels[spaces[cell]];
            expansionCell = this._extractTopLeftPositionFromSelection(originalGrouping, currentNodeRegion, boundingBoxRegion);

            if (expansionCell !== cell) {
                this._moveCellContent(cell, expansionCell);
            }
        }

        counter = level - pastLevel;

        while (counter !== 0) {
            this[('_expand' + position)](expansionCell);
            this.updatePositions();

            counter -= 1;
        }

        this.fire('cell-resize', {
            cell: cell,
            spaces: this.get('spaces')
        });

        if (expansionCell !== cell) {
            this.fire('cell-moved', {
                'old': cell,
                'new': expansionCell
            });
        }
    },

    _hideResizingHandles: function(cell) {
        cell.all('.yui3-resize-handle').setStyle('display', 'none');
    },

    _hideAllResizingHandles: function() {
        var cells = this.get('cells');

        cells.all('.yui3-resize-handle').setStyle('display', 'none');
    },

    _verifyBoundaryAlignment: function(currentNodeRegion, boundingBoxRegion) {
        return (currentNodeRegion.top + 1 < boundingBoxRegion.top ||
            currentNodeRegion.right - 1 > boundingBoxRegion.right ||
            currentNodeRegion.left + 1 < boundingBoxRegion.left ||
            currentNodeRegion.bottom - 1 > boundingBoxRegion.bottom);
    },

    _addResizingHandle: function(cell) {
        var cells = this.get('cells'),
            levels = this.get('levels'),
            currentNode = cells.item(cell),
            initialStyle,
            resize = new A.Resize({
            node: currentNode,
            handles: 'tr, br, bl, tl'
        });

        currentNode.plug(A.Plugin.Resize);

        currentNode.set('handles', 'tr, br, bl, tl');

        resize.plug(A.Plugin.ResizeConstrained, {
            preserveRatio: true
        });

        this._hideResizingHandles(currentNode);

        resize.on('resize:align', function(event) {
            var xD = 1,
                yD = 1,
                offset = event.dragEvent.info.offset,
                level = levels[cell],
                lastAlign = true,
                boundingBox = this.get('boundingBox'),
                smaller;

            if (this._verifyBoundaryAlignment(currentNode.get('region'), boundingBox.get('region'))) {
                event.preventDefault();
            }

            if (event.target.changeTopHandles) {
                yD = -1;
            }

            if (event.target.changeLeftHandles) {
                xD = -1;
            }

            smaller = (xD * offset[0] < 0 || yD * offset[1] < 0);

            if (level === 1 && smaller) {
                event.preventDefault();
                return;
            }

            if (smaller) {
                return;
            }

            cells.each(function(eachCell, pos) {
                var intersection = currentNode.intersect(eachCell);

                if (cell !== pos && intersection.inRegion && intersection.area > MAX_INTERSECTION && !this.isCellAvailable(pos)) {
                    lastAlign = false;
                }
            }, this);

            if (!lastAlign) {
                event.preventDefault();
            }
        }, this);

        resize.on('resize:start', function() {
            initialStyle = {
                top: currentNode.getStyle('top'),
                left: currentNode.getStyle('left'),
                height: currentNode.getStyle('height'),
                width: currentNode.getStyle('width')
            };

            currentNode.setStyle('z-index', currentNode.getStyle('z-index') + 1);
        });

        resize.on('resize:end', function(event) {
            var boundingBox = this.get('boundingBox'),
                gridsterWidth = boundingBox.getStyle('width').slice(0, -2),
                currentNodeRegion = currentNode.get('region'),
                levelF = 4 * currentNodeRegion.width / gridsterWidth,
                newLevel = Math.round(levelF),
                level = levels[cell],
                lastAlign = true,
                boundingBoxRegion = boundingBox.get('region');

            event.preventDefault();

            currentNode.setStyle('z-index', currentNode.getStyle('z-index') - 1);

            if (newLevel === 0) {
                newLevel = 1;
            }

            if (this._verifyBoundaryAlignment(currentNodeRegion, boundingBoxRegion)) {
                event.preventDefault();
            }

            cells.each(function(eachCell, pos) {
                var intersection = currentNode.intersect(eachCell);

                if (cell !== pos && intersection.inRegion && intersection.area > MAX_INTERSECTION && !this.isCellAvailable(pos)) {
                    lastAlign = false;
                }
            }, this);

            if (level === newLevel || !lastAlign) {
                setTimeout(function () {
                    currentNode.setStyles(initialStyle);
                }, 0);
                return;
            }

            if (lastAlign) {
                this._resizeCell(cell, this.RESIZE_DIRECTION_KEYS[resize.get('activeHandle')], newLevel, currentNodeRegion, boundingBoxRegion);
            }
        }, this);

        return resize;
    },

    _addResizingHandles: function() {
        var handles = [],
            cells = this.get('cells');

        if (this.get('resizingHandles')) {
            return;
        }

        cells.each(function(cell, pos) {
            handles.push(this._addResizingHandle(pos));
        }, this);

        this._hideAllResizingHandles();

        this.set('resizingHandles', handles);
    },

    initializer: function() {
        var boundingBox = this.get('boundingBox'),
            boundingBoxId = '#' + boundingBox.get('id'),
            cells = A.all(boundingBoxId + ' .gridster-content .gridster-cell');

        boundingBox.addClass('gridster');

        this.set('cells', cells);

        this._createLevels();

        cells.on('mouseenter', A.bind(this.mouseOverCellHandler, this));

        boundingBox.on('mouseleave', A.bind(this.mouseLeaveGridsterHandler, this), this);

        this._eventHandles = [cells];

        if (this.get('showController')) {
            this._addResizingHandles();
        }
    },

    destructor: function() {
        A.Array.each(this.get('resizingHandles'), function(resize) {
            resize.destroy();
        });

        (new A.EventHandle(this._eventHandles)).detach();
    },

    _updatePosition: function(cell) {
        var adjacents = [],
            spaces = this.get('spaces'),
            levels = this.get('levels'),
            currentNode = this.get('cells').item(cell),
            level,
            first,
            counter;

        for (counter = 0; counter < 16; counter += 1) {
            if (spaces[counter] === cell) {
                adjacents.push(counter);
            }
        }

        if (adjacents.length === 0) {
            currentNode.setStyle('display', 'none');
            levels[cell] = 0;
            return;
        }

        level = Math.sqrt(adjacents.length);

        levels[cell] = level;

        first = Math.min.apply(this, adjacents);

        currentNode.setStyles({
            display: 'block',
            top: (Math.floor(first / 4) * 25) + '%',
            left: (first % 4) * 25 + '%',
            height: (level * 25) + '%',
            width: (level * 25) + '%'
        });
    },

    updatePositions: function() {
        var gridster = this,
            counter,
            controllerCell = this.get('controllerCell');

        for (counter = 0; counter < 16; counter += 1) {
            this._updatePosition(counter);
        }

        this.fire('positions-change', {
            spaces: this.get('spaces')
        });

        setTimeout(function() {
            if (controllerCell) {
                gridster.syncControllerToCell(controllerCell);
            }
        }, 0);
    },

    renderUI: function() {
        this.updatePositions();
    }
}, {
    /**
     * Static property provides a string to identify the CSS prefix.
     *
     * @property CSS_PREFIX
     * @type String
     * @static
     */
    CSS_PREFIX: 'gridster',

    /**
     * Static property used to define the default attribute
     * configuration for the `A.Gridster`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        spaces: {
            valueFn: function() {
                var spaces = [],
                    counter;

                for (counter = 0; counter < 16; counter += 1) {
                    spaces[counter] = counter;
                }

                return spaces;
            }
        },

        showController: {
            value: false,
            validator: A.Lang.isBoolean,
            setter: function(value) {
                if (!value) {
                    this.hideControllers();
                }

                if (value) {
                    this._addResizingHandles();
                }

                return value;
            }
        }
    }
});
