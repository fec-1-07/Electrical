const menuItems = {
  save: {
    iconClass: 'fa-floppy-o',
    cssClass: 'el-designer-new-save-btn',
    title: 'Сохранить проект',
    action: 'action_save',
    help: 'Сохранить изменения в проекте',
  },
  download: {
    iconClass: 'fa-download',
    title: 'Экспорт в PNG',
    sep: true,
    action: 'action_download',
    help: 'Экспортировать проект в PNG формат',
  },
  color: {
    iconClass: 'icon-cog',
    cssClass: 'toolbarColorPicker',
    title: 'Цвет проводов',
    help: 'Выбрать цвет проводов',
  },
  width: {
    cssClass: 'toolbarWidthPicker',
    iconClass: 'icon-cog',
    title: 'Толщина проводов',
    sep: true,
    help: 'Выбрать толщину проводов',
  },
  undo: {
    iconClass: 'fa-undo',
    title: 'Отменить изменения',
    disabled: true,
    action: 'action_undo',
    help: 'Отменить изменения',
  },
  redo: {
    iconClass: 'fa-redo',
    title: 'Вернуть изменения',
    sep: true,
    disabled: true,
    action: 'action_redo',
    help: 'Вернуть изменения',
  },
  group: {
    iconClass: 'fa-object-group',
    title: 'Группировать элементы',
    disabled: true,
    action: 'action_group',
    help: 'Выделите несколько элементов и нажмите эту кнопку чтобы их сгруппировать.',
  },
  ungroup: {
    iconClass: 'fa-duotone fa-object-ungroup',
    title: 'Отменить группировку',
    sep: true,
    disabled: true,
    action: 'action_ungroup',
    help: 'Отменить группировку элементов',
  },
  remove: {
    iconClass: 'fa-trash-o',
    title: 'Удалить',
    disabled: true,
    action: 'action_delete',
    help: 'Удалить элемент',
  },
  zoomIn: {
    iconClass: 'fa-search-plus',
    title: 'Увеличить',
    action: 'action_zoomIn',
    help: 'Увеличить рабочую область проекта',
  },
  zoomReset: {
    iconClass: 'fa-search',
    title: '100% размер',
    action: 'action_zoomReset',
    help: 'Установить 100% размер проекта',
  },
  zoomOut: {
    iconClass: 'fa-search-minus',
    title: 'Уменьшить',
    sep: true,
    action: 'action_zoomOut',
    help: 'Уменьшить рабочую область проекта',
  },
  scrollLeft: {
    iconClass: 'fa-arrow-left fa-light',
    title: 'Прокрутка влево',
    action: 'action_scrollLeft',
    help: 'Прокрутка проекта влево',
  },
  scrollRight: {
    iconClass: 'fa-arrow-right fa-light',
    title: 'Прокрутка вправо',
    action: 'action_scrollRight',
    help: 'Прокрутка проекта вправо',
  },
  scrollUp: {
    iconClass: 'fa-arrow-up fa-light',
    title: 'Прокрутка вверх',
    action: 'action_scrollUp',
    help: 'Прокрутка проекта вверх',
  },
  scrollDown: {
    iconClass: 'fa-arrow-down fa-light',
    title: 'Прокрутка вниз',
    sep: true,
    action: 'action_scrollDown',
    help: 'Прокрутка проекта вниз',
  },
  help: {
    iconClass: 'fa-question',
    title: 'Помощь',
    sep: true,
    action: 'action_help',
    help: 'Открытие этого окна помощи',
  },
}

