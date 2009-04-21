/*

  keytrap.js
  
  Enables relatively reliable capturing of keyboard state,
  for use with browser-based gaming or other applications
  looking to enable keyboard-shortcuts.

*/

// TODO: how best to apply this css rule via javascript?
// #keytrap::-moz-focus-inner { border: 0 !important; } 

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
  $document.click(function(){
    if(keytrap.enabled) $input.focus();
  });
  $document.keydown(function(e){
    if(keytrap.enabled) {
      $input.focus();
      var code = (e.keyCode ? e.keyCode : e.which);
      if(keytrap.keydown) return keytrap.keydown(code);
    }
    return true;
  });
  return this;
};

Keytrap.prototype={
  'disable' : function(){
    this.enabled = false;
  },
  'enable'  : function(){
    this.enabled = true;
    this.$input.focus();
  }
};
