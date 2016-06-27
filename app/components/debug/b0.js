var JooS = require("joos-inheritance");
var Behavior = require("~/joos-behavior").Behavior;
var dialogs = require("ui/dialogs");
var Layout = require("./layout").Behavior;

/**
 * @class b0
 * @extends Behavior
 */
var b0 = JooS.Reflect(
    Behavior,
    /** @lends b0.prototype */
    {
        onTap: function() {
            dialogs.alert("I am a " + this.name + "-behavior!");
            console.log(this.parent);
        },
        __constructor: function(view) {
            this.__constructor.__parent(view);

            this.name = "~/components/debug/b0";

            //this.nsObject.addEventListener("tap", this.onTap, this);
        },
        __destructor: function() {
            //this.nsObject.removeEventListener("tap", this.onTap, this);
            
            this.__destructor.__parent();
        },
        getParentType: function() {
            return "TestLayout";
        }
    }
);

exports.Behavior = b0;
