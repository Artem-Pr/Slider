'use strict';
var multiItemSlider = (function () {
	return function (selector) {
		var
			_mainElement = document.querySelector(selector), // основный элемент блока
			_sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
			//_sliderItems = _sliderWrapper.children,
			_sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
			_sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
			_sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
			_sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
			_wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
			_wrapperWidth2 = _sliderWrapper.clientWidth,

			_itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
			_itemWidth2 = _sliderItems[0].clientWidth,

			_positionLeftItem = 0, // позиция левого активного элемента
			_transform = 0, // значение трансформации .slider_wrapper
			_step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
			_items = [], // массив элементов
			_countOfArr = 5;

		function extendItemsArr (items, count) {
			let slider = items[0].parentElement.parentElement;
			let wrapper = document.createElement('div');
			wrapper.classList.add('slider__wrapper');

			for (let i = 0; i < count; i++) {
				for (let j = 0; j < items.length; j++) {
					let newItem = items[j].cloneNode(true);
					console.log(newItem);
					wrapper.appendChild(newItem);
				}
			}
			items[0].parentElement.remove();
			slider.appendChild(wrapper);
		}


		// наполнение массива _items
		_sliderItems.forEach(function (item, index) {
			_items.push({ item: item, position: index, transform: 0});
		});
		_items.lastDirection = 'none';
		let _itemsLastIndex = _items.length - 1;

		extendItemsArr(_sliderItems, _countOfArr);

		//extendOfItems(_items, _sliderItems);

		var _transformItem = function (direction) {
			if (direction === 'right') {

				if (_items.lastDirection === 'right') {

					let returnWay = _items[0].transform + _items.length * 100;
					console.log(`returnWay ${returnWay}`);

					_items[0].transform = returnWay;
					_items[0].item.style.transform = 'translateX(' + returnWay + '%)';
					_items.push(_items.shift());
				}

				_items.lastDirection = 'right';

				_positionLeftItem++;
				_transform -= _step;
			}
			if (direction === 'left') {

				if (_items.lastDirection === 'left') {

					let returnWay = _items[_itemsLastIndex].transform - _items.length * 100;
					console.log(`returnWay ${returnWay}`);

					_items[_itemsLastIndex].transform = returnWay;
					_items[_itemsLastIndex].item.style.transform = 'translateX(' + returnWay + '%)';
					_items.unshift(_items.pop());
				}
				_items.lastDirection = 'left';

				_positionLeftItem--;
				_transform += _step;
			}
			_sliderWrapper.style.transform = 'translateX(' + _transform + '%)';

			console.log(`_transform ${_transform}`);
			console.log(`lastDirection Last index ${_items[_itemsLastIndex].lastDirection}`);
			console.log(`_items.lastDirection ${_items.lastDirection}`)
			console.log(_items);
		};

		// обработчик события click для кнопок "назад" и "вперед"
		var _controlClick = function (e) {
			var direction = this.classList.contains('slider__control_right') ? 'right' : 'left';
			e.preventDefault();
			_transformItem(direction);
		};

		var _setUpListeners = function () {
			// добавление к кнопкам "назад" и "вперед" обработчика _controlClick для события click
			_sliderControls.forEach(function (item) {
				item.addEventListener('click', _controlClick);
			});
		};

		// инициализация
		_setUpListeners();

		return {
			right: function () { // метод right
				_transformItem('right');
			},
			left: function () { // метод left
				_transformItem('left');
			}
		}

	}
}());

var slider = multiItemSlider('.slider');