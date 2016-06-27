var labelBehavior = require("~/components/debug/b0").Behavior;
var layoutBehavior = require("~/components/debug/layout").Behavior;
var pageBehavior = require("~/joos-behavior/page").Behavior;

var Page = require("ui/page").Page;
var AbsoluteLayout = require("ui/layouts/absolute-layout").AbsoluteLayout;
var Label = require("ui/label").Label;

QUnit.test("Main bevavior module test", function(assert) {
    var newPage = new Page();
    newPage.style.joosBehavior = "~/joos-behavior/page";
    assert.equal(newPage.style.joosBehavior, "~/joos-behavior/page");

    var newLayout = new AbsoluteLayout();
    newLayout.style.joosBehavior = "~/components/debug/layout";
    assert.equal(newLayout.style.joosBehavior, "~/components/debug/layout");

    var newLabel = new Label();

    newLabel.style.joosBehavior = "~/components/debug/b0";
    assert.equal(newLabel.style.joosBehavior, "~/components/debug/b0");

    newLayout.addChild(newLabel);
    newPage.content = newLayout;

    assert.equal(newLabel.getBehavior(), null, "Label behavior was not initialized yet");
    assert.equal(newLayout.getBehavior(), null, "Layout behavior was not initialized yet");
    assert.equal(newPage.getBehavior(), null, "Page behavior was not initialized yet");

    // Cannot reproduce automaticaly, so i call it manualy {
    newLabel.onLoaded();
    newLayout.onLoaded();
    newPage.onLoaded();
    // } manualy

    var bLabel = newLabel.getBehavior();
    var bLayout = newLayout.getBehavior();
    var bPage = newPage.getBehavior();

    assert.equal(bLabel instanceof labelBehavior, true, "Label behavior must be initialized at this time");
    assert.equal(bLayout instanceof layoutBehavior, true, "Layout behavior must be initialized at this time");
    assert.equal(bPage instanceof pageBehavior, true, "Page behavior must be initialized at this time");

    assert.equal(bLabel.parent, bLayout, "Layout behavior is a parent for Label behavior");
    assert.equal(bLayout.parent, bPage, "Page behavior is a parent for Layout behavior");
    assert.equal(bPage.parent, null, "Page behavior has no parent");

    assert.equal(bLayout.children.length, 1, "Layout has one child");
    assert.equal(bLayout.children[0], bLabel, "Layout has one child and it is Label");

    assert.equal(bPage.children.length, 1, "Page has one child");
    assert.equal(bPage.children[0], bLayout, "Page has one child and it is Layout");

    newLayout.removeChild(newLabel);
    assert.equal(bLayout.children.length, 0, "Layout has no children after removeChild");
    assert.equal(newLabel.getBehavior(), null, "Label has no behavior after removeChild");
});