const keyboardHelp = {
  CtrlC : {
    title: '<Ctrl> + C',
    help: 'Скопировать выбранные элементы в буфер обмена. Вы можете сгруппировать элементы и скопировать их все.'
  },
  CtrlV : {
    title: '<Ctrl> + V',
    help: 'Вставить скопированные элементы из буфера обмена. Вставить скопированные элементы можно как в текущий так и в другие проекты.'
  },
  CtrlZ : {
    title: '<Ctrl> + Z',
    help: 'Отменить изменения'
  },
  CtrlPlus : {
    title: '<Ctrl> + "+"',
    help: 'Увеличить рабочую область проекта'
  },
  CtrlMinus : {
    title: '<Ctrl> + "-"',
    help: 'Уменьшить рабочую область проекта'
  },
  Ctrl1 : {
    title: '<Ctrl> + 1',
    help: 'Установить 100% размер проекта'
  },
  ShiftLeft: {
    title: '<Shift> + Стрелка влево',
    help: 'Прокрутка проекта влево'
  },
  ShiftRight: {
    title: '<Shift> + Стрелка вправо',
    help: 'Прокрутка проекта вправо'
  },
  ShiftUp: {
    title: '<Shift> + Стрелка вверх',
    help: 'Прокрутка проекта вверх'
  },
  ShiftDown: {
    title: '<Shift> + Стрелка вниз',
    help: 'Прокрутка проекта вниз'
  }
}

const elementsHelp = {
  arrowRight: {
    iconClass: 'fa-arrow-right',
    cssStyle: 'background: rgb(101, 140, 255);  color: white;',
    help: 'Развернуть боковое меню с элементами'
  },
  arrowLeft: {
    iconClass: 'fa-arrow-left',
    cssStyle: 'background: rgb(101, 140, 255); color: white;',
    help: 'Свернуть боковое меню с элементами'
  },
  info: {
    iconClass: 'fa-info-circle',
    cssStyle: 'background: rgb(101, 140, 255); color: black;',
    help: 'Кликнуть для просмотра элемента до его добавления на рабочую область'
  },
  search: {
    title: 'Поиск',
    help: 'Область поиска по каталогу элементов. Введите текст и нажмите <Enter>. Найденные элементы будут подсвечены красным цветом. Чтобы отменить поиск удалите текст и нажмите <Enter>'
  },
  start: {
    title: 'Начать работать в конструкторе',
    cssStyle: 'font-weight:bold; margin-right: 10px; display: inline-block; margin-top: 20px',
    help: 'Чтобы добавить первый элемент перетащите его мышкой из бокового меню элементов на рабочую область. У каждого элемента есть свое дополнительное меню. Чтобы его вызвать кликните правой кнопкой мышки по элементу расположенному в рабочей области'
  }
}


const electricLabelColors = {
  red: { name: "Красный", color: "#b5001b" },
  green: { name: "Зеленый", color: "#2ECC71" },
  blue: { name: "Синий", color: "#2980B9" },
  yellow: { name: "Желтый", color: "#8a7f00" },
  brown: { name: "Коричневый", color: "#563833" },
  black: { name: "Черный", color: "#000000" },
  gray: { name: "Серый", color: "#646363" },
};

const electricLabelBorderColors = {
  transparent: { name: "Прозрачный", color: null },
  ...electricLabelColors
};

const electricLabelFontSize = {};
for (let i = 7; i <= 30; i++) {
  electricLabelFontSize[i] = { name: i };
}

const electricLineColors = {
  red: { name: "Красный", color: "#f3546a", abb: "R" },
  green: { name: "Зеленый", color: "#2ECC71", abb: "G" },
  blue: { name: "Синий", color: "#00A8F0", abb: "B" },
  yellow: { name: "Желтый", color: "#D4C834", abb: "Y" },
  yellow_green: { name: "Желто-зеленый", color: "#D4C834", abb: "Y/G", color2: "#1D7E15" },
  brown: { name: "Коричневый", color: "#81574e", abb: "Br" },
  black: { name: "Черный", color: "#000000", abb: "Bl" },
  gray: { name: "Серый", color: "#8d8d8d", abb: "G" },
  red_black: { name: "Черно-красный", color: "#000000", abb: "R/B", color2: "#f3546a" },
};

const electricDefaultLineColor = localStorage.getItem('electricLineColor') || '#f3546a';

const electricLineStrokes = {
  w_1: { name: "Толщина 1", value: 1 },
  w_2: { name: "Толщина 2", value: 2 },
  w_3: { name: "Толщина 3", value: 3 },
  w_4: { name: "Толщина 4", value: 4 },
  w_5: { name: "Толщина 5", value: 5 },
};

const electricDefaultLineStroke = localStorage.getItem('electricLineStroke') || '3';

