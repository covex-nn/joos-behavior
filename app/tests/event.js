var BehaviorEvent = require("~/joos-behavior/event");

QUnit.test("Behavior event test", function(assert) {
    var data = { a: 1, b: 2 };
    var event = new BehaviorEvent("qwerty", data);

    assert.equal(
        event.getName(), "qwerty", "Qwerty event name"
    );
    assert.equal(
        event.getData(), data, "Event equal to local var"
    );
    assert.deepEqual(
        event.getEventData(), { a: 1, b: 2, eventName: "qwerty" }, "Observable event data format"
    );
});
