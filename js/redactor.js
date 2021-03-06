
$(function() {

  if ($('#cms-plugin-redactor').length < 1) {
    return ;
  }

  const adminpath = $('#cms-plugin-redactor').data('adminpath');
  $R('#cms-plugin-redactor', {
    toolbarFixedTopOffset: 20,
    imageUpload:    adminpath + '/cms/medias/upload',
    imageResizable: true,
    imagePosition:  true,
    linkNewTab:     true,
    plugins:        [ 'table', 'alignment', 'video' ]
  });

});