// THREEx.KeyboardState.js keep the current state of the keyboard.
// It is possible to query it at any time. No need of an event.
// This is particularly convenient in loop driven case, like in
// 3D demos or games.
//
// # Usage
//
// **Step 1**: Create the object
//
// ```var keyboard	= new THREEx.KeyboardState();```
//
// **Step 2**: Query the keyboard state
//
// This will return true if shift and A are pressed, false otherwise
//
// ```keyboard.pressed("shift+A")```
//
// **Step 3**: Stop listening to the keyboard
//
// ```keyboard.destroy()```
//
// NOTE: this library may be nice as standaline. independant from three.js
// - rename it keyboardForGame
//
// # Code
//

var THREEx = THREEx || {};

THREEx.KeyboardState = function () {
    this.keyCodes = {};
    this.modifiers = {};

    var self = this;
    this._onKeyDown = function (event) {
        self._onKeyChange(event, true);
    }
    this._onKeyUp = function (event) {
        self._onKeyChange(event, false);
    }

    document.addEventListener('keydown', this._onKeyDown, false);
    document.addEventListener('keyup', this._onKeyUp, false);
}

THREEx.KeyboardState.prototype.destroy = function () {
    // unbind keyEvents
    document.removeEventListener("keydown", this._onKeyDown, false);
    document.removeEventListener("keyup", this._onKeyUp, false);
}

THREEx.KeyboardState.MODIFIERS = ['shift', 'ctrl', 'alt', 'meta'];
THREEx.KeyboardState.ALIAS = {
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'space': 32,
    'pageup': 33,
    'pagedown': 34,
    'tab': 9
};

// pressed: keydown--> true, keyup --> false
THREEx.KeyboardState.prototype._onKeyChange = function (event, pressed) {
    var keyCode = event.keyCode;
    this.keyCodes[keyCode] = pressed;

    this.modifiers['shift'] = evnet.shiftKey;
    this.modifiers['ctrl'] = evnet.ctrlKey;
    this.modifiers['alt'] = evnet.altKey;
    this.modifiers['meta'] = evnet.metaKey;
}

THREEx.KeyboardState.prototype.pressed = function (keyDesc) {
    // pressed param是要查询的按键组合： 例如 ctrl + a
    var keys = keyDesc.split("+");

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var pressed;

        if (THREEx.KeyboardState.MODIFIERS.indexOf( key ) !== -1 ) {
            pressed = this.modifiers[key];
        }
        else if (Object.keys(THREEXx.KeyboardState.ALIAS).indexOf(key)) {
            pressed = this.keyCodes[THREEx.KeyboardState.ALIAS[key]];
        }
        else {
            pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
        }
        if (!pressed) return false;
    };
    return true;
}


