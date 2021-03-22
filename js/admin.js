

window.Dropzone = window.Dropzone || require('dropzone');

require('./redactor.js');
require('./images.js');
require('./repeater.js');
require('./iconpicker.js');

require('./object-types.js');


$(function() {

  $('.fa-caret-right').on('click', function() {
    const target = $(this).data('target');
    $(target).toggle();
    $(this).toggleClass('fa-caret-right');
    $(this).toggleClass('fa-caret-down');
  })

  $('select#page_type').on('change', function() {
    const page_type = $('select#page_type option:selected').val();
    window.location.href = '?page_type=' + page_type;
  });
  
  // bootstrap custom file input
  const setFileInputLabel = function() {
    const files = $(this).prop('files')
    const label = $.map(files, function(val) { return val.name }).join(', ');
    $(this).next('.custom-file-label').text(label);
  };
  $('.custom-file-input').on('change', setFileInputLabel);

  // internal iconpicker
  $('.iconpicker').iconpicker({});

});
