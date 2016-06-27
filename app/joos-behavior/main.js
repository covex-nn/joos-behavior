var JooS = require("joos-inheritance");
var BehaviorEvent = require("./event");

var view = require("ui/core/view");
var style = require("ui/styling/style");
var page = require("ui/page");
var dependencyObservable = require("ui/core/dependency-observable");
var styleProperty = require("ui/styling/style-property");
var observable = require("data/observable");
var proxy = require("ui/core/proxy");

var View = view.View;
var Style = style.Style;
var Page = page.Page;
var Observable = observable.Observable;

var behaviorCounter = 0;
var behaviorList = { };

/**
 * @class Behavior
 * @extends Observable
 */
var Behavior = JooS.Reflect(
    Observable,
    /** @lends Behavior.prototype */
    {
        /**
         * Constructor
         *
         * @param {View} nsObject Nativescript View Object
         * @constructs Behavior
         */
        __constructor: function(nsObject) {
            this.__constructor.__parent();
            /** @member {View} */
            this.nsObject = nsObject;
            /** @member {Boolean} */
            this.isRegistered = false;
            /** @member {Behavior} */
            this.parent = null;
            /** @member {Behavior[]} */
            this.children = [ ];

            this.addEventListener(Behavior.loadedChildEvent, this.onLoadedChild, this);
            this.addEventListener(Behavior.unloadedChildEvent, this.onUnloadedChild, this);
        },
        /**
         * Destructor
         *
         * @destructs Behavior
         */
        __destructor: function() {
            if (this.parent) {
                var eventData = this.createUnloadedChildEvent().getEventData();
                this.parent.notify(eventData);
            }
            this.nsObject = null;
        },
        /**
         * Get parent type name
         *
         * @returns {String}
         */
        getParentType: function() {
            return "Page";
        },
        /**
         * Get self type name
         *
         * @returns {String}
         */
        getType: function() {
            return "Behavior";
        },
        /**
         * Get parent Behavior
         *
         * @return {Behavior|null}
         * @private
         */
        getParent: function() {
            /** @type {View} */
            var parent = this.nsObject.parent;
            /** @type {Behavior} */
            var parentBehavior;
            /** @type {Function} */
            var parentType = this.getParentType();

            var counter = 128;
            while (parent && counter) {
                parentBehavior = parent.getBehavior();
                if (parentBehavior && parentBehavior.getType() == parentType) {
                    return parentBehavior;
                }
                parent = parent.parent;
                counter--;
            }

            return null;
        },
        /**
         * onLoadedChild event handler
         *
         * @param {Object} eventData Event data
         *
         * @returns {boolean}
         * @private
         */
        onLoadedChild: function(eventData) {
            this.children.push(eventData.object);
        },
        /**
         * PageBehavior calls this method after initialization
         *
         * @return null
         */
        onRegistered: function() {
            this.isRegistered = true;

            this.parent = this.getParent();

            if (this.parent) {
                var eventData = this.createLoadedChildEvent().getEventData();
                this.parent.notify(eventData);
            }
        },
        /**
         * onLoadedChild event handler
         *
         * @param {Object} eventData Event data
         *
         * @returns {boolean}
         * @private
         */
        onUnloadedChild: function(eventData) {
            var index = this.children.indexOf(eventData.object);
            if (index >= 0) {
                this.children.splice(index, 1);
            }
        },
        /**
         * Create loadedChild event
         *
         * @returns {BehaviorEvent}
         * @private
         */
        createLoadedChildEvent: function() {
            return new BehaviorEvent(
                Behavior.loadedChildEvent,
                {
                    object: this
                }
            );
        },
        /**
         * Create unloadedChild event
         *
         * @returns {BehaviorEvent}
         * @private
         */
        createUnloadedChildEvent: function() {
            return new BehaviorEvent(
                Behavior.unloadedChildEvent,
                {
                    object: this
                }
            );
        }
    }
);

Behavior.loadedChildEvent = "loadedChild";
Behavior.unloadedChildEvent = "unloadedChild";

/**
 * Trim module name and remove " and '
 *
 * @param {String} value Module name
 *
 * @returns {String}
 */
