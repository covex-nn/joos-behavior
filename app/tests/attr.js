var Behavior = require("~/joos-behavior").Behavior;
var Label = require("ui/label").Label;

QUnit.test("View attributes test", function(assert) {
    var label = new Label();
    label.text = "asdf";

    var obj = new Behavior(label);

    assert.equal(obj.attr("text"), "asdf", "Initial .text value");
    obj.attr("text", "zxcv");
    assert.equal(obj.attr("text"), "zxcv", "New .text value");

    label.qwerty = "111";
    obj.removeAttr("qwerty");
    assert.equal(label["qwerty"], undefined, "No qwerty attribute");

    label.qwerty = "222";
    obj.attr("qwerty", null);
    assert.equal(label["qwerty"], undefined, "No qwerty attribute again");
});
