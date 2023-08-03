/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
! function() {
    var t = !1;
    window.JQClass = function() {}, JQClass.classes = {}, JQClass.extend = function e(n) {
        function a() {
            !t && this._init && this._init.apply(this, arguments)
        }
        var s = this.prototype;
        t = !0;
        var i = new this;
        t = !1;
        for (var r in n) i[r] = "function" == typeof n[r] && "function" == typeof s[r] ? function(t, e) {
            return function() {
                var n = this._super;
                this._super = function(e) {
                    return s[t].apply(this, e || [])
                };
                var a = e.apply(this, arguments);
                return this._super = n, a
            }
        }(r, n[r]) : n[r];
        return a.prototype = i, a.prototype.constructor = a, a.extend = e, a
    }
}(),
function($) {
    function camelCase(t) {
        return t.replace(/-([a-z])/g, function(t, e) {
            return e.toUpperCase()
        })
    }
    JQClass.classes.JQPlugin = JQClass.extend({
        name: "plugin",
        defaultOptions: {},
        regionalOptions: {},
        _getters: [],
        _getMarker: function() {
            return "is-" + this.name
        },
        _init: function() {
            $.extend(this.defaultOptions, this.regionalOptions && this.regionalOptions[""] || {});
            var t = camelCase(this.name);
            $[t] = this, $.fn[t] = function(e) {
                var n = Array.prototype.slice.call(arguments, 1);
                return $[t]._isNotChained(e, n) ? $[t][e].apply($[t], [this[0]].concat(n)) : this.each(function() {
                    if ("string" == typeof e) {
                        if ("_" === e[0] || !$[t][e]) throw "Unknown method: " + e;
                        $[t][e].apply($[t], [this].concat(n))
                    } else $[t]._attach(this, e)
                })
            }
        },
        setDefaults: function(t) {
            $.extend(this.defaultOptions, t || {})
        },
        _isNotChained: function(t, e) {
            return "option" === t && (0 === e.length || 1 === e.length && "string" == typeof e[0]) ? !0 : $.inArray(t, this._getters) > -1
        },
        _attach: function(t, e) {
            if (t = $(t), !t.hasClass(this._getMarker())) {
                t.addClass(this._getMarker()), e = $.extend({}, this.defaultOptions, this._getMetadata(t), e || {});
                var n = $.extend({
                    name: this.name,
                    elem: t,
                    options: e
                }, this._instSettings(t, e));
                t.data(this.name, n), this._postAttach(t, n), this.option(t, e)
            }
        },
        _instSettings: function(t, e) {
            return {}
        },
        _postAttach: function(t, e) {},
        _getMetadata: function(elem) {
            try {
                var data = elem.data(this.name.toLowerCase()) || "";
                data = data.replace(/'/g, '"'), data = data.replace(/([a-zA-Z0-9]+):/g, function(t, e, n) {
                    var a = data.substring(0, n).match(/"/g);
                    return a && a.length % 2 !== 0 ? e + ":" : '"' + e + '":'
                }), data = $.parseJSON("{" + data + "}");
                for (var name in data) {
                    var value = data[name];
                    "string" == typeof value && value.match(/^new Date\((.*)\)$/) && (data[name] = eval(value))
                }
                return data
            } catch (e) {
                return {}
            }
        },
        _getInst: function(t) {
            return $(t).data(this.name) || {}
        },
        option: function(t, e, n) {
            t = $(t);
            var a = t.data(this.name);
            if (!e || "string" == typeof e && null == n) {
                var s = (a || {}).options;
                return s && e ? s[e] : s
            }
            if (t.hasClass(this._getMarker())) {
                var s = e || {};
                "string" == typeof e && (s = {}, s[e] = n), this._optionsChanged(t, a, s), $.extend(a.options, s)
            }
        },
        _optionsChanged: function(t, e, n) {},
        destroy: function(t) {
            t = $(t), t.hasClass(this._getMarker()) && (this._preDestroy(t, this._getInst(t)), t.removeData(this.name).removeClass(this._getMarker()))
        },
        _preDestroy: function(t, e) {}
    }), $.JQPlugin = {
        createPlugin: function(t, e) {
            "object" == typeof t && (e = t, t = "JQPlugin"), t = camelCase(t);
            var n = camelCase(e.name);
            JQClass.classes[n] = JQClass.classes[t].extend(e), new JQClass.classes[n]
        }
    }
}(jQuery);