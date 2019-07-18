

require('./object-types');
window.Dropzone.options.cmsPluginMediaUpload = false;

$(function() {

  $('.fa-caret-right').click(function() {
    const target = $(this).data('target');
    $(target).toggle();
    $(this).toggleClass('fa-caret-right');
    $(this).toggleClass('fa-caret-down');
  })

  if ($('#cms-plugin-redactor').length < 1) {
    return ;
  }

  const adminpath = $('#cms-plugin-redactor').data('adminpath');
  $R('#cms-plugin-redactor', {
    imageUpload:    adminpath + '/cms/medias/upload',
    imageResizable: true,
    imagePosition:  true,
    plugins:        [ 'table', 'alignment', 'video' ]
  });

  // select image modal
  const refreshmodal = function() {
    const adminpath = $('#cms-plugin-redactor').data('adminpath');
    $.get(adminpath + '/cms/medias/modal', function(html) {
      $('#select-image-modal .images').html(html);
      $('#select-image-modal .images img').click(function() {
        var id = $(this).data('id');
        $('.form-page-sidebar #image-id').val(id);
        $('.form-page-sidebar #page-image').attr('src', $(this).attr('src'));
        $('.form-page-sidebar #page-image').show();
        $('#select-image-modal').modal('hide');
      });
    });
  };
  $('#select-image-modal').on('shown.bs.modal', function () {
    refreshmodal();
  });

  $('#cms-plugin-media-upload').dropzone({
    paramName: 'file[]',
    init: function() {
      this.on('complete', refreshmodal);
    },
  });
});
