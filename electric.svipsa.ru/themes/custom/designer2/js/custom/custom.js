(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.electricNewCustom = {
    attach: function (context, settings) {
      //$(context).on('DOMNodeInserted', "#el-ajax-messages:not(.processed)", function() {
      $("#el-ajax-messages").once().on('DOMNodeInserted', function() {
        setTimeout(function() {
          $('#el-ajax-messages').html("").removeOnce();
        },10000);
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
