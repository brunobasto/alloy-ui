var L = A.Lang,
	isArray = L.isArray,
	isObject = L.isObject,

	AArray = A.Array,

	_DOT = '.',
	_EMPTY_STR = '',
	_SPACE = ' ',
	_PLUS = '+',

	ACTIVE = 'active',
	ARROW = 'arrow',
	BLANK = 'blank',
	CALENDAR_LIST = 'calendar-list',
	CALENDARS = 'calendars',
	CLICK = 'click',
	COLOR = 'color',
	CONTENT_BOX = 'contentBox',
	HIDDEN = 'hidden',
	HOVER = 'hover',
	ITEM = 'item',
	LABEL = 'label',
	RENDERED = 'rendered',
	SIMPLE_MENU = 'simpleMenu',
	STYLE = 'style',
	VISIBLE = 'visible',

	getCN = A.getClassName,

	CSS_CALENDAR_LIST_ITEM = getCN(CALENDAR_LIST, ITEM),
	CSS_CALENDAR_LIST_ITEM_ACTIVE = getCN(CALENDAR_LIST, ITEM, ACTIVE),
	CSS_CALENDAR_LIST_ITEM_ARROW = getCN(CALENDAR_LIST, ITEM, ARROW),
	CSS_CALENDAR_LIST_ITEM_COLOR = getCN(CALENDAR_LIST, ITEM, COLOR),
	CSS_CALENDAR_LIST_ITEM_HOVER = getCN(CALENDAR_LIST, ITEM, HOVER),
	CSS_CALENDAR_LIST_ITEM_LABEL = getCN(CALENDAR_LIST, ITEM, LABEL),

	TPL_CALENDAR_LIST_ITEM = new A.Template(
		'<tpl for="calendars">',
			'<div class="', CSS_CALENDAR_LIST_ITEM, '">',
				'<div class="', CSS_CALENDAR_LIST_ITEM_COLOR, '" {[ parent.calendars[$i].get("visible") ? ', '\'style="background-color:\'', _PLUS, 'parent.calendars[$i].get("color")', _PLUS, '";border-color:"', _PLUS, 'parent.calendars[$i].get("color")', _PLUS, '";\\""', ' : \'', _EMPTY_STR, '\' ]}></div>',
				'<span class="', CSS_CALENDAR_LIST_ITEM_LABEL, '">{[ parent.calendars[$i].get("name") ]}</span>',
				'<div href="javascript:;" class="', CSS_CALENDAR_LIST_ITEM_ARROW, '"></div>',
			'</div>',
		'</tpl>'
	);

