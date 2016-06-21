var Behavior = require("~/joos-behavior");
var Observable = require("data/observable").Observable;
var Label = require("ui/label").Label;
var View = require("ui/core/view").View;
var dialogs = require("ui/dialogs");

/** @type {Label|View} */
var label;
/** @type {Observable} */
var bindingContext;

function setInfo(num, value) {
    bindingContext.set(num, value);
}

function collectInfo() {
    /** @type {b0|b1|b2} */
    var component = label.getBehavior();

    setInfo("info0", label.className);
    if (component) {
        setInfo("info1", component.name);
    } else {
        setInfo("info1", "-");
    }
}

function onLoaded(args) {
    /** @type {Page|ContentView|View} */
    var page = args.object;
    var layout = page.getViewById("container");

    label = page.getViewById("component");

    bindingContext = new Observable();

    bindingContext.attachB1_className = function() {
        label.className = "tap-me b1";
        collectInfo();
    };

    bindingContext.attachB2_className = function() {
        label.className = "tap-me b2";
        collectInfo();
    };

    bindingContext.detach_className = function() {
        label.className = "tap-me";
        collectInfo();
    };

    bindingContext.attachB1_style = function() {
        label.style.joosBehavior = "~/shared/b1";
        collectInfo();
    };

    bindingContext.attachB2_style = function() {
        label.style.joosBehavior = "~/shared/b2";
        collectInfo();
    };

    bindingContext.detach_style = function() {
        label.style.joosBehavior = undefined;
        collectInfo();
    };

    bindingContext.child_add = function() {
        if (!label.isLoaded) {
            layout.addChild(label);
            collectInfo();
        } else {
            dialogs.alert("Tap-me was already added");
        }
    };

    bindingContext.child_remove = function() {
        if (label.isLoaded) {
            layout.removeChild(label);
            collectInfo();
        } else {
            dialogs.alert("Tap-me was already removed");
        }
    };

    collectInfo();

    page.bindingContext = bindingContext;
}

exports.onLoaded = onLoaded;
