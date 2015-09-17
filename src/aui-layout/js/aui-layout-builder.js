/**
 * The Layout Builder Component
 *
 * @module aui-layout-builder
 */

var CSS_LAYOUT_BUILDER_LAYOUT_CONTAINER = A.getClassName('layout', 'builder', 'layout', 'container'),

    TPL_LAYOUT_CONTAINER = '<div class="' + CSS_LAYOUT_BUILDER_LAYOUT_CONTAINER + '"></div>';

/**
 * A base class for Layout Builder.
 *
 * Check the [live demo](http://alloyui.com/examples/layout-builder/).
 *
 * @class A.LayoutBuilder
 * @extends Base
 * @uses A.LayoutBuilderAddCol, A.LayoutBuilderRemoveCol
 * @param {Object} config Object literal specifying layout builder configuration
 *     properties.
 * @constructor
 */
A.LayoutBuilder = A.Base.create('layout-builder', A.Base, [
    A.LayoutBuilderAddCol,
    A.LayoutBuilderMove,
    A.LayoutBuilderRemoveRow,
    A.LayoutBuilderResizeCol,
    // It's necessary that A.LayoutBuilderAddRow is the last to be loaded.
    A.LayoutBuilderAddRow
], {

    /**
     * The node where the layout will be rendered.
     *
     * @property _layoutContainer
     * @type {Node}
     * @protected
     */
    _layoutContainer: null,

    /**
     * Construction logic executed during LayoutBuilder instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var container = this.get('container'),
            layout = this.get('layout');

        this._createLayoutContainer(container);

        layout.addTarget(this);

        this._eventHandles = [
            this.after('layoutChange', A.bind(this._afterLayoutChange, this)),
            this._layoutContainer.on('mouseleave', A.bind(this._onMouseLeave, this))
        ];

        this._layoutContainer.delegate('mouseenter', this._onMouseEnter, '.col', this);
        layout.draw(this._layoutContainer);

        this._layoutContainer.unselectable();
    },

    /**
     * Destructor implementation for the `A.LayoutBuilder` class. Lifecycle.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        (new A.EventHandle(this._eventHandles)).detach();

        this.get('container').empty();
    },

    /**
     * Fires after layout changes.
     *
     * @method _afterLayoutChange
     * @param {EventFacade} event
     * @protected
     */
    _afterLayoutChange: function(event) {
        var newLayout = event.newVal,
            prevLayout = event.prevVal;

        this._layoutContainer.empty();

        prevLayout.removeTarget(this);

        newLayout.addTarget(this);
        newLayout.draw(this._layoutContainer);
    },

    /**
     * Create layout container node.
     *
     * @method _createLayoutContainer
     * @param {Node} container Node that will append the _layoutContainer node.
     * @protected
     */
    _createLayoutContainer: function(container) {
        this._layoutContainer = container.one('.' + CSS_LAYOUT_BUILDER_LAYOUT_CONTAINER);

        if (!this._layoutContainer) {
            this._layoutContainer = A.Node.create(TPL_LAYOUT_CONTAINER);
            container.prepend(this._layoutContainer);
        }
    },

    /**
     *
     *
     * @method _onMouseEnter
     * @param {EventFacade} event
     * @protected
     */
    _onMouseEnter: function (event) {
        var currentCol = event.currentTarget.getData('layout-col'),
            currentRow = event.currentTarget.ancestor('.layout-row').getData('layout-row'),
            iconQuantity = event.currentTarget.ancestor('.layout-row').all('.layout-builder-resize-col-icon ').size(),
            currentColIndex;

        this._layoutContainer.all('.layout-builder-resize-col-icon ').removeClass('hidden');
        this._layoutContainer.all('.layout-builder-resize-col-icon ').addClass('hidden');

        currentColIndex = currentRow.get('cols').indexOf(currentCol);

        if (iconQuantity === 2) {
            event.currentTarget.ancestor('.layout-row').all('.layout-builder-resize-col-icon ').removeClass('hidden');
        }
        else if (currentColIndex === 0) {
            event.currentTarget.ancestor('.layout-row').all('.layout-builder-resize-col-icon ').item(currentColIndex).removeClass('hidden');
            event.currentTarget.ancestor('.layout-row').all('.layout-builder-resize-col-icon ').item(2).removeClass('hidden');
        }
        else if (currentColIndex === (event.currentTarget.ancestor('.layout-row').all('.layout-builder-resize-col-icon ').size() - 2)) {
            event.currentTarget.ancestor('.layout-row').all('.layout-builder-resize-col-icon ').item(currentColIndex + 1).removeClass('hidden');
            event.currentTarget.ancestor('.layout-row').all('.layout-builder-resize-col-icon ').item(1).removeClass('hidden');
        }
        else {
            event.currentTarget.ancestor('.layout-row').all('.layout-builder-resize-col-icon ').item(currentColIndex + 1).removeClass('hidden');
            event.currentTarget.ancestor('.layout-row').all('.layout-builder-resize-col-icon ').item(currentColIndex + 2).removeClass('hidden');
        }
    },

    /**
     *
     *
     * @method _onMouseLeave
     * @param {EventFacade} event
     * @protected
     */
    _onMouseLeave: function () {
        this._layoutContainer.all('.layout-builder-resize-col-icon ').addClass('hidden');
    }
}, {
    /**
     * Static property used to define the default attribute
     * configuration for LayoutBuilder.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * Node that that will be inserted the layout.
         *
         * @attribute container
         * @type {String | Node}
         * @initOnly
         */
        container: {
            setter: A.one,
            validator: function(val) {
                return A.Lang.isString(val) || A.instanceOf(val, A.Node);
            },
            writeOnce: 'initOnly'
        },

        /**
         * Object with layout configuration.
         *
         * @attribute layout
         * @type {A.Layout}
         */
        layout: {
            validator: function(val) {
                return A.instanceOf(val, A.Layout);
            },
            valueFn: function() {
                return new A.Layout();
            }
        },

        /**
         * Collection of strings used to label elements of the UI.
         *
         * @attribute strings
         * @type {Object}
         */
        strings: {
            value: {
                addColumn: 'Add Column'
            },
            writeOnce: true
        }
    }
});
