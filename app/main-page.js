var Behavior = require("~/joos-behavior");
var Observable = require("data/observable").Observable;
var Label = require("ui/label").Label;

/** @type {Label} */
var label;
/** @type {Observable} */
var bindingContext;

function setInfo(num, value) {
    bindingContext.set(num, value);
}

function collectInfo() {
    /** @type {b0|b1|b2} */
    var component = Behavior.publicMorozov("behaviorById", label.behaviorId);

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

    label = page.getViewById("component");

    bindingContext = new Observable();

    bindingContext.attachB1_className = function() {
        label.className = "title b1";
        collectInfo();
    };

    bindingContext.attachB2_className = function() {
        label.className = "title b2";
        collectInfo();
    };

    bindingContext.detach_className = function() {
        label.className = "title";
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

    collectInfo();

    page.bindingContext = bindingContext;
}

exports.onLoaded = onLoaded;
