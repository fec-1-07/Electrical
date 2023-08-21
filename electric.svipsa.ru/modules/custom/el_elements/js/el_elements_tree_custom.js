(function ($, Drupal, settings) {
  "use strict";
  Drupal.behaviors.elElementsTreeCustom = {
    attach: function (context, settings) {
      const _self = this;
      const root = $("#el-elements-tree", context).once();
      const rootWrapper = $("#el-elements-tree-wrapper", context).once();;
      if (root) {
        $("ul", root).hide();

        $(".el-preview", root).on('click', function (event) {
          _self.el_remove_preview(root);
          const el = event.target;
          const src = $(el).data('src');
          const img = $(`<img src="${src}" class="el-preview-image">`);
          $(el).append(img);
          img.show();
          event.stopPropagation();
        });

        $("li.el-has-children", root).on('click', function (event) {
          const el = $(event.target);
          if (el.hasClass('el-has-children')) {
            const child = el.find("> ul");
            if (child.is(":visible")) {
              child.hide();
              el.removeClass('open');
            } else {
              child.show();
              el.addClass('open');
            }
            event.stopPropagation();
          }
          Drupal.behaviors.elElementsTreeCustom.el_tree_save_status();
        });

        if (localStorage.getItem('electric2dTreeStore')) {
          Drupal.behaviors.elElementsTreeCustom.el_tree_load_status()
        } else {
          $("li.el-has-children:first-child > ul", root).show();
          $("li.el-has-children:first-child > ul li.el-has-children:first-child > ul", root).show();
        }

        // Preview
        $('*:not(.el-preview)').on('click', function (event) {
          _self.el_remove_preview(root);
        });

        // $("li:not(.el-has-children)", root).tooltip({placement: "right", trigger: "manual", title: "перетащите элемент на рабочую область"});

        $("li.el_icon", root).on({
          "click": function() {
            $(this).tooltip("show");
          },
          "mouseout": function() {
            $(this).tooltip("hide");
          }
        });

        Drupal.behaviors.elElementsTreeCustom.el_paid_disable(root);
      }

      if (root && rootWrapper) {
        $('#el-search', rootWrapper).on('keypress', function (e) {
          if (e.which == 13) {
            const text = _self.translit($(this).val()).toLowerCase();
            _self.search(text, root);
          }
        });
      }
    },

    search: function (text, root) {
      const _self = this;
      const foundEls = [];
      root.find("li").each(function (i, el) {
        const elText = _self.translit($(el).data('text').toString()).toLowerCase()
        if (elText.includes(text)) {
          foundEls.push(el);
        }
      });

      if (foundEls.length) {
        _self.closeAllSearch(root);
        for (let el of foundEls) {
          $(el).addClass('search-active');
          _self.openParents(el);
        }
      }

      if (text.length < 1) {
        _self.closeAllSearch(root);
      }

      Drupal.behaviors.elElementsTreeCustom.el_tree_save_status();
    },

    translit: function (word) {
      let result = '';
      const converter = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya',

        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
        'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
        'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
        'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
        'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch',
        'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '',
        'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
      };

      for (let i = 0; i < word.length; ++i) {
        if (converter[word[i]] == undefined) {
          result += word[i];
        } else {
          result += converter[word[i]];
        }
      }

      return result;
    },

    closeAllSearch: function (root) {
      $(".search-active", root).removeClass('search-active');
      $("li.open", root).removeClass('open');
      $("ul", root).hide();
    },

    openParents: function (el) {
      const current = $(el);
      current.addClass('open');
      current.find('>ul').show();
      const parentsUL = current.parents('ul');
      const parentsLI = current.parents('li');

      if (parentsUL.length) {
        for (let parent of parentsUL) {
          $(parent).show();
        }
      }

      if (parentsLI.length) {
        for (let parent of parentsLI) {
          $(parent).addClass('open');
        }
      }
    },

    el_paid_disable: function (root) {
      const paidUser = (drupalSettings.hasOwnProperty('el_pay') && drupalSettings.el_pay.hasOwnProperty('isPaid') && drupalSettings.el_pay.isPaid);
      if (!paidUser) {
        $('.el-elements-paid .palette_node_element', root).removeClass('ui-draggable').removeClass('draw2d_droppable');
        $('.el-elements-paid', root).addClass('el-elements-disabled');
        $('.el-elements-paid .el-preview', root).parent().append('<a href="/price" class="el-paid-description">Доступно в платной версии</a>');
      }
    },

    el_remove_preview: function () {
      $('.el-preview-image').remove();
    },

    el_tree_save_status: function () {
      const tree = Drupal.behaviors.elElementsTreeCustom.el_tree_get_tree_level($("#el-elements-tree"));
      localStorage.setItem('electric2dTreeStore', JSON.stringify(tree));
    },

    el_tree_load_status: function () {
      const treeData = localStorage.getItem('electric2dTreeStore');
      try {
        const tree = JSON.parse(treeData);
        if (tree) {
          Drupal.behaviors.elElementsTreeCustom.el_tree_set_tree_level($("#el-elements-tree"), tree);
        }
      } catch (e) {
        console.error(e);
      }
    },

    el_tree_get_tree_level: function (root) {
      const level = {};
      root.find(">li.el-has-children").each(function (i, el) {
        level[i] = { status: $(el).hasClass('open') ? true : false };
        if ($(el).find(">ul")) {
          level[i]['children'] = Drupal.behaviors.elElementsTreeCustom.el_tree_get_tree_level($(el).find(">ul"));
        }
      });
      return level;
    },

    el_tree_set_tree_level: function (root, tree) {
      root.find(">li.el-has-children").each(function (i, el) {
        if (tree && tree[i]) {
          if (tree[i].status) {
            $(el).addClass('open');
            $(el).find(">ul").show();
          }

          if ($(el).find(">ul") && tree[i].hasOwnProperty('children')) {
            Drupal.behaviors.elElementsTreeCustom.el_tree_set_tree_level($(el).find(">ul"), tree[i].children);
          }
        }
      });
    }
  };

})(jQuery, Drupal, drupalSettings);



