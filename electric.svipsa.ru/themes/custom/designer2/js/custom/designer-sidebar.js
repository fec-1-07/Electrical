jQuery(document).ready(function($) {
  const el = $(".block-el-elements-block");
  const showBtn = $('<div class="elElementsBlockHelp"><i class="fa fa-arrow-right elElementsBlockShowBtn" aria-hidden="true" style="color:white; font-size: 20px; position: absolute; right: 5px; top: 240px; transform: translate(-50%, -50%);cursor: pointer"></i>Библиотека элементов</div>');
  const hideBtn = $('<i class="fa fa-arrow-left elElementsBlockHideBtn" aria-hidden="true"></i>');

  function elElementsBlockHide(el) {
    $(".elElementsBlockHelp").show();
    el.stop().animate({
      width: 50
    }, 500);
  }

  function elElementsBlockShow(el) {
    el.stop().animate({
      width: 300
    }, 500, function() {
      $(".elElementsBlockHelp").hide();
    });
    return false;
  }

  if (el.length>0) {
    // add hide btn.
    el.append(hideBtn);
    el.append(showBtn);

    $(".elElementsBlockHideBtn").on('click', function () {
      elElementsBlockHide(el);
      localStorage.setItem('electric2delElementsBlockHelpFirstTime', "closed");
    })

    $(".elElementsBlockShowBtn, .elElementsBlockHelp").on('click', function () {
      elElementsBlockShow(el);
      localStorage.setItem('electric2delElementsBlockHelpFirstTime', "opened");
    })

    const electric2delElementsBlockHelpFirstTime = localStorage.getItem('electric2delElementsBlockHelpFirstTime');
    if (!electric2delElementsBlockHelpFirstTime) {
      setTimeout(function() {
        elElementsBlockHide(el);
        localStorage.setItem('electric2delElementsBlockHelpFirstTime', "closed");
      }, 3000)
    } else {
      if (electric2delElementsBlockHelpFirstTime == 'closed') {
        elElementsBlockHide(el);
      } else {
        elElementsBlockShow(el);
      }
    }

  }
});
