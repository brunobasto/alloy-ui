YUI.add('aui-form-builder-field-list-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-form-builder-field-list');

    suite.add(new Y.Test.Case({
        name: 'AUI Form Builder Field List Unit Tests',

        init: function() {
            this._container = Y.one('#container');
        },

        setUp: function() {
            this.createFieldList();
        },

        tearDown: function() {
            this._fieldList && this._fieldList.destroy();
        },

        createFieldList: function(config) {
            this._fieldList = new Y.FormBuilderFieldList(config);
            this._container.append(this._fieldList.get('node'));
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-form-builder-field-list', 'node-event-simulate', 'test'],
    test: function(Y) {
        return Y.UA.ie === 0 || Y.UA.ie > 8;
    }
});