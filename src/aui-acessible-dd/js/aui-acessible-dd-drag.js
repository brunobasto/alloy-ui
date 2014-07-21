/**
 * The Acessible Drag Component
 *
 * @module aui-acessible-drag
 */

var Lang = A.Lang;

var Drag = A.Component.create({

    NAME: A.DD.Drag.NAME,

    ATTRS: {},

    EXTENDS: A.DD.Drag,

    prototype: {
        initializer: function() {
            var instance = this;

            instance.on('drag:start', this._onDragStart, instance);

            A.one(A.config.doc).delegate('key', instance._onKeyDown, 'down:32, enter, esc', '.' + MOVEICON.cssclass,
                instance);
        }
    }

});

// A.DD.Drag = A.mix(Drag, A.DD.Drag);
