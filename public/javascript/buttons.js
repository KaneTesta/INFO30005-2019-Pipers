$(document).on('transition', () => {
  $('button[data-post]').each(() => {
    const $button = $(this);
    const postUrl = $button.attr('data-post');

    $button.on('click', () => {
      $button.addClass('loading');
      $.post(postUrl, null, (data) => {
        window.location.reload();
        $button.removeClass('loading');
      });
    });
  });
});
