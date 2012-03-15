var L = A.Lang,
	isArray = L.isArray,
	isBoolean = L.isBoolean,
	isString = L.isString,

	AArray = A.Array,

	_DOT = '.',
	_EMPY_STR = '',

	CLICK = 'click',
	COLOR = 'color',
	CONTENT_BOX = 'contentBox',
	COLOR_CHANGE = 'colorChange',
	ITEM = 'item',
	PALLETE = 'pallete',
	RENDERED = 'rendered',
	SELECTED = 'selected',
	SIMPLE_COLOR_PICKER = 'simple-color-picker',

	getCN = A.getClassName,

	CSS_SIMPLE_COLOR_PICKER_ITEM = getCN(SIMPLE_COLOR_PICKER, ITEM),
	CSS_SIMPLE_COLOR_PICKER_ITEM_SELECTED = getCN(SIMPLE_COLOR_PICKER, ITEM, SELECTED),

	TPL_SIMPLE_COLOR_PICKER_ITEM = new A.Template(
		'<tpl for="pallete">',
			'<div class="', CSS_SIMPLE_COLOR_PICKER_ITEM, '" style="background-color: {[ parent.pallete[$i] ]}', '; border-color:', '{[ parent.pallete[$i] ]};','"></div>',
		'</tpl>'
	);

var SimpleColorPicker = A.Component.create(
	{
		NAME: SIMPLE_COLOR_PICKER,

		ATTRS: {
			color: {
				validator: isString,
				value: _EMPY_STR
			},

			host: {
				value: null
			},

			pallete: {
				setter: AArray,
				validator: isArray,
				value: ['#d96666', '#e67399', '#b373b3', '#8c66d9', '#668cb3', '#668cd9', '#59bfb3', '#65ad89', '#4cb052', '#8cbf40', '#bfbf4d', '#e0c240', '#f2a640', '#e6804d', '#be9494', '#a992a9', '#8997a5', '#94a2be', '#85aaa5', '#a7a77d', '#c4a883', '#c7561e', '#b5515d', '#c244ab']
			}
		},

		UI_ATTRS: [ PALLETE ],

		prototype: {
			bindUI: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				instance.on(COLOR_CHANGE, A.bind(instance._onColorChange, instance));

				contentBox.delegate(CLICK, A.bind(instance._onClickColor, instance), _DOT + CSS_SIMPLE_COLOR_PICKER_ITEM);
			},

			renderUI: function() {
				var instance = this;

				instance._renderPallete();
			},

			_onClickColor: function(event) {
				var instance = this;
				var pallete = instance.get(PALLETE);

				instance.set(COLOR, pallete[instance.items.indexOf(event.currentTarget)]);
			},

			_onColorChange: function(event) {
				var instance = this;
				var pallete = instance.get(PALLETE);

				var prevNode = instance.items.item(pallete.indexOf(event.prevVal));

				if (prevNode) {
					prevNode.removeClass(CSS_SIMPLE_COLOR_PICKER_ITEM_SELECTED);
				}

				var newNode = instance.items.item(pallete.indexOf(event.newVal));

				if (newNode) {
					newNode.addClass(CSS_SIMPLE_COLOR_PICKER_ITEM_SELECTED);
				}
			},

			_renderPallete: function() {
				var instance = this;

				instance.items = A.NodeList.create(
					TPL_SIMPLE_COLOR_PICKER_ITEM.parse({
						pallete: instance.get(PALLETE)
					})
				);

				instance.get(CONTENT_BOX).setContent(instance.items);
			},

			_uiSetPallete: function(val) {
				var instance = this;

				if (instance.get(RENDERED)) {
					instance._renderPallete();
				}
			}
		}
	}
);

A.SimpleColorPicker = SimpleColorPicker;