

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
        const id      = $(this).data('id');
        const target  = $('#select-image-modal').data('target');
        $(`.form-page-sidebar #${target}-id`).val(id);
        $(`.form-page-sidebar #page-${target}`).attr('src', $(this).attr('src'));
        $('#select-image-modal').modal('hide');
        $(`.form-page-sidebar #${target}-id`).parent('.form-group').find('.delete-image').show();
      });
    });
  };
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

  $('#cms-plugin-media-upload').dropzone({
    paramName: 'file[]',
    init: function() {
      this.on('complete', refreshmodal);
    },
  });
});
