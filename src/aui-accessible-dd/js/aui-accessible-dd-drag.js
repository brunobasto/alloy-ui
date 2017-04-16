/**
 * The Accessible Drag Component
 *
 * @module aui-accessible-drag
 */

var DDM = A.DD.DDM,
    DOC = A.config.doc,
    Lang = A.Lang;

var Drag = A.Component.create({

    NAME: A.DD.Drag.NAME,

    ATTRS: {},

    EXTENDS: A.DD.Drag,

    prototype: {
        /**
         * Index of current drop target in `_targets`
         * @type Number
         */
        _currentTarget: null,

        /**
         * Index of drag object in `_targets`
         * @type Number
         */
        _index: null,
     
        /**
         * Index of previous drop target in `_targets`
         * @type Number
         */
        _prevTarget: null,
     
        /**
         * An array of valid drop targets for the drag object
         * @type A.NodeList
         */
        _targets: null,

        /**
         * Construction logic executed during `A.DD.Drag` instantiation.
         * Lifecycle.
         *
         * @method initializer
         */
        initializer: function() {
            var instance = this,
                node = instance.get('node');

            // add drag object to the tab order
            node.set('tabIndex', 0);

            instance._bindKeyEvents();
        },

        /**
         * Subscribes drag object to key events.
         *
         * @method _bindKeyEvents
         * @protected
         */
        _bindKeyEvents: function() {
            var instance = this,
                node = instance.get('node');
            
            instance.once('drag:keyDown', A.bind(instance._defKeyDownFn, instance));
            instance.once('drag:start', A.bind(instance._onDragStart, instance));
            node.on('key', A.bind(instance._onTriggerKeyDown, instance), 'down: 17');
        },

        /**
         * Default function for drag:keyDown. Fired from _onTriggerKeyDown.
         * 
         * @method _defKeyDownFn
         * @protected
         */
        _defKeyDownFn: function(event) {
            var instance = this,
                doc = A.one(DOC),
                node = instance.get('node');

            instance._handleMouseDownEvent(event.ev);
            doc.once('key', A.bind(instance._onTriggerKeyUp, instance), 'up: 17');
        },

        /**
         * Gets a list of valid drop targets for the drag object.
         *
         * @method _getDropTargets
         * @protected
         * @return {A.NodeList}
         */
        _getDropTargets: function() {           
            return A.all('.' + DDM.CSS_PREFIX + '-drop-active-valid');      
        },

        /**
         * Sets the current drop target to the next available target in targets.
         *
         * @method _nextTarget
         * @protected
         */
        _getNextTarget: function() {
            var instance = this,
                currentTarget = instance._currentTarget + 1;

            return currentTarget < instance._targets.size() ? currentTarget : 0;
        },
     
        /**
         * Sets the current drop target to the previous target in targets.
         *
         * @method _prevTarget
         * @protected
         */
        _getPrevTarget: function() {
            var instance = this,
                currentTarget = instance._currentTarget - 1;

            return currentTarget >= 0 ? currentTarget : instance._targets.size() - 1;
        },

        /**
         * Handles previous drop target. Derives from _handleOut in dd-drop.js
         *
         * @method _handleOut
         * @protected
         */
        _handleOut: function(dropNode) {
            var drop = DDM.getDrop(dropNode);
     
            if (drop && drop.overTarget) {
                drop.overTarget = false;
                DDM._removeActiveShim(drop);
                dropNode.removeClass(DDM.CSS_PREFIX + '-drop-over');
                DDM.activeDrag.get('node').removeClass(DDM.CSS_PREFIX + '-drag-over');
                drop.fire('drop:exit', { drop: drop, drag: DDM.activeDrag });
                DDM.activeDrag.fire('drag:exit', { drop: drop, drag: DDM.activeDrag });
            }
        },
     
        /**
         * Handles current drop target. Derives from _handleTargetOver in dd-drop.js
         *
         * @method _handleTargetOver
         * @protected
         */
        _handleTargetOver: function(dropNode) {
            var drop = DDM.getDrop(dropNode);
     
            dropNode.addClass(DDM.CSS_PREFIX + '-drop-over');
            DDM.activeDrop = drop;
            drop.overTarget = true;

            drop.fire('drop:enter', { drop: drop, drag: DDM.activeDrag });
            drop.fire('drop:over', { drop: drop, drag: DDM.activeDrag });

            DDM.activeDrag.fire('drag:enter', { drop: drop, drag: DDM.activeDrag });
            DDM.activeDrag.fire('drag:over', { drop: drop, drag: DDM.activeDrag });
            DDM.activeDrag.get('node').addClass(DDM.CSS_PREFIX + '-drag-over');
        },

        /**
         * Triggers when the drag event starts.
         *
         * @method _onDragStart
         * @param event
         * @protected
         */
        _onDragStart: function(event) {
            var instance = this,
                doc = A.one(DOC),
                dragNode = DDM.activeDrag.get('node');

            instance._targets = instance._getDropTargets();
            
            // finds the index of the drag node and removes it from the drop targets list
            instance._currentTarget = instance._targets.indexOf(dragNode);
            instance._targets.splice(instance._currentTarget, 1);
            instance._currentTarget = instance._currentTarget ? instance._currentTarget - 1 : instance._currentTarget;

            instance._handle = doc.on('key', A.bind(instance._setTarget, instance), 'down: 37, 39');
        },

        /**
         * Starts drag operation when the trigger key is pressed down.
         *
         * @method _start
         * @protected
         */     
        _onTriggerKeyDown: function(event) {
            if (event.target === event.currentTarget) {
                var instance = this;

                event.button = 1;
                instance.fire('drag:keyDown', {ev: event});
            }
        },

        /**
         * Ends drag operation when trigger key is released.
         *
         * @method _end
         * @protected
         */
        _onTriggerKeyUp: function(event) {
            var instance = this,
                node = instance.get('node');

            instance._handleMouseUp(event);

            instance._bindKeyEvents();

            if (instance._handle) {
                instance._handle.detach();

                // set focus back to dragged object after drop
                node.focus();               
            }
        },

        /**
         * Sets the current drop target.
         *
         * @method _setTarget
         * @protected
         */
        _setTarget: function(event) {
            var instance = this,
                key = event.charCode;

            event.preventDefault();

            instance._prevTarget = instance._currentTarget;

            if (key === 37) {
                instance._currentTarget = instance._getPrevTarget();
            }
            else if (key === 39) {
                instance._currentTarget = instance._getNextTarget();
            }

            var prevDrop = instance._targets.item(instance._prevTarget),
                currentDrop = instance._targets.item(instance._currentTarget);

            instance._handleOut(prevDrop);
            instance._handleTargetOver(currentDrop);
        }
    }
});

A.DD.Drag = A.mix(Drag, A.DD.Drag);