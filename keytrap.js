/*

  keytrap.js
  
  Enables relatively reliable capturing of keyboard state,
  for use with browser-based gaming or other applications
  looking to enable keyboard-shortcuts.

*/

// TODO: how best to apply this css rule via javascript?
// #keytrap::-moz-focus-inner { border: 0 !important; } 

var Keytrap = function(id){
  if(!id) id='keytrap';
  this.id = id;
  var $document = $(document);
  $document.append('<input id="'+id+'" type="text" />');
  var $keytrap = $('#'+id);
  $keytrap.css({
    'border'   : 'none',
    'color'    : 'white',
    'height'   : '1px',
    'position' : 'absolute',
    'top'      : '-100px',
    'width'    : '1px'
  }).attr('autocomplete','off');
  $document.click(function(){
    if(this.on) $keytrap.focus();
  });
  $document.keydown(function(e){
    if(this.on) {
      $keytrap.focus();
      var code = (e.keyCode ? e.keyCode : e.which);
      if(this.keydown) return this.keydown(code);
    }
    return true;
  })
};

Keytrap.prototype={
  'disable' : function(){
    this.on = false;
  },
  'enable'  : function(){
    this.on = true;
    $('#'+id).focus();
  },
  'on' : false
};
