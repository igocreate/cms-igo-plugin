
$(function() {

  if (!$('#page_type').length || typeof objectTypes === 'undefined') {
    return ;
  }

  // link pages types to objects types
  const setObjectSelect = function() {
    const option = $('#page_type').find('option:selected');
    const objectType = objectTypes.find(function(objectType) {
      return objectType.type === option.data('object-type');
    });
    if (!objectType) {
      $('#object_id_group').hide();
      $('#object_type').val('');
      $('#object_id').val('');
      return;
    }

    $('#object_id_group').show();
    $('#object_type').val(objectType.type);
    $('label[for="object_id"]').text(objectType.label);
    $('#object_id').empty();
    objectType.list.forEach(function(object) {
      $('#object_id').append($('<option>', {
        value:  object.id,
        text:   object.name
      }));
    });
    $('#object_id').val($('#object_id').data('value'));

  }
  setObjectSelect();
  $('#page_type').on('change', setObjectSelect);


});
