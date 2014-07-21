/**
 * The Acessible DD Delegate Component
 *
 * @module aui-acessible-dd-delegate
 */

var Lang = A.Lang,
    DDM = A.DD.DDM;

var Delegate = A.Component.create({

    NAME: A.DD.Delegate.NAME,

    ATTRS: {},

    EXTENDS: A.DD.Delegate,

    prototype: {
        initializer: function() {
            var instance = this,
                container = instance.get('container'),
                nodes = instance.get('nodes');

            instance._dropNodesKeyDownHandler = A.bind(instance._onKeyDownDropNode, instance);

            A.one(container).delegate('focus', A.bind(instance._onBeforeActivateDragNode, instance), '.' + DDM.CSS_PREFIX +
                '-drop');

            A.one(container).delegate('keydown', A.bind(instance._onKeyDownDragNode, instance), nodes);
        },

        _endKeyboardDrag: function(event) {
            var instance = this,
                container = instance.get('container'),
                dropTargets = A.one(container).all('.' + DDM.CSS_PREFIX + '-drop');

            instance._isDragging = false;

            dropTargets.each(function(node, index) {
                if (DDM.getDrop(node)) {
                    node.removeClass(DDM.CSS_PREFIX + '-acessible-dragging');

                    node.removeAttribute('aria-dropeffect');

                    if (!instance._isDragNode(node)) {
                        node.removeAttribute('tabindex');

                        node.detach('keydown', instance._dropNodesKeyDownHandler);
                    }
                }
            });

            DDM.stopDrag();
        },

        _onBeforeActivateDragNode: function(event) {
            var instance = this,
                target = event.target;

            if (instance._isDragging) {
                event.pageX = target.getX();
                event.pageY = target.getY();

                DDM._move(event);
            }
        },

        _onKeyDownDragNode: function(event) {
            var instance = this;

            if (event.isKey('ENTER')) {
                if (instance._isDragging) {
                    instance._endKeyboardDrag(event);
                }
                else {
                    instance._startKeyboardDrag(event);
                }
            }
        },

        _onKeyDownDropNode: function(event) {
            var instance = this,
                activeElement = A.one(document.activeElement);

            if (event.isKey('ENTER') && !instance._isDragNode(activeElement)) {
                if (instance._isDragging) {
                    instance._endKeyboardDrag(event);
                }
                else {
                    instance._startKeyboardDrag(event);
                }
            }
        },

        _isDragNode: function(node) {
            var instance = this,
                nodes = instance.get('nodes');

            return node.test(nodes);
        },

        _startKeyboardDrag: function(event) {
            var instance = this,
                container = instance.get('container'),
                dropTargets = A.one(container).all('.' + DDM.CSS_PREFIX + '-drop');

            instance._isDragging = true;

            dropTargets.each(function(node, index) {
                if (DDM.getDrop(node)) {
                    node.addClass(DDM.CSS_PREFIX + '-acessible-dragging');

                    node.setAttribute('aria-dropeffect', 'move');
                    node.setAttribute('tabindex', index);

                    if (!instance._isDragNode(node)) {
                        node.on('keydown', instance._dropNodesKeyDownHandler);
                    }
                }
            });

            var dd = instance.dd;

            event.button = 1;

            instance._delMouseDown(event);

            dd.fire('drag:mouseDown', {
                ev: event
            });
            dd.start();
            dd._dragThreshMet = true;
            dd._setStartPosition(event.target.getXY());
            dd._alignNode(event.target.getXY());
        }
    }

});

A.DD.Delegate = A.mix(Delegate, A.DD.Delegate);
