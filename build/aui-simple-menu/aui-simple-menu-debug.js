AUI.add('aui-simple-menu', function(A) {
var L = A.Lang,
	isArray = L.isArray,
	isBoolean = L.isBoolean,

	AArray = A.Array,

	_DASH = '-',
	_DOT = '.',
	_EMPY_STR = '',
	_SPACE = ' ',

	CLICK = 'click',
	CONTENT_BOX = 'contentBox',
	DATA_ID = 'data-id',
	HIDDEN = 'hidden',
	HIDDEN_ITEMS = 'hiddenItems',
	ITEM = 'item',
	ITEMS = 'items',
	RENDER = 'render',
	RENDERED = 'rendered',
	SEPARATOR = 'separator',
	SIMPLE_MENU = 'simple-menu',

	getCN = A.getClassName,

	CSS_SIMPLE_MENU_ITEM = getCN(SIMPLE_MENU, ITEM),
	CSS_SIMPLE_MENU_ITEM_HIDDEN = getCN(SIMPLE_MENU, ITEM, HIDDEN),
	CSS_SIMPLE_MENU_SEPARATOR = getCN(SIMPLE_MENU, SEPARATOR),

	TPL_SIMPLE_MENU_ITEM = '<li class="{cssClass}" data-id="{id}">{caption}</li>',

	_getItemFn = A.cached(function(id, items) {
		var item = A.Array.filter(items, function(item) {
			return item.id === id;
		});

		return item[0] && item[0].fn;
	});

var SimpleMenu = A.Component.create(
	{
		NAME: SIMPLE_MENU,

		ATTRS: {
			items: {
				validator: isArray,
				value: []
			},

			hiddenItems: {
				validator: isArray,
				value: []
			},

			host: {
				value: null
			}
		},

		UI_ATTRS: [ITEMS, HIDDEN_ITEMS],

		AUGMENTS: [A.WidgetStdMod, A.WidgetPosition, A.WidgetStack, A.WidgetPositionAlign, A.WidgetPositionConstrain],

		prototype: {
			CONTENT_TEMPLATE: '<ul></ul>',

			bindUI: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				contentBox.delegate(CLICK, A.bind(instance._onClickItems, instance), _DOT + CSS_SIMPLE_MENU_ITEM);
			},

			renderUI: function() {
				var instance = this;

				instance._renderItems(instance.get(ITEMS));
			},

			_onClickItems: function(event) {
				var instance = this;
				var items = instance.get(ITEMS);
				var target = event.currentTarget;

				var id = target.attr(DATA_ID);
				var fn = _getItemFn(id, items);

				if (fn) {
					fn.apply(instance, arguments);
				}

				event.stopPropagation();
			},

			_renderItems: function(items) {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);
				var hiddenItems = instance.get(HIDDEN_ITEMS);

				instance.items = A.NodeList.create();

				AArray.each(items, function(item) {
					var caption = item.caption;
					var id = item.id;

					var cssClass = caption === _DASH ? CSS_SIMPLE_MENU_SEPARATOR : CSS_SIMPLE_MENU_ITEM;

					if (AArray.indexOf(hiddenItems, id) > -1)  {
						cssClass += _SPACE + CSS_SIMPLE_MENU_ITEM_HIDDEN;
					}

					var li = A.Node.create(
						L.sub(TPL_SIMPLE_MENU_ITEM, {
							cssClass: cssClass,
							id: id
						})
					);

					li.setContent(caption);

					instance.items.push(li);
				});

				contentBox.setContent(instance.items);
			},

			_uiSetItems: function(val) {
				var instance = this;

				if (instance.get(RENDERED)) {
					instance._renderItems(val);
				}
			},

			_uiSetHiddenItems: function(val) {
				var instance = this;

				if (instance.get(RENDERED)) {
					instance.items.each(function(item) {
						var id = item.attr(DATA_ID);

						item.toggleClass(CSS_SIMPLE_MENU_ITEM_HIDDEN, AArray.indexOf(val, id) > -1);
					});
				}
			}
		}
	}
);

A.SimpleMenu = SimpleMenu;

}, '@VERSION@' ,{skinnable:true, requires:['aui-base','aui-template','widget-position','widget-stack','widget-position-align','widget-position-constrain','widget-stdmod']});
