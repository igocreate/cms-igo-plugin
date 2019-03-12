

$(function() {

  if ($('#cms-plugin-redactor').length < 1) {
    return ;
  }

  const adminpath = $('#cms-plugin-redactor').data('adminpath');
  $('#cms-plugin-redactor').redactor({
    imageUpload:    adminpath + '/cms/medias/upload',
    imageResizable: true,
    imagePosition:  true,
    plugins:        [ 'table', 'alignment' ]
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

  $("#cmsPluginMediaUpload").dropzone({
    init: function() {
      this.on("complete",   refreshmodal);
    }
  });
});
