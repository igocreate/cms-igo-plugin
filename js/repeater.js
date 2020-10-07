

$(function() {

  const repeat = function() {
    $('.repeater').each(function() {
      const repeater  = $(this);
      const attr      = repeater.data('attr');
      let i = 0;

      // save model if needed
      if (!repeater.data('model')) {
        const model = repeater.find('.model');
        model.remove();
        model.removeClass('d-none');
        repeater.data('model', model);
      }

      repeater.find('.item').each(function() {
        const item = $(this);
        item.find('.item-i').html(i+1);
        item.find('input, textarea').each(function() {
          const element = $(this);
          if (!element.data('firstname')) {
            let firstname = element.attr('name');
            let k = firstname.indexOf('[');
            if (k > -1) {
              firstname = '[' + firstname.substring(0, k) + ']' + firstname.substring(k);
            } else {
              firstname = '[' + firstname + ']';
            }
            element.data('firstname', firstname);
          }
          element.attr('name', attr + '[' + i + ']' + element.data('firstname'));
        });
        i++;
      });
      repeater.find('.item-count').html(i);
    });
  };
  repeat();
  

  $('.repeater').on('click', '.add-item', function(e) {
    e.preventDefault();
    const repeater = $(this).closest('.repeater');
    repeater.data('model').clone().appendTo(repeater.find('.items'));
    repeat();
  });

  $('.repeater').on('click', '.delete-item', function(e) {
    e.preventDefault();
    const item = $(this).closest('.item');
    item.remove();
    repeat();
  });

});
