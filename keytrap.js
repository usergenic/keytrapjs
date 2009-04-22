/*

  keytrap.js
  
  Enables relatively reliable capturing of keyboard state,
  for use with browser-based gaming or other applications
  looking to enable keyboard-shortcuts.

*/

// TODO: how best to apply this css rule via javascript?
// #keytrap::-moz-focus-inner { border: 0 !important; } 

/**
 * The constructor for a Keytrap object accepts an optional
 * argument to define the id of the element to use for the
 * hidden input element.  By default, 'keytrap' is the id.
 */
var Keytrap = function(input_id){
  var keytrap = this;
  keytrap.input_id = input_id ? input_id : 'keytrap';
  keytrap.enabled = false;
  $('body').append('<input id="'+keytrap.input_id+'" type="text" />');
  var $input = keytrap.$input = $('#'+keytrap.input_id);
  $input.css({
    'border'   : 'none',
    'color'    : 'white',
    'height'   : '1px',
    'position' : 'absolute',
    'top'      : '-100px',
    'width'    : '1px'
  }).attr('autocomplete','off');
  var $document = $(document);
  this.pressed = [];
  this.keydownCallbacks = [];
  this.keyupCallbacks = [];
  $document.click(function(){
    if(keytrap.enabled) $input.focus();
  });
  $document.keydown(function(e){
    if(keytrap.enabled){
      $input.focus();
      var code = (e.keyCode ? e.keyCode : e.which);
      if(keytrap.setPressed(code)){
        keytrap.fireKeydownCallbacks(code);
      }
      return false;
    }
    return true;
  });
  $document.keyup(function(e){
    if(keytrap.enabled){
      $input.focus();
      var code = (e.keyCode ? e.keyCode : e.which);
      if(keytrap.unsetPressed(code)){
        keytrap.fireKeyupCallbacks(code);
      }
      return false;
    }
    return true;
  });
  return this;
};

Keytrap.prototype={
  
  /**
   * Turns off this keytrap instance.
   */
  'disable' : function(){
    // TODO: need to decide if this default behavior makes sense.
    // this.releaseAllPressed();
    this.enabled = false;
  },
  
  /**
   * Turns on this keytrap instance.
   */
  'enable' : function(){
    this.enabled = true;
    this.$input.focus();
  },

  /**
   * Runs through all the registered keydownCallback functions,
   * until one of them returns false, or the last callback is
   * reached.
   */
  'fireKeydownCallbacks' : function(code){
    var callbacks = this.keydownCallbacks;
    for(var c=0; c<callbacks.length; c++){
      if(callbacks[c](code)==false) return false;
    }
    return true;
  },
  
  /**
   * Runs through all the registered keydownCallback functions,
   * until one of them returns false, or the last callback is
   * reached.
   */
  'fireKeyupCallbacks' : function(code){
    var callbacks = this.keyupCallbacks;
    for(var c=0; c<callbacks.length; c++){
      if(callbacks[c](code)==false) return false;
    }
    return true;
  },

  /**
   * Returns the state of a particular key (true=pressed | false=not)
   */
  'isPressed' : function(code){
    return !(this.pressed.indexOf(code.toString())==-1);
  },

  /**
   * Registers a function to be a keydown event callback.
   */
  'keydown' : function(callback){
    this.keydownCallbacks.push(callback);
    return true;
  },
  
  /**
   * Registers a function to be a keyup event callback.
   */
  'keyup' : function(callback){
    this.keyupCallbacks.push(callback);
    return true;
  },
  
  /**
   * Loops through all keys marked as pressed and registers them
   * as not pressed.  This can be useful if you are disabling the
   * keytrap and want to fire any keyup callbacks.
   */ 
  'releaseAllPressed' : function(){
    for(var k=0;k<this.pressed.length;k++){
      var code=this.pressed[k];
      unsetPressed(code);
    }
    return true;
  },
  
  /**
   * Registers a key as being pressed down.
   * Will return false if the key is already registered
   * as pressed down.  Otherwise returns true.
   */
  'setPressed' : function(code){
    if(this.isPressed(code)) return false;
    this.pressed.push(code.toString());
    return true;
  },
  
  /**
   * Registers a key as being not pressed down.
   * Will return false if the key is already registered
   * as not pressed down.  Otherwise, returns true.
   */
  'unsetPressed' : function(code){
    if(!this.isPressed(code)) return false;
    this.pressed.splice(this.pressed.indexOf(code.toString()),1);
    return true;
  }
  
};
