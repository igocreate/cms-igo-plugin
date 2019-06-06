
$(function() {

  if ($('#object_type').length < 1) {
    return ;
  }

  function setObjectSelect(e) {
    const val = $('#object_type').val();

    if (!val || !objectTypes) {
       return $('#object_id_group').hide();
    }

    const objectType = objectTypes.find(function(objectType) {
      return objectType.type === val;
    });

    if (!objectType) {
       return $('#object_id_group').hide();
    }
    $('#object_id_group').show();
    $('label[for="object_id"]').text(objectType.label);
    $('#object_id').empty();
    objectType.list.forEach(object => {
      $('#object_id').append($('<option>', {
        value:  object.id,
        text:   object.name
      }));
    });
  };

  setObjectSelect();
  $('#object_type').change(setObjectSelect);


});