const sizeCoef = 1.72;

(function ($) {

  document.addEventListener("DOMContentLoaded", function () {
    // Load saved project data.
    let savedData = drupalSettings.el_draw2d.data || null;
    const width = savedData.width * sizeCoef || 2000; // savedData.width in mm
    const height = savedData.height * sizeCoef || 2000; // savedData.height in mm
    const app = new electric.Application(width, height);

    // Init connections
    const stroke = (electricLineStrokes[electricDefaultLineStroke] && electricLineStrokes[electricDefaultLineStroke].hasOwnProperty('value')) ? electricLineStrokes[electricDefaultLineStroke].value : 2;
    const options = {
      color: (electricLineColors[electricDefaultLineColor] && electricLineColors[electricDefaultLineColor].hasOwnProperty('color')) ? electricLineColors[electricDefaultLineColor].color : '#000000',
      stroke,
    }

    if (electricLineColors[electricDefaultLineColor] && electricLineColors[electricDefaultLineColor].hasOwnProperty('color2') && electricLineColors[electricDefaultLineColor].color2) {
      options.stroke = stroke / 3;
      options.outlineStroke = stroke * 1.1;
      options.outlineColor = electricLineColors[electricDefaultLineColor].color2;
      options.outlineVisible = true;
    }

    Utils.updateConnectionCreatePolicy(app.view, options);

    // Grid.
    app.view.installEditPolicy(new draw2d.policy.canvas.ShowGridEditPolicy(10 * sizeCoef));
    app.view.installEditPolicy(new draw2d.policy.canvas.SnapToGeometryEditPolicy());
    app.view.installEditPolicy(new draw2d.policy.canvas.SnapToInBetweenEditPolicy());
    app.view.installEditPolicy(new draw2d.policy.canvas.SnapToCenterEditPolicy());

    // Group
    app.view.installEditPolicy(new draw2d.policy.canvas.ExtendedKeyboardPolicy());


    // Fide out.
    // app.view.installEditPolicy(new draw2d.policy.canvas.FadeoutDecorationPolicy());


    app.view.installEditPolicy(new DefaultDropInterceptorPolicy());

    // не работает с группировкой
    //app.view.installEditPolicy(new CopyInterceptorPolicy());


    draw2d.shape.basic.Label.inject({
      clearCache: function () {
        this.portRelayoutRequired = true;
        this.cachedMinWidth = null;
        this.cachedMinHeight = null;
        this.cachedWidth = null;
        this.cachedHeight = null;
        this.lastAppliedTextAttributes = {};
        return this;
      }
    });

    new ToolbarActions(app.view).init();

    if (savedData) {
      const project_data = savedData.project_data || null;
      if (project_data) {
        $("body").append('<div class="el-draw2d-designer-loading">Loading...</div><div class="el-draw2d-designer-loading-percent"></div>')

        setTimeout(async function () {
          try {
            await loadData(app, project_data);
            $(".el-draw2d-designer-loading").remove();
            $(".el-draw2d-designer-loading-percent").remove();
          } catch (e) {
            console.error(e);
            $(".el-draw2d-designer-loading").remove();
          }
        }, 1000)
      }

    }
  });


  async function loadData(app, project_data) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new draw2d.io.json.Reader();
        const data = JSON.parse(decodeURIComponent(escape(window.atob(project_data))));

        const total = data.length;
        let percent = 0;
        let text = 'Загрузка ресурсов';
        $(".el-draw2d-designer-loading-percent").html(text);

        const emitter = function(type, data) {
          switch (type) {
            case 'elements':
              percent = parseInt(data) * 100 / total;
              percent = Math.round(percent * 100) / 100;
              text = `Загружено ${percent}%. (${data} из ${total} элементов)`;
              $(".el-draw2d-designer-loading-percent").html(text);
              if (total - data <  10) {
                $(".el-draw2d-designer-loading").remove();
              }

              if (data >= total) {
                return resolve();
              }
              break;
          }
        }

        reader.unmarshal(app.view, data, emitter);

        if (total < 1) {
          return resolve();
        }

      } catch (e) {
        return reject(e);
      }
    });
  }
}(jQuery));
