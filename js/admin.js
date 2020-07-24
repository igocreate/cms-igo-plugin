

window.Dropzone = require('dropzone');

require('./redactor.js');
require('./dropzone.js');

require('./object-types.js');


$(function() {

  $('.fa-caret-right').click(function() {
    const target = $(this).data('target');
    $(target).toggle();
    $(this).toggleClass('fa-caret-right');
    $(this).toggleClass('fa-caret-down');
  })

  $('.select-image').click(function(e) {
    $('#select-image-modal').data('target', $(this).data('target'));
    $('#select-image-modal').modal('show');
    refreshmodal();
    return false;
  });

  $('.delete-image').click(function(e) {
    const target = $(this).data('target');
    $(`.form-page-sidebar #${target}-id`).val(null);
    $(`.form-page-sidebar #page-${target}`).attr('src', '/cms/empty.png');
    $(this).hide();
    return false;
  });

  $('select#page_type').change(function() {
    const page_type = $('select#page_type option:selected').val();
    window.location.href = `?page_type=${page_type}`;
  });

});
