/**
 * The Accessible DD Delegate Component
 *
 * @module aui-accessible-dd-delegate
 */

var Lang = A.Lang,
    DDM = A.DD.DDM;

var Delegate = A.Component.create({

    NAME: A.DD.Delegate.NAME,

    ATTRS: {},

    EXTENDS: A.DD.Delegate,

    prototype: {
    }
});

A.DD.Delegate = A.mix(Delegate, A.DD.Delegate);
