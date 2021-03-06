# Behavioral components for NativeScript Views

[![Build Status](https://travis-ci.org/covex-nn/joos-behavior.svg?branch=master)](https://travis-ci.org/covex-nn/joos-behavior)
[![dependency status](https://david-dm.org/covex-nn/joos-behavior.svg)](https://david-dm.org/covex-nn/joos-behavior)
[![devDependency Status](https://david-dm.org/covex-nn/joos-behavior/dev-status.svg)](https://david-dm.org/covex-nn/joos-behavior#info=devDependencies) 
[![npm version](https://badge.fury.io/js/nativescript-behavior.svg)](https://badge.fury.io/js/nativescript-behavior)

Package implements [Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern) to assign behavioral algorithms to [NativeScript Views](https://docs.nativescript.org/ui/ui-views)

## Goal

The main goal of a project is to separate development process by two stages: desing and coding.

## Demo

This repository is a source for npm package [nativescript-behavior](https://www.npmjs.com/package/nativescript-behavior) and a demo NatiteScript application.
 
Demo App shows how to unlock the NativeScript clicker achievement with Behavior components and without Model-View-ViewModel.

## Installation 

```bash
$ npm install --save joos-inheritance
$ npm install --save nativescript-behavior
```

## Initialize module

To initialize the module you must require() it in your [app/app.js](https://github.com/covex-nn/joos-behavior/blob/master/app/app.js):

```javascript
require("nativescript-behavior");
```

## Create behavioral algorithm

Algorithm is a _ConcreteStrategy_ in terms of [Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern). It must be a "subclass" of main **Behavior** "class". So, instance of _ConcreteBehavior_ must be instance of main _Behavior_ class.

Concrete behavior code must be in it's own file, it must be available for _require()_ and module must export algorithm in **exports.Behavior** property.

```javascript
var JooS = require("joos-inheritance");
var Behavior = require("nativescript-behavior").Behavior;

/**
 * @class ConcreteBehavior
 * @extends Behavior
 */
var ConcreteBehavior = JooS.Reflect(
    Behavior,
    /** @lends ConcreteBehavior.prototype */
    {
        onTap: function() {
            console.log(this.someProperty);
        },
        __constructor: function(contextView) {
            this.__constructor.__parent(contextView);
            this.someProperty = "someValue";
            this.nsObject.addEventListener("tap", this.onTap, this);
        },
        __destructor: function() {
            this.nsObject.removeEventListener("tap", this.onTap, this);
            this.__destructor.__parent();
        }
    }
);

exports.Behavior = ConcreteBehavior;
```

or

```javascript
var Behavior = require("nativescript-behavior").Behavior;

var ConcreteBehavior = (function (_super) {
    __extends(ConcreteBehavior, _super);
    function ConcreteBehavior() {
        _super.apply(this, arguments);
        this.someProperty = "someValue";
        this.nsObject.addEventListener("tap", this.onTap, this);
    }

    ConcreteBehavior.prototype.onTap = function() {
        console.log(this.someProperty);
    };

    ConcreteBehavior.prototype.__destructor = function() {
        this.nsObject.removeEventListener("tap", this.onTap, this);
        _super.prototype.__destructor.apply(this, arguments);
    };

    return ConcreteBehavior;
})(Behavior);

exports.Behavior = ConcreteBehavior;
```

Put this code in **~/components/concreteBehavior.js** for example

## Create new CSS class for a view-with-behavior

Use a custom ``joos-behavior`` style property. It was implemented in this package to assign behaviors to views.

```css
Page {
  joos-behavior: "nativescript-behavior/lib/page"
}

.concrete-behavior {
  joos-behavior: "~/components/concreteBehavior";
}
```

Put this code in your [/app/app.css](https://github.com/covex-nn/joos-behavior/blob/master/app/app.css) file

Also, you can assign behavior via ``concreteView.style.joosBehavior = "~/components/concreteBehavior.js"`` or ``concreteView.joosBehavior = "~/components/concreteBehavior.js"``

## Assign class to a view

```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd">
  <StackLayout>
    <Button class="concrete-behavior" text="Tap me!" />
  </StackLayout>
</Page>
```

Behavior will be attached immediately after setting ``joosBehavior`` style property and detached after setting this property to ``undefined``

Also, behavior will be detached after ``Layout.removeChild(contextView);`` and attached back after ``Layout.addChild(contextView);``

## Tap the button

That's it =)

## Features

* Behaviors have parents and can interact with its siblings with `this.parent.notify(eventData)` method.
* Behaviors can add/remove/toggle className of it's nsObject and set/remove attributes value
