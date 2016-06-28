var Behavior = require("~/joos-behavior").Behavior;
var Label = require("ui/label").Label;

QUnit.test("className test", function(assert) {
    var label = new Label();
    label.className = "class1";

    var obj = new Behavior(label);

    assert.ok(obj.hasClass("class1"), "Has class1");

    obj.addClass("class2");
    assert.equal(label.className, "class1 class2", "className value with class2");
    assert.ok(obj.hasClass("class1"), "Still has class1");
    assert.ok(obj.hasClass("class2"), "Has class2");

    obj.removeClass("class1");
    assert.equal(label.className, "class2", "className value with only class2");

    obj.toggleClass("class1");
    assert.equal(label.className, "class2 class1", "className value with class2 and class1");
    obj.toggleClass("class2");
    assert.equal(label.className, "class1", "className back to class1");
});
