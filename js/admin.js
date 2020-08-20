

window.Dropzone = require('dropzone');

require('./redactor.js');
require('./images.js');

require('./object-types.js');


$(function() {

  $('.fa-caret-right').click(function() {
    const target = $(this).data('target');
    $(target).toggle();
    $(this).toggleClass('fa-caret-right');
    $(this).toggleClass('fa-caret-down');
  })

  $('select#page_type').change(function() {
    const page_type = $('select#page_type option:selected').val();
    window.location.href = `?page_type=${page_type}`;
  });
  
  // bootstrap custom file input
  const setFileInputLabel = function() {
    const files = $(this).prop('files')
    const label = $.map(files, val => val.name).join(', ');
    $(this).next('.custom-file-label').text(label);
  };
  $('.custom-file-input').on('change', setFileInputLabel);

});
