var JooS = require("joos-inheritance");

var view = require("ui/core/view");
var style = require("ui/styling/style");
var dependencyObservable = require("ui/core/dependency-observable");
var styleProperty = require("ui/styling/style-property");
var observable = require("data/observable");
var proxy = require("ui/core/proxy");

var Style = style.Style;
var View = view.View;
var Observable = observable.Observable;

var behaviorCounter = 0;
var behaviorLength = 0;
var behaviorList = { };

/**
 * @class Behavior
 * @extends JooS.Class
 */
var Behavior = JooS.Reflect(
    JooS.Class,
    /** @lends Behavior.prototype */
    {
        /**
         * Constructor
         *
         * @param {View} nsObject Nativescript View Object
         * @constructs Behavior
         */
        __constructor: function(nsObject) {
            /** @member {View} */
            this.nsObject = nsObject;
        },
        /**
         * Destructor
         *
         * @destructs Behavior
         */
        __destructor: function() {
            this.nsObject = null;
        }
    }
);

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
            var newBehavior = createBehavior(view, name);

            behaviorCounter++;
            behaviorLength++;
            behaviorList[behaviorCounter] = newBehavior;
            view.behaviorId = behaviorCounter;

            view.addEventListener("unloaded", viewUnloaded);
        }
    }
}

/**
 * Detach behavior
 *
 * @param {View} view View
 * @param {String} name Behavior name
 *
 * @return null
 */
function detachBehavior(view, name) {
    var behaviorId = view.behaviorId;

    if (behaviorId) {
        /** @type {Behavior} */
        var oldBehavior = behaviorList[behaviorId];
        if (oldBehavior) {
            oldBehavior.destroy();
            delete behaviorList[behaviorId];
            behaviorLength--;
        }

        view.behaviorId = undefined;
        view.removeEventListener("unloaded", viewUnloaded);
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

    var name = object.style.joosBehavior;
    if (name) {
        detachBehavior(object, name);
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
                viewObject.addEventListener("loaded", viewLoaded);
            }

            var newValue = data.newValue;
            if (newValue) {
                attachBehavior(viewObject, newValue);
            } else {
                viewObject.removeEventListener("loaded", viewLoaded);
            }

            return data;
        },
        /**
         * Validate value
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

                    result = !!module["Behavior"]; // && module.Behavior instanceof Behavior;
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

View.prototype.getBehavior = function() {
    // @todo ??
    // А нужно ли знать какой Behavior у элемента?
    // Или может использовать это в attachBehavior ??
};

exports.Behavior = Behavior;

exports.publicMorozov = function(name, value) {
    var result;
    switch (name) {
        case "behaviorById":
            result = behaviorList[value] || null;

            break;
        default:
            result = "-";
    }
    return result;
};
