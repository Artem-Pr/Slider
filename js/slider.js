'use strict';
var multiItemSlider = (function () {
	return function (selector) {
		var
			_mainElement = document.querySelector(selector), // основный элемент блока ('.slider')
			_sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
			//_sliderItems = _sliderWrapper.children,
			_sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
			_sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
			_sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
		 _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
			//_sliderItems = _sliderWrapper.children,
			_wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
			_wrapperWidth2 = _sliderWrapper.clientWidth,

			_itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
			_itemWidth2 = _sliderItems[0].clientWidth;

		let _countOfArr = 3, // slider duplication count
			_items = [], // массив элементов
			_step = Math.round(_itemWidth / _wrapperWidth * 100), // величина шага (для трансформации)
			ratioToMoveElems = Math.round(_sliderItems.length * _countOfArr - _wrapperWidth / _itemWidth), // number of items outside the wrapper
			elemInWrap = Math.round(_wrapperWidth / _itemWidth),
			_transform = 0; // значение трансформации .slider_wrapper


		// create slider's duplicates and move some slides to the left
		// items - '.slider__item' array
		// count - slider duplication count
		function sliderDup(sliderItems, count) {
			let itemsForMove, // number of items to move left
				slider = sliderItems[0].parentElement.parentElement,
				wrapper = document.createElement('div');

			wrapper.classList.add('slider__wrapper');

			if (count > 1) { // create arr with duplicates
				for (let i = 0; i < count; i++) {
					for (let j = 0; j < sliderItems.length; j++) {
						let newItem = sliderItems[j].cloneNode(true);
						_items.push({item: newItem, index: j, transform: 0});
						wrapper.appendChild(newItem);
					}
				}

			} else { // create arr without duplicates
				for (let i = 0; i < sliderItems.length; i++) {
					let newItem = sliderItems[i].cloneNode(true);
					_items.push({item: newItem, index: i, transform: 0});
				}
				itemsForMove = Math.floor(_items.length / 2);
				let arr = _items.splice(-itemsForMove, itemsForMove);
				_items = arr.concat(_items);
				for (let i = 0; i < _items.length; i++) {
					wrapper.appendChild(_items[i].item);
				}
			}
			sliderItems[0].parentElement.remove();
			slider.appendChild(wrapper);
		}


		// create slider's duplicates and put it in _items array
		// items - '.slider__item' array
		// count - slider duplication count
		function createSlideDupArr(items, count) {
			let newItem, // new items for clone '.slider__item' elements
				newArr = []; // array for filling with new elements

			for (let i = 0; i < count; i++) {
				for (let j = 0; j < items.length; j++) {
					newItem = items[j].cloneNode(true);
					newArr.push({item: newItem, index: j, transform: 0});
				}
			}
			return newArr;
		}


		// filling the array with slide elements
		// items - '.slider__item' array
		function fillSlideArr(items) {
			let newItem, // new items for clone '.slider__item' elements
				newArr = []; // array for filling with new elements

			for (let i = 0; i < items.length; i++) {
				newItem = items[i].cloneNode(true);
				newArr.push({item: newItem, index: i, transform: 0});
			}
			return newArr;
		}


		// Create and return new array of slider elements
		// items - '.slider__item' array
		// count - slider duplication count
		function createItemsArr(items, count) {
				if (count > 1) return createSlideDupArr(items, count); // if we need more than 1 copy of slides
				return fillSlideArr(items); // if we need only 1 copy of slides
		}


		// Сut the second part of the current array and place it at the beginning of the array (current array is broken!)
		// arr - the current array
		function arrPartitioning (arr) {
			let itemsForMove = Math.floor(_items.length / 2); // number of items to move left
			let newArr = arr.splice(-itemsForMove, itemsForMove);
			return  newArr.concat(arr);
		}


		// Remove current slider and create new slides according to the "itemsArr"
		// slider - the main block ('.slider')
		// curWrap - current wrapper to remove
		// itemsArr - array with new items for wrapper
		function createNewSlides (slider, curWrap, itemsArr) {
			let	newWrap = document.createElement('div');

			newWrap.classList.add('slider__wrapper');
			for (let i = 0; i < itemsArr.length; i++) {
				newWrap.appendChild(itemsArr[i].item);
			}
			curWrap.remove();
			slider.appendChild(newWrap);
		}


		_items = createItemsArr(_sliderItems, _countOfArr);

		if (ratioToMoveElems > 1) {
			_items = arrPartitioning(_items);
		}

		createNewSlides(_mainElement, _sliderWrapper, _items);





		_mainElement = document.querySelector(selector); // основный элемент блока
		_sliderWrapper = _mainElement.querySelector('.slider__wrapper'); // обертка для .slider-item


			let wrapForMove = Math.floor(Math.floor(_items.length / _countOfArr) / elemInWrap); // number of wrappers lengths to move left
			_transform = -wrapForMove * 100;
			_sliderWrapper.style.transform = 'translateX(' + _transform + '%)';


			_wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width); // ширина обёртки
			// _wrapperWidth2 = _sliderWrapper.clientWidth;

			_itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width); // ширина одного элемента
			// _itemWidth2 = _sliderItems[0].clientWidth;

		let _positionLeftItem = 0; // позиция левого активного элемента


		// наполнение массива _items
		// _sliderItems.forEach(function (item) {
		// 	_items.push({item: item, transform: 0});
		// });
		_items.lastDirection = 'none';
		let _itemsLastIndex = _items.length - 1;


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

				if ((_items.lastDirection === 'left') || (_items.lastDirection === 'none')) {

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
			console.log(`lastDirection ${_items.lastDirection}`);
			console.log(`_items.lastDirection ${_items.lastDirection}`);
			console.log(_items);
		};

		// обработчик события click для кнопок "назад" и "вперед"
		var _controlClick = function (evt) {
			var direction = this.classList.contains('slider__control_right') ? 'right' : 'left';
			evt.preventDefault();
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

		// return {
		// 	right: function () { // метод right
		// 		_transformItem('right');
		// 	},
		// 	left: function () { // метод left
		// 		_transformItem('left');
		// 	}
		// }

	}
}());

var slider = multiItemSlider('.slider');