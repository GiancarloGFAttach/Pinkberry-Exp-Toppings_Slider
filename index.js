if (typeof window.attach != 'undefined') {
  (function ABTestSlider() {
    var atm = window.attach;
    var me = {
      debug: atm.debug || true,
      id: 'dropdown',
      name: 'AB Test - Sliders - Chillis',
      data: {
        tagsList: {},
        accordionData: [
          {
            type_accordion: 'first_cup_toppings',
            title_accordion: 'Elige los toppings para tu Cup',
          },
          {
            type_accordion: 'second_cup_toppings',
            title_accordion: 'Elige los toppings para tu segundo Cup',
          },
          {
            type_accordion: 'third_cup_toppings',
            title_accordion: 'Elige los toppings para tu tercer Cup',
          },
          {
            type_accordion: 'fourth_cup_toppings',
            title_accordion: 'Elige los toppings para tu cuarto Cup',
          },
          {
            type_accordion: 'additional_toppings',
            title_accordion: '¿Deseas agregar algún topping?',
          },
          {
            type_accordion: 'first_minicup_toppings',
            title_accordion: 'Elige los toppings del Mini Cup',
          },
          {
            type_accordion: 'second_minicup_toppings',
            title_accordion: 'Elige los toppings del segundo Mini Cup',
          },
          {
            type_accordion: 'first_creppe_toppings',
            title_accordion: 'Elige los toppings para tu Crepe',
          },
          {
            type_accordion: 'second_creppe_toppings',
            title_accordion: 'Elige los toppings para tu segundo Crepe',
          },
        ],
      },
      fn: {
        tagsCreator: function (pasoId) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          if (dataLS) {
            var tagList = dataLS.tagsList[`tagList-${pasoId}`];
            for (var i = 0; i < tagList.length; i++) {
              var product = tagList[i];
              me.fn.createTag(product.text, product.id);
            }
          }
        },
        createTag: function (text, id) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          if (dataLS && dataLS.currIdDataPaso) {
            var tagContainer = document.querySelector(
              `#tagsContainer-${dataLS.currIdDataPaso}`
            );
            if (tagContainer) {
              var tag = document.createElement('div');
              tag.setAttribute('class', 'tag');
              tag.setAttribute('data-id', id);
              tag.innerHTML = text;
              var closeIcon = document.createElement('span');
              closeIcon.onclick = function () {
                me.listeners.onCloseTag(this);
              };
              closeIcon.setAttribute('class', 'close');
              closeIcon.innerHTML = '&times;';
              tag.appendChild(closeIcon);
              tagContainer.appendChild(tag);
            }
          }
        },
        removeTag: function (id) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));

          if (dataLS && dataLS.currIdDataPaso) {
            var tagContainer = document.querySelector(
              `#tagsContainer-${dataLS.currIdDataPaso}`
            );
            if (tagContainer) {
              var tags = tagContainer.querySelectorAll('.tag');
              for (var i = 0; i < tags.length; i++) {
                var tag = tags[i];
                if (tag.getAttribute('data-id') === id) {
                  tag.remove();
                }
              }
            }
          }
        },
        tagItems: function (target) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          if (dataLS) {
            var contentAccordionEl = target.closest('.content-accordion');
            var items = contentAccordionEl.querySelectorAll('.item-producto');
            dataLS.numGroups = Math.ceil(items.length / 6);
            var tagList = dataLS.tagsList[`tagList-${dataLS.currIdDataPaso}`];
            for (var i = 0; i < tagList.length; i++) {
              var productLS = tagList[i];
              var productEl = contentAccordionEl.querySelector(
                `#${productLS.id}.item-producto`
              );
              if (productEl) {
                var isSelected = productEl.className.indexOf('producto-seleccionado') > -1;
                if (isSelected === false) {
                  productEl
                    .querySelector('.agregar-producto .card-imagen-producto')
                    .click();
                }
              }
            }
            if (items.length > 0) {
              for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var group = Math.ceil((i + 1) / 6);
                if (!item.getAttribute('data-group')) {
                  item.setAttribute('data-group', group);
                }
              }
            }
            window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
          }
        },
        updateTagsList: function (text, id, pasoId, action) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          if (dataLS) {
            var tagList = dataLS.tagsList[`tagList-${pasoId}`];
            if (action === 'remove') {
              tagList = tagList.filter(function (tag) {
                return tag.id !== id;
              });
              dataLS.tagsList[`tagList-${pasoId}`] = tagList;
              window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
            } else if (action === 'add') {
              tagList.push({
                id: id,
                text: text,
              });
              dataLS.tagsList[`tagList-${pasoId}`] = tagList;
              window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
            }
          }
        },
        hiddeItems: function (target) {
          var contentAccordionEl = target.closest('.content-accordion');
          var items = contentAccordionEl.querySelectorAll('.item-producto');

          if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              item.style.display = 'none';
            }
          }
        },
        showItems: function (target, group) {
          var contentAccordionEl = target.closest('.content-accordion');
          var groupToShow = group || 1;
          var items = contentAccordionEl.querySelectorAll(
            `.item-producto[data-group="${groupToShow}"]`
          );
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.style.display = 'block';
          }
        },
        htmlGenerator: function (targetPaso) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          if (dataLS && dataLS.currIdDataPaso) {
            var contentAccordionEl = targetPaso.closest('.content-accordion');
            var numMaxEl = contentAccordionEl.querySelector(
              '.cantidad-prds-paso'
            );
            var panelEl = contentAccordionEl.querySelector('#panel-productos');

            // Se agrega el container de los tags y eventos.
            if (panelEl.querySelector('.tagsContainer') === null) {
              numMaxEl.insertAdjacentHTML(
                'afterend',
                `<div id="tagsContainer-${dataLS.currIdDataPaso}" class="tagsContainer"></div>`
              );
            }

            // Se crean los iconos si no existen
            if (contentAccordionEl.querySelector('.icon') === null) {
              contentAccordionEl.insertAdjacentHTML(
                'beforeend',
                '<div class="icon icon-left" data-direction="left"><img src="https://i.imgur.com/YxhtQf1.png" ></img></div>'
              );
              contentAccordionEl.insertAdjacentHTML(
                'beforeend',
                '<div class="icon icon-right" data-direction="right"><img src="https://i.imgur.com/l44cQW1.png" ></img></div>'
              );
            }

            //Se agregan los inputs para el slider.
            var checkboxes = '';
            for (var i = 0; i < dataLS.numGroups; i++) {
              if (i == 0) {
                checkboxes += `<div data-group="${
                  i + 1
                }" class="checkbox checked"></div>`;
              } else {
                checkboxes += `<div data-group="${
                  i + 1
                }" class="checkbox"></div>`;
              }
            }
            if (panelEl.querySelector('#checkboxContainer') === null) {
              var checkboxedContainer = `<div id="checkboxContainer">${checkboxes}</div>`;
              panelEl.insertAdjacentHTML('beforeend', checkboxedContainer);
            }
          }
        },
        eventsGenerator: function (targetPaso) {
          //Adding events to the left and right icons.
          var accordionEl = targetPaso.closest('.content-accordion');
          var leftIcon = accordionEl.querySelector('.icon-left');
          var rightIcon = accordionEl.querySelector('.icon-right');
          if (leftIcon !== null) {
            leftIcon.removeEventListener('click', me.listeners.onClickLeft);
            leftIcon.addEventListener('click', me.listeners.onClickLeft);
          }
          if (leftIcon !== null) {
            rightIcon.removeEventListener('click', me.listeners.onClickRight);
            rightIcon.addEventListener('click', me.listeners.onClickRight);
          }
          //Adding events to the checkboxes.
          var checkboxesEls = accordionEl.querySelectorAll(
            '#checkboxContainer .checkbox'
          );
          if (checkboxesEls.length > 0) {
            for (var j = 0; j < checkboxesEls.length; j++) {
              var checkboxEl = checkboxesEls[j];
              checkboxEl.removeEventListener(
                'click',
                me.listeners.onClickCheckbox
              );
              checkboxEl.addEventListener(
                'click',
                me.listeners.onClickCheckbox
              );
            }
          }
          //Adding events to the products when selected.
          var panelEl = accordionEl.querySelector(
            '.content-panel.productosDePaso'
          );
          if (panelEl) {
            var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
            if (dataLS) {
              var itemsEls = panelEl.querySelectorAll('.item-producto');
              for (var i = 0; i < itemsEls.length; i++) {
                var item = itemsEls[i];
                var checkIcon = item.querySelector('i.fa-check-square');
                if (checkIcon) {
                  if (
                    item.querySelector('i.fa-check-square').style.display ===
                    'block'
                  ) {
                    item.setAttribute('data-selected', 'true');
                    dataLS.itemsSelected++;
                  } else {
                    item.setAttribute('data-selected', 'false');
                  }
                }
                item
                  .querySelector('.agregar-producto')
                  .removeEventListener('click', me.listeners.onSelectItem);
                item
                  .querySelector('.agregar-producto')
                  .addEventListener('click', me.listeners.onSelectItem);
              }
              window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
            }
          }
        },
        indexFinderInputChecked: function (checkboxArray) {
          var indexChecked = 0;
          for (var index in checkboxArray) {
            if (
              typeof checkboxArray[index] === 'object' &&
              checkboxArray[index].classList.contains('checked')
            ) {
              indexChecked = index;
            }
          }
          return indexChecked;
        },
      },
      listeners: {
        onSelectItem: function (e) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          if (dataLS) {
            var currentItem = e.target.closest('.item-producto');
            var id = currentItem.id;
            var text = atm.util.labelize(currentItem.innerText).split(' ')[0];
            if (currentItem.getAttribute('data-selected') === 'false') {
              if (dataLS.itemsSelected + 1 <= dataLS.maxItemsAllowed) {
                currentItem.dataset.selected = 'true';
                me.fn.createTag(text, id, dataLS.currIdDataPaso);
                dataLS.itemsSelected++;
                window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
                me.fn.updateTagsList(text, id, dataLS.currIdDataPaso, 'add');
              }
            } else if (currentItem.getAttribute('data-selected') === 'true') {
              if (dataLS.itemsSelected - 1 >= 0) {
                currentItem.dataset.selected = 'false';
                me.fn.removeTag(id, dataLS.currIdDataPaso);
                dataLS.itemsSelected--;
                window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
                me.fn.updateTagsList(text, id, dataLS.currIdDataPaso, 'remove');
              }
            }
          }
        },
        onCloseTag: function onCloseTag(target) {
          var currentContent = target.closest('.content-accordion');
          var id = target.closest('.tag').getAttribute('data-id');
          var itemsEls = currentContent.querySelectorAll('.item-producto');
          for (var i = 0; i < itemsEls.length; i++) {
            var itemEl = itemsEls[i];
            if (itemEl.id === id) {
              itemEl.querySelector('.product-item-img').click();
            }
          }
        },
        onClickLeft: function (e) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          if (dataLS) {
            var target = e.target;
            var prevGroup = dataLS.currGroup - 1;
            if (prevGroup > 0) {
              target
                .closest('.content-accordion')
                .querySelector('#checkboxContainer .checkbox.checked')
                .classList.toggle('checked');

              target
                .closest('.content-accordion')
                .querySelector(
                  `#checkboxContainer .checkbox[data-group="${prevGroup}"]`
                )
                .classList.toggle('checked');

              dataLS.currGroup = prevGroup;
              me.fn.hiddeItems(target);
              me.fn.showItems(target, dataLS.currGroup);
              window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
            }
          }
        },
        onClickRight: function (e) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          var target = e.target;
          if (dataLS) {
            var nextGroup = dataLS.currGroup + 1;
            if (nextGroup <= dataLS.numGroups) {
              target
                .closest('.content-accordion')
                .querySelector('#checkboxContainer .checkbox.checked')
                .classList.toggle('checked');

              target
                .closest('.content-accordion')
                .querySelector(
                  `#checkboxContainer .checkbox[data-group="${nextGroup}"]`
                )
                .classList.toggle('checked');

              dataLS.currGroup = nextGroup;
              me.fn.hiddeItems(target);
              me.fn.showItems(target, dataLS.currGroup);
              window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
            }
          }
        },
        onClickCheckbox: function (e) {
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          if (dataLS) {
            var target = e.target;
            var groupNum = target.getAttribute('data-group');
            target
              .closest('.content-accordion')
              .querySelector('#checkboxContainer .checked')
              .classList.toggle('checked');
            target.classList.toggle('checked');
            dataLS.currGroup = parseInt(groupNum);
            me.fn.hiddeItems(target);
            me.fn.showItems(target, groupNum);
            window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
          }
        },
      },
      run: function () {
        if (window.location.pathname.includes('/producto')) {
          /*------------
          ADDING CSS
          --------------*/
          var cssAdded = `        
          #panel-productos .content-panel .item-producto[data-selected]{
            display: none;
          }
          .content-accordion{
            position: relative;
          }
          .content-accordion .icon{
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2.2rem;
            height: 3.2rem;
            cursor: pointer;
            visibility: hidden;
            opacity: 0;
          }
          .content-accordion .icon svg{
            width: 100%;
            height: 100%;
            fill: #F16078;
          }
          .content-accordion .icon-left{
            left: 0px;
            top: 50%;
            z-index: 99;
          }
          .content-accordion .icon-right{
            right: 0px;
            top: 50%;
            z-index: 99;
          }
          .content-accordion #panel-productos[style*="block"] + .icon,
          .content-accordion #panel-productos[style*="block"] + .icon + .icon {
            visibility: visible;
            opacity: 1;
          } 
          .content-accordion #panel-productos .content-panel {
            display: grid;
            grid-template-columns: repeat(3,1fr);
            column-gap: 10px;
            row-gap: 10px;
            padding-right: 1.8rem;
            padding-left: 1.8rem;
          } 
          @media only screen and (max-width: 450px){
            .content-accordion #panel-productos .content-panel {
              padding-right: 0;
              padding-left: 0;
            } 
            .content-accordion .icon {
              display: none !important;
            }
          }
          .content-accordion #panel-productos .item-producto {
            width: 100%;
            margin: 0;
          }
          .content-accordion #panel-productos .item-producto:not(.producto-seleccionado) {
            border: 2px solid transparent;
          }
          @media only screen and (max-width: 560px){
            .content-accordion #panel-productos .content-panel {
              grid-template-columns: repeat(2,1fr);
            } 
            .content-accordion #panel-productos .item-producto {
              width: 100% !important;
            }
          }
          @media only screen and (max-width: 340px){
            .content-accordion #panel-productos .content-panel {
              grid-template-columns: repeat(1,1fr);
            } 
            .content-accordion #panel-productos .item-producto {
              width: 100% !important;
            }
          }
          .content-accordion #checkboxContainer{
            display: flex;
            justify-content: center;
            margin-top: 2rem;
          }
          .content-accordion #checkboxContainer .checkbox{
            width: 12px;
            height: 12px;
            border: 1px solid #F16078;
            border-radius: 50%;
            margin: 0 5px;
            cursor: pointer;
          }
          .content-accordion #checkboxContainer .checked{
            background-color: #F16078;
          }
          .content-accordion .tagsContainer{
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            padding: 0.5rem 1rem;
          }
          .content-accordion .tagsContainer .tag{
            border: 1px solid #81BE41;
            border-radius: 10px;
            margin: 5px 10px;
            color: #81BE41;
            padding: 0 1rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            justify-content: center;
          }
          .content-accordion .tagsContainer .tag .tagName{
            margin-right: 20px;
          }
          .content-accordion .tagsContainer .tag .close{
            font-size: 1.2rem;
            cursor: pointer;
            color: #81BE41;
          }
         `;
          atm.util.appendCSS(cssAdded);

          /*-------------------------------
          ADDING EVENTS TO EACH ACCORDEON WHEN CLICKED.
          ---------------------------------*/
          var onAccordionClick = function (e) {
            var accordionEl = e.target.closest('.content-accordion');
            var accordionPasoEl = accordionEl.querySelector('#dataPaso');

            if (accordionPasoEl) {
              /* Start:Local Data created when accordion is clicked */
              var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
              if (dataLS) {
                /* At first data from LS is reset */
                dataLS.currGroup = 1;
                dataLS.itemsSelected = 0;
                dataLS.numGroups = 0;
                dataLS.maxItemsAllowed = parseInt(
                  accordionPasoEl.getAttribute('data-cantidad')
                );
                dataLS.currIdDataPaso = parseInt(
                  accordionPasoEl.getAttribute('data-idconfpaso')
                );

                if (!dataLS.tagsList[`tagList-${dataLS.currIdDataPaso}`]) {
                  dataLS.tagsList[`tagList-${dataLS.currIdDataPaso}`] = [];
                }
                window.sessionStorage.setItem('pbdata', JSON.stringify(dataLS));
                /* End:Local Data created when accordion is clicked */

                if (!accordionPasoEl.classList.contains('active')) {
                  var panelEl = accordionEl.querySelector('#panel-productos');
                  if (panelEl) {
                    var Observer = new MutationObserver(function () {
                      var currGroup = dataLS.currGroup;
                      if (currGroup) {
                        var accordionPaso =
                          accordionPasoEl.getAttribute('data-nombre') || '';

                        var existent = me.data.accordionData.find(function (o) {
                          return o.title_accordion == accordionPaso;
                        });
                        if (existent) {
                          me.fn.hiddeItems(accordionPasoEl);
                          me.fn.tagItems(accordionPasoEl);
                          me.fn.showItems(accordionPasoEl, dataLS.currGroup);
                          me.fn.htmlGenerator(accordionPasoEl); //It generates the HTML
                          me.fn.eventsGenerator(accordionPasoEl); //It generates the events
                          me.fn.tagsCreator(dataLS.currIdDataPaso);
                        } else {
                          me.fn.hiddeItems(accordionPasoEl);
                          me.fn.tagItems(accordionPasoEl);
                          me.fn.showItems(accordionPasoEl, dataLS.currGroup);
                          me.fn.eventsGenerator(accordionPasoEl); //It generates the events
                        }
                        Observer.disconnect();
                      }
                    });
                    var config = {
                      attributes: true,
                    };
                    Observer.observe(panelEl, config);
                  }
                }
              }
            }
          };

          /* INIT */
          var dataLS = JSON.parse(window.sessionStorage.getItem('pbdata'));
          var newData = {
            numGroups: 0,
            currGroup: 1,
            itemsSelected: 0,
            maxItemsAllowed: 0,
            currIdDataPaso: '',
            tagsList: {},
          };

          if (dataLS) {
            newData.tagsList = dataLS.tagsList;
          }
          window.sessionStorage.setItem('pbdata', JSON.stringify(newData));

          /* Se añade listeners a los acordeones */
          var accordionsEls = document.querySelectorAll(
            '.content-accordion a#dataPaso.accordionPaso'
          );
          for (var i = 0; i < accordionsEls.length; i++) {
            var accordionEl = accordionsEls[i];
            accordionEl.removeEventListener('click', onAccordionClick);
            accordionEl.addEventListener('click', onAccordionClick);
          }

          /* Se añade evento a boton de modal de ir al carrito */
          var addOrderBtnEls = document.querySelectorAll(
            '#btnAgregarPedidoBajo, #btnAgregarPedidoMovil'
          );
          if (addOrderBtnEls.length > 0) {
            var onClickBtn = function () {
              attach.util.seekFor(
                'button.ir-carrito',
                { tries: 50, delay: 200 },
                (btnEls) => {
                  var btnEl = btnEls[0];
                  btnEl.addEventListener('click', function () {
                    window.sessionStorage.removeItem('pbdata');
                  });
                }
              );
            };
            for (var i = 0; i < addOrderBtnEls.length; i++) {
              var addOrderBtnEl = addOrderBtnEls[i];
              addOrderBtnEl.removeEventListener('click', onClickBtn);
              addOrderBtnEl.addEventListener('click', onClickBtn);
            }
          }
        }
      },
    };
    return me;
  })().run();
}
