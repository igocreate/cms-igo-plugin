


$(function() {
  $('.faq-faq').on('click', function() {
    const el    = $(this);
    const open  = el.hasClass('open');

    el.toggleClass('open', !open);
    el.find('i.fa').toggleClass('fa-chevron-right', open);
    el.find('i.fa').toggleClass('fa-chevron-down', !open);
    el.find('.faq-answer').slideToggle(!open);
  });
});
