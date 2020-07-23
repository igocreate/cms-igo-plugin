

window.Dropzone.options.cmsPluginMediaUpload = false;

$(function() {

  // select image modal
  const refreshmodal = function() {
    const adminpath = $('#cms-plugin-redactor').data('adminpath');
    $.get(adminpath + '/cms/medias/modal', function(html) {
      $('#select-image-modal .images').html(html);
      $('#select-image-modal .images img').click(function() {
        const id      = $(this).data('id');
        const target  = $('#select-image-modal').data('target');
        $(`.form-page-sidebar #${target}-id`).val(id);
        $(`.form-page-sidebar #page-${target}`).attr('src', $(this).attr('src'));
        $('#select-image-modal').modal('hide');
        $(`.form-page-sidebar #${target}-id`).parent('.form-group').find('.delete-image').show();
      });
    });
  };
  
  $('#cms-plugin-media-upload').dropzone({
    paramName: 'file[]',
    init: function() {
      this.on('complete', refreshmodal);
    },
  });
});
