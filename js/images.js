

window.Dropzone.options.cmsPluginMediaUpload = false;

$(function() {

  $('body').on('click', '.select-image', function(e) {
    e.preventDefault();
    $('#select-image-modal').data('target', $(this).closest('.form-image'));
    $('#select-image-modal').modal('show');
    window.refreshmodal();
    return false;
  });

  $('body').on('click', '.delete-image', function(e) {
    e.preventDefault();
    const target = $(this).closest('.form-image');
    target.find('input[type=hidden]').val(null);
    target.find('img.image').attr('src', '/cms/empty.png');
    $(this).hide();
    return false;
  });
  
  // select image modal
  window.refreshmodal = function() {
    const adminpath = $('#cms-plugin-redactor').data('adminpath');
    $.get(adminpath + '/cms/medias/modal', function(html) {
      $('#select-image-modal .images').html(html);
      $('#select-image-modal .images img').click(function() {
        const target  = $('#select-image-modal').data('target');
        ['id', 'uuid', 'filename'].forEach(function(attr) {
          target.find(`input[type=hidden].image-${attr}`).val($(this).data(attr));
        })
        target.find('img.image').attr('src', $(this).attr('src'));
        target.find('.delete-image').show();
        $('#select-image-modal').modal('hide');
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