Behavior.convertCssValue = function(value) {
    return value
        .toString()
        .trim()
        .replace(/^"/, "")
        .replace(/"$/, "")
        .replace(/^'/, "")
        .replace(/'$/, "");
};

/**
 * Create behavior by name
 *
 * @param {View}   view View
 * @param {String} name Behavior name
 *
 * @return null
 */
function createBehavior(view, name) {
    var module = require(name);

    return new module.Behavior(view);
}

/**
 * Attach behavior
 *
 * @param {View} view View
 * @param {String} name Behavior name
 *
 * @return null
 */
function attachBehavior(view, name) {
    if (view.isLoaded) {
        if (!view.behaviorId) {
            behaviorCounter++;
            view.behaviorId = behaviorCounter;
            behaviorList[behaviorCounter] = createBehavior(view, name);

            if (view.page) {
                view.page.registerBehavior(behaviorList[behaviorCounter]);
            }

            view.addEventListener(View.unloadedEvent, viewUnloaded);
        }
    }
}

/**
 * Detach behavior
 *
 * @param {View} view View
 *
 * @return null
 */
function detachBehavior(view) {
    var behaviorId = view.behaviorId;
    view.removeEventListener(View.unloadedEvent, viewUnloaded);

    if (behaviorId) {
        /** @type {Behavior} */
        var oldBehavior = behaviorList[behaviorId];
        if (oldBehavior) {
            oldBehavior.__destructor();
            delete behaviorList[behaviorId];
        }
        view.behaviorId = undefined;
    }
}

/**
 * View 'loaded' callback
 *
 * @param {EventData} data Event data
 *
 * @return null
 */
function viewLoaded(data) {
    /** @type {View} */
    var object;
    object = data.object;

    var name = object.style.joosBehavior;
    if (name) {
        attachBehavior(object, name);
    }
}

/**
 * View 'unloaded' callback
 *
 * @param {EventData} data Event data
 *
 * @return null
 */
function viewUnloaded(data) {
    /** @type {View|Observable} */
    var object;
    object = data.object;

    if (object.behaviorId) {
        detachBehavior(object);
    }
}

style.joosBehaviorProperty = new styleProperty.Property(
    "joosBehavior",
    "joos-behavior",
    new dependencyObservable.PropertyMetadata(
        false,
        dependencyObservable.PropertyMetadataSettings.None,
        /**
         * onChange property value event callback
         *
         * @param {PropertyChangeData} data onChanged Event data
         *
         * @return {*}
         */
        function(data) {
            /** @type {Style} */
            var object;
            object = data.object;

            /** @type {View|Observable} */
            var viewObject;
            viewObject = object._view;

            var oldValue = data.oldValue;
            if (oldValue) {
                detachBehavior(viewObject, oldValue);
            } else {
                viewObject.addEventListener(View.loadedEvent, viewLoaded);
            }

            var newValue = data.newValue;
            if (newValue) {
                attachBehavior(viewObject, newValue);
            } else {
                viewObject.removeEventListener(View.loadedEvent, viewLoaded);
            }

            return data;
        },
        /**
         * Validate module
         *
         * @param {String} value Value
         *
         * @return {Boolean}
         */
        function(value) {
            var result;
            try {
                if (value == undefined) {
                    result = true;
                } else {
                    value = Behavior.convertCssValue(value);
                    var module = require(value);
                    result = !!module["Behavior"];
                }
            } catch (e) {
                result = false;
            }

            return result;
        }
    ),
    /**
     * Convert value to correct value
     *
     * @param {String} value Value
     *
     * @return {String}
     */
    function(value) {
        var result;
        if (value != undefined) {
            result = Behavior.convertCssValue(value);
        }
        return result;
    }
);

view.ViewStyler.setJoosBehaviorProperty = function (view, newValue) {
    view.joosBehavior = newValue;
};

view.ViewStyler.resetJoosBehaviorProperty = function (view, nativeValue) {
    view.joosBehavior = nativeValue;
};

view.ViewStyler.getJoosBehaviorProperty = function (view) {
    return view.joosBehavior;
};

Object.defineProperty(
    Style.prototype,
    "joosBehavior",
    {
        get: function() {
            return this._getValue(style.joosBehaviorProperty);
        },
        set: function(value) {
            this._setValue(style.joosBehaviorProperty, value);
        },
        enumerable: true,
        configurable: true
    }
);

style.registerHandler(
    style.joosBehaviorProperty,
    new style.StylePropertyChangedHandler(
        view.ViewStyler.setJoosBehaviorProperty,
        view.ViewStyler.resetJoosBehaviorProperty,
        view.ViewStyler.getJoosBehaviorProperty
    )
);

View.behaviorIdProperty = new dependencyObservable.Property(
    "behaviorId",
    "View",
    new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None)
);

Object.defineProperty(
    View.prototype,
    "behaviorId", {
    get: function () {
        return this._getValue(View.behaviorIdProperty);
    },
    set: function (value) {
        this._setValue(View.behaviorIdProperty, value);
    },
    enumerable: true,
    configurable: true
});

/**
 * Get view's behavior if attached
 * 
 * @return {Behavior}
 */
View.prototype.getBehavior = function() {
    /** @type {Behavior} */
    var result;
    if (this.behaviorId) {
        result = behaviorList[this.behaviorId];
    } else {
        result = null;
    }
    return result;
};

/**
 * Register behavior
 *
 * @param {Behavior} Behavior Behavior
 *
 * @return null
 */
Page.prototype.registerBehavior = function(Behavior) {
    /** @type {Behavior} */
    var object = this.getBehavior();
    if (object && object.isRegistered) {
        Behavior.onRegistered();
    } else {
        if (!this["registerQueue"]) {
            /** @type Behavior[] */
            this.registerQueue = [ Behavior ];
        } else {
            this.registerQueue.push(Behavior);
        }

        if (Behavior.nsObject == this) {
            /** @type {Behavior} */
            var item;
            while (this.registerQueue.length) {
                item = this.registerQueue.pop();
                item.onRegistered();
            }
        }
    }
};

/**
 * @class PageBehavior
 * @extends Behavior
 */
var PageBehavior = JooS.Reflect(
    Behavior,
    /** @lends PageBehavior.prototype */
    {
        __constructor: function(nsObject) {
            this.__constructor.__parent(nsObject);
        },
        /**
         * Get self type name
         *
         * @returns {String}
         */
        getType: function() {
            return "Page";
        }
    }
);

exports.Behavior = Behavior;
exports.BehaviorEvent = BehaviorEvent;
exports.PageBehavior = PageBehavior;
