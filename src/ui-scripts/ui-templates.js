﻿window.templates = window.templates || ( window.templates = {} );

(function()
{
  var self = this;

  this.tab = function(obj, is_active_tab)
  {
    return ['tab', obj.name,
            'handler', 'tab',
            'ref-id', obj.ref_id
      //( obj.has_close_button ? ['input', 'type', 'button', 'handler', 'close-tab', ] : [] ),
    ].concat(is_active_tab ? ['class', 'active'] : [] );
  }

  this.top_tab = function(obj, is_active_tab)
  {
    return ['tab', [['span', "", "class", "icon"], obj.name],
            'handler', 'tab',
            'ref-id', obj.ref_id
    ].concat(is_active_tab ? ['class', 'active'] : [] );
  };

  this.horizontal_navigation_content = function()
  {
    return [
        ["nav",
          "◀",
          "dir", "back",
          "handler", "horizontal-nav"],
        ["breadcrumbs",
         "handler", "breadcrumbs-drag"],
        ["nav",
          "▶",
          "dir", "forward",
          "handler", "horizontal-nav"]
      ];
  };

  this.contextmenu = function(items)
  {
    var ret = [];
    for (var i = 0, item; item = items[i]; i++)
    {
      var checked = false;
      if (item.setting)
      {
        checked = settings[item.menu_id].get(item.id);
      }
      if (!item.separator)
      {
        ret.push(["li",
            [["span", checked ? "✔" : "", "class", "checkbox"], ["span", item.label]],
            "data-handler-id", item.id,
            "data-menu-id", item.menu_id,
            "class", item.disabled ? "disabled" : ""
        ]);
      }
      else
      {
        ret.push(["li", ["hr"], "class", "separator"]);
      }
    }
    return ["menu", ret, "id", "contextmenu"];
  };

  this.filters = function(filters)
  {
    var ret = ['toolbar-filters'], filter = '', i = 0, default_text = '';
    for( ; filter = filters[i]; i++)
    {
      if( filter.type && this[filter.type] )
      {
        ret[ret.length] = this[filter.type](filter);
      }
      else
      {
        ret[ret.length] = ['filter', 
          ['span', ( default_text = filter.label ? filter.label : ui_strings.S_INPUT_DEFAULT_TEXT_SEARCH ) ],
          [
            'input', 
            'autocomplete', 'off', 
            'type', 'text', 
            'handler', filter.handler, 
            'title', filter.title,
            'default-text', default_text
          ]
        ];
      }
    }
    return ret;
  }

  this.dropdown = function(filter)
  {
    return ['filter', 
          //['em', filter.label ? filter.label : 'search'],
          [
            'select',
            'handler', filter.handler,
            'title', filter.title,
            'class', filter.class || ''
          ],
          'class', 'dropdown'
        ];
  }

  this.buttons = function(buttons)
  {
    var ret = ['toolbar-buttons'], button = '', i = 0;
    for( ; button = buttons[i]; i++)
    {
      ret[ret.length] = 
        ['button', 
          'handler', button.handler, 
          'title', button.title
        ].concat(
            button.id ? ['id', button.id] : [],
            button.disabled ? ['disabled', 'disabled'] : [],
            button.param ? ['param', button.param] :[],
            button.class_name ? ['class', button.class_name] :[]
        );
    }
    return ret;
  }

  this.toolbar_settings = function(toolbar_settings)
  {
    return ['cst-select-toolbar-setting', 'class', 'toolbar-settings', 'cst-id', toolbar_settings.id];
  }

  this.switches = function(switches)
  {
    var 
    ret = ['toolbar-switches'], 
    _switch = '', 
    i = 0, 
    setting = null;

    for( ; _switch = switches[i]; i++)
    {
      if(setting = Settings.get_setting_with_view_key_token(_switch))
      {
        ret[ret.length] = 
          ['button', 
            'handler', 'toolbar-switch', 
            'title', setting.label,
            'key', _switch,
            'is-active', setting.value ? 'true' : 'false',
            'class', 'switch'
          ];
      }
      else
      {
        opera.postError(ui_strings.DRAGONFLY_INFO_MESSAGE + 
          "Can't attach switch to a setting that does not exist: " + _switch );
      }

    }
    return ret;
  }

  this.toolbarSeparator = function()
  {
    return ['toolbar-separator'];
  }

  this['window-statusbar'] = function()
  {
    return [ ['info']]
  }

  this.configButton = function(handler)
  {
    return ['button', 'type', 'button', 'handler', handler, 'title', ui_strings.S_BUTTON_LABEL_SETTINGS];
  }

  this.tabs = function(obj)
  {
    var ret = [];
    var tab = null, i = 0;
    for( ; tab = obj.tabs[i]; i++)
    {
      if( ! tab.disabled )
      {
        ret[ret.length] = this.tab(tab, obj.activeTab == tab.ref_id)
      }
    }
    return ret;
  }

  this.viewMenu = function()
  {
    return ( 
    [
      'ui-menu', 
      ['h2', ui_strings.M_VIEW_LABEL_VIEWS, 'handler', 'show-menu', 'tabindex', '1'], 
      'id', 'main-view-menu'
    ].concat(opera.attached ? ['class', 'attached'] : []) );
  }

  this['top-tabs'] = function(obj)
  {
    var ret = [];
    var tab = null, i = 0;
    // ret[ret.length] =  this.window_controls();
    for( ; tab = obj.tabs[i]; i++)
    {
      ret[ret.length] = this.top_tab(tab, obj.activeTab == tab.ref_id)
    }
    return ret;
  }

  this.window_controls = function()
  {
    return window.opera.attached ?
      this.window_controls_attached() :
      this.window_controls_detached();
  }

  this.window_controls_attached = function()
  {
    return [
      'window-controls',
      [
        [
          'button',
          'handler', 'toggle-console',
          'class', 'switch',
          'title', ui_strings.S_BUTTON_TOGGLE_CONSOLE
        ],
        [
          'toolbar-separator'
        ],
        [
          'button',
          'handler', 'toggle-settings-overlay',
          'class', 'switch',
          'title', ui_strings.S_BUTTON_TOGGLE_SETTINGS
        ],
        [
          'button',
          'handler', 'toggle-remote-debug-config-overlay',
          'class', 'switch',
          'title', ui_strings.S_BUTTON_TOGGLE_REMOTE_DEBUG
        ],
        [
          'toolbar-separator'
        ],
        window['cst-selects']['debugger-menu'].select_template(),
        [
          'button',
          'handler', 'top-window-toggle-attach',
          'class', 'switch attached',
          'title', ui_strings.S_SWITCH_DETACH_WINDOW
        ],
        [
          'button',
          'handler', 'top-window-close',
          'title', ui_strings.S_BUTTON_LABEL_CLOSE_WINDOW
        ],
        'class', 'attached',
        'id', 'window-controls-to-main-view'
      ]
    ];
  };

  this.window_controls_detached = function()
  {
    return [
      'window-controls',
      [
        window['cst-selects']['debugger-menu'].select_template(),
        [
         'button',
         'handler', 'reload-window',
         'title', ui_strings.S_BUTTON_LABEL_RELOAD_HOST
        ],
        [
         'button',
         'handler', 'top-window-toggle-attach',
         'class', 'switch',
         'title', ui_strings.S_SWITCH_ATTACH_WINDOW
        ],
      ],
      'id', 'window-controls-to-main-view'
    ];
  };

  this.window_controls_close = function()
  {
    if (window.opera.attached)
    {
      return (
      ['window-controls',
        ['button', 
          'handler', 'top-window-close',
          'title', ui_strings.S_BUTTON_LABEL_CLOSE_WINDOW
        ],
        'class', 'attached'
      ]);
    }
    return [];
  }

  this.settings = function(view_arr)
  {
    var 
      ret = ['settings-container'], 
      view_id = null, 
      view = null,
      i = 0;
    for( ; view_id = view_arr[i]; i++)
    {
      if(settings[view_id])
      {
        view = views[view_id];
        ret[ret.length] = this.setting(view_id, view.name, view.isvisible());
      }
    }
    return ret;
    
  }

  // this will be called as a method from a setting object

  this.setting = function(view_id, view_name, is_unfolded)
  {
    
    var ret = ['fieldset', self.settingsHeader(view_id, view_name, is_unfolded)];
    var setting = settings[view_id];
    var settings_map = setting.setting_map;
    var cat_name = '';
    // so far checkboxes, customSettings
    for( cat_name in settings_map ) 
    {
      ret[ret.length] = this[cat_name](setting, settings_map[cat_name]); 
    }
    return ret;
  }

  this.settingsHeader = function(view_id, view_name, is_unfolded)
  {
    return ['legend',
      view_name, 'handler', 'toggle-setting', 'view-id', view_id];
  }

  this.overlay = function(id)
  {
    return [
      "overlay-window",
        [
          ["overlay-arrow"],
          ["overlay-tabs"],
          ["overlay-content"]
        ]
      ];
  };

  this.settings_groups = function(groups)
  {
    var tabs = [];
    for (var i = 0, group; group = groups[i]; i++)
    {
      tabs.push(["tab", group.label, "group", group.group_name, "handler", "overlay-tab"]);
    }
    return tabs;
  };

  this.checkboxes = function(setting, checkbox_arr)
  {
    var checkboxes = ['checkboxes'], arr = null, view_id = '', key = '', i = 0;
    for( ; key = checkbox_arr[i]; i++)
    {
      if( key.indexOf('.') == -1 )
      {
        checkboxes[checkboxes.length] = 
          this.settingCheckbox
          (
            setting.view_id, 
            key, 
            setting.get(key), 
            setting.label_map[key]
          );
      }
      else
      {
        arr = key.split('.');
        view_id = arr[0];
        key = arr[1];
        if( settings[view_id] )
        {
          checkboxes[checkboxes.length] = 
            this.settingCheckbox
            (
              view_id, 
              key, 
              settings[view_id].get(key), 
              settings[view_id].label_map[key],
              setting.view_id
            );
        }
        else
        {
          opera.postError(ui_strings.DRAGONFLY_INFO_MESSAGE + 
            'failed in ui-templates checkboxes '+ arr + ' ' +setting.view_id);
        }
      }
    }
    return checkboxes;
  }

  this.customSettings = function(setting, template_name_arr)
  {
    var ret = [], name = null, i = 0, templates = setting.templates;
    for( ; name = template_name_arr[i]; i++)
    {
      ret[ret.length] = templates[name](setting);
    }
    return ret;
  }

  this.settingCheckbox = function(view_id, key, value, label, host)
  {
    var input = ['input', 
        'type', 'checkbox', 
        'handler', 'checkbox-setting', 
        'name', key,
        'view-id', view_id
      ];
    if( value )
    {
      input.splice(input.length, 0, 'checked', 'checked');
    }
    if( host )
    {
      input.splice(input.length, 0, 'host-view-id', host);
    }
    return ['checkbox', ['label', input, label ] ];
  }

  this._window = function(win)
  {
    return ['window',
        this.window_header(views[win.view_id].name),
        win.is_resizable ?
        [
          ['window-control', 'handler', 'window-scale-top-left'],
          ['window-control', 'handler', 'window-scale-top'],
          ['window-control', 'handler', 'window-scale-top-right'],
          ['window-control', 'handler', 'window-scale-right'],
          ['window-control', 'handler', 'window-scale-bottom'],
          ['window-control', 'handler', 'window-scale-bottom-right'],
          ['window-control', 'handler', 'window-scale-bottom-left'],
          ['window-control', 'handler', 'window-scale-left'],
        ] : [],
      'id', win.id, 
      'style', 
      'top:' + win.top + 'px;' +
      'left: ' + win.left + 'px;' +
      'width: '+ win.width + 'px;' +
      'height: ' + win.height + 'px;',
      'view_id', win.view_id
    ]
  }

  this.window_header = function(name)
  {
    return ['window-header',   
        ['window-control', 'handler', 'window-close'],
        name,
      'handler', 'window-move'
    ]
  }
}).apply(window.templates);