var CalendarList = A.Component.create(
	{
		NAME: CALENDAR_LIST,

		ATTRS: {
			calendars: {
				setter: '_setCalendars',
				validator: isArray,
				value: []
			},

			simpleMenu: {
				setter: '_setSimpleMenu',
				validator: isObject,
				value: null
			}
		},

		UI_ATTRS: [ CALENDARS ],

		prototype: {
			initializer: function() {
				var instance = this;

				instance.simpleMenu = new A.SimpleMenu(instance.get(SIMPLE_MENU));
			},

			bindUI: function() {
				var instance = this;
				var contentBox = instance.get(CONTENT_BOX);

				instance.on('scheduler-calendar:colorChange', A.bind(instance._onCalendarColorChange, instance));
				instance.on('scheduler-calendar:visibleChange', A.bind(instance._onCalendarVisibleChange, instance));

				instance.on('simple-menu:visibleChange', A.bind(instance._onSimpleMenuVisibleChange, instance));

				contentBox.delegate(CLICK, A.bind(instance._onClick, instance), _DOT + CSS_CALENDAR_LIST_ITEM);

				contentBox.delegate(
					HOVER,
					A.bind(instance._onHoverOver, instance),
					A.bind(instance._onHoverOut, instance),
					_DOT + CSS_CALENDAR_LIST_ITEM
				);
			},

			renderUI: function() {
				var instance = this;

				instance._renderCalendars();

				instance.simpleMenu.render();
			},

			_clearCalendarColor: function(calendar) {
				var instance = this;

				var node = instance._getCalendarNode(calendar);
				var colorNode = node.one(_DOT + CSS_CALENDAR_LIST_ITEM_COLOR);

				colorNode.setAttribute(STYLE, _EMPTY_STR);
			},

			_getCalendarByNode: function(node) {
				var instance = this;
				var calendars = instance.get(CALENDARS);

				return calendars[instance.items.indexOf(node)];
			},

			_getCalendarNode: function(calendar) {
				var instance = this;
				var calendars = instance.get(CALENDARS);

				return instance.items.item(AArray.indexOf(calendars, calendar));
			},

			_onCalendarColorChange: function(event) {
				var instance = this;
				var target = event.target;

				if (target.get(VISIBLE)) {
					instance._setCalendarColor(target, event.newVal);
				}
			},

			_onCalendarVisibleChange: function(event) {
				var instance = this;
				var target = event.target;

				if (event.newVal) {
					instance._setCalendarColor(target, target.get(COLOR));
				}
				else {
					instance._clearCalendarColor(target);
				}
			},

			_onClick: function(event) {
				var instance = this;
				var target = event.target;

				if (target.hasClass(CSS_CALENDAR_LIST_ITEM_ARROW)) {
					if (instance.activeNode) {
						instance.activeNode.removeClass(CSS_CALENDAR_LIST_ITEM_ACTIVE);
					}

					instance.activeNode = event.currentTarget;
					instance.activeItem = instance._getCalendarByNode(instance.activeNode);

					instance.activeNode.addClass(CSS_CALENDAR_LIST_ITEM_ACTIVE);

					var simpleMenu = instance.simpleMenu;

					simpleMenu.setAttrs({
						'align.node': target,
						visible: simpleMenu.get('align.node') !== target || !simpleMenu.get(VISIBLE)
					});

					event.stopPropagation();
				}
				else {
					var calendar = instance._getCalendarByNode(event.currentTarget);

					calendar.set(VISIBLE, !calendar.get(VISIBLE));
				}
			},

			_onHoverOver: function(event) {
				var instance = this;
				var target = event.currentTarget;

				var calendar = instance._getCalendarByNode(target);

				instance._setCalendarColor(calendar, calendar.get(COLOR));

				target.addClass(CSS_CALENDAR_LIST_ITEM_HOVER);
			},

			_onHoverOut: function(event) {
				var instance = this;
				var target = event.currentTarget;

				var calendar = instance._getCalendarByNode(target);

				if (!calendar.get(VISIBLE)) {
					instance._clearCalendarColor(calendar);
				}

				target.removeClass(CSS_CALENDAR_LIST_ITEM_HOVER);
			},

			_onSimpleMenuVisibleChange: function(event) {
				var instance = this;

				if (instance.activeNode && !event.newVal) {
					instance.activeNode.removeClass(CSS_CALENDAR_LIST_ITEM_ACTIVE);
				}
			},

			_renderCalendars: function() {
				var instance = this;

				instance.items = A.NodeList.create(
					TPL_CALENDAR_LIST_ITEM.parse({
						calendars: instance.get(CALENDARS)
					})
				);

				instance.get(CONTENT_BOX).setContent(instance.items);
			},

			_setCalendarColor: function(calendar, val) {
				var instance = this;

				var node = instance._getCalendarNode(calendar);
				var colorNode = node.one(_DOT + CSS_CALENDAR_LIST_ITEM_COLOR);

				colorNode.setStyles(
					{
						backgroundColor: val,
						borderColor: val
					}
				);
			},

			_setCalendars: function(val) {
				var instance = this;

				AArray.each(val, function(item) {
					item.addTarget(instance);
				});

				return val;
			},

			_setSimpleMenu: function(val) {
				var instance = this;

				return A.merge(
					{
						align: {
							points: [ A.WidgetPositionAlign.TL, A.WidgetPositionAlign.BL ]
						},
						items: [],
						plugins: [ A.Plugin.OverlayAutohide ],
						bubbleTargets: [ instance ],
						visible: false,
						width: 290,
						zIndex: 500
					},
					val || {}
				);
			},

			_uiSetCalendars: function(val) {
				var instance = this;

				if (instance.get(RENDERED)) {
					instance._renderCalendars();
				}
			}
		}
	}
);

A.CalendarList = CalendarList;