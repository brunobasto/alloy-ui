/**
 * The Acessible Drop Component
 *
 * @module aui-acessible-drop
 */

var Lang = A.Lang;

var Drop = A.Component.create({

    NAME: A.DD.Drop.NAME,

    ATTRS: {},

    EXTENDS: A.DD.Drop,

    prototype: {
        initializer: function() {
            console.log('initilized drop');
        }
    }

});

// A.DD.Drop = A.mix(Drop, A.DD.Drop);
