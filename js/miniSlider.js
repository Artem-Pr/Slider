'use strict';
let multiItemSlider = (function () {
	return function (selector, config) {
		let _mainElement = document.querySelector(selector), // the main block ('.slider')
			_sliderItems = _mainElement.querySelectorAll('.miniSlider__item'), // elements (.slider-item)
			_sliderControls = _mainElement.querySelectorAll('.miniSlider__control'), // control buttons
			_sliderWrapper = _mainElement.querySelector('.miniSlider__wrapper'), // wrapper for .slider-item
			_wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // wrapper width
			_itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // item width

			_items = [], // array for slider items
			_transform = 0, // value of transform .miniSlider__wrapper
			_timerId = 0,
			_config = {
				isCycling: false, // automatic slider change
				direction: 'right', // slider change direction
				interval: 1000, // automatic slider change interval
				pause: true, // set a pause when hovering the mouse over the slider
				slidesCount: 1 // slider duplication count
			};

		const _precision = 1000,
			_step = Math.round(_itemWidth / _wrapperWidth * 100 * _precision) / _precision, // step size for transform
			_elemsInWrap = Math.round(_wrapperWidth / _itemWidth * _precision) / _precision, // number of items contained in wrapper
			_ratioToMoveElems = Math.round((_sliderItems.length * _config.slidesCount - _elemsInWrap) * _precision) / _precision; // number of items outside the wrapper


		for (let key in config) {
			if (key in _config) {
				_config[key] = config[key];
			}
		}


		// create slider's duplicates and put it in _items array
		// items - '.miniSlider__item' array
		// count - slider duplication count
		function createSlideDupArr(items, count) {
			let newItem, // new items for clone '.miniSlider__item' elements
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
		// items - '.miniSlider__item' array
		function fillSlideArr(items) {
			let newItem, // new items for clone '.miniSlider__item' elements
				newArr = []; // array for filling with new elements

			for (let i = 0; i < items.length; i++) {
				if (_ratioToMoveElems > 1) newItem = items[i].cloneNode(true); // if we will change the wrapper
				else newItem = items[i];  // if we won't change the wrapper
				newArr.push({item: newItem, index: i, transform: 0});
			}
			return newArr;
		}


		// Create and return new array of slider elements
		// items - '.miniSlider__item' array
		// count - slider duplication count
		function createItemsArr(items, count) {
			if (count > 1) return createSlideDupArr(items, count); // if we need more than 1 copy of slides
			return fillSlideArr(items); // if we need only 1 copy of slides
		}


		// return number of items to move left
		// arr - the current array
		// elemsInWrap - the number of items are contained in wrapper
		function numberOfLeftItems(arr, elemsInWrap) {
			return Math.floor((arr.length - elemsInWrap) / 2);
		}

		// Сut the second part of the current array and place it at the beginning of the array (current array is broken!)
		// arr - the current array
		// elemsInWrap - the number of items are contained in wrapper
		function arrPartitioning(arr, elemsInWrap) {
			let itemsForMove = numberOfLeftItems(arr, elemsInWrap);
			let newArr = arr.splice(-itemsForMove, itemsForMove);
			return newArr.concat(arr);
		}


		// Remove current slider and create new slides according to the "itemsArr"
		// slider - the main block ('.miniSlider')
		// curWrap - current wrapper to remove
		// itemsArr - array with new items for wrapper
		function createNewSlides(slider, curWrap, itemsArr) {
			let newWrap = document.createElement('div');

			newWrap.classList.add('miniSlider__wrapper');
			for (let i = 0; i < itemsArr.length; i++) {
				newWrap.appendChild(itemsArr[i].item);
			}
			curWrap.remove();
			slider.appendChild(newWrap);
		}


		// create new slides and initialize slider again
		function createDOMSlider() {
			createNewSlides(_mainElement, _sliderWrapper, _items);
			_mainElement = document.querySelector(selector); // the main block ('.miniSlider')
			_sliderWrapper = _mainElement.querySelector('.miniSlider__wrapper'); // wrapper for .miniSlider-item
		}


		// move the wrapper focus
		function moveTheFocus() {
			let leftItemsCount = numberOfLeftItems(_items, _elemsInWrap);
			_transform = -leftItemsCount * _step;
			_sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
		}


		_items = createItemsArr(_sliderItems, _config.slidesCount);
		if (_ratioToMoveElems > 1) {  // if we need to move some items from the end of array, to the start of array
			_items = arrPartitioning(_items, _elemsInWrap);
			createDOMSlider();
			moveTheFocus();
		} else if (_config.slidesCount > 1) {  // if we need only to create some clones of items
			createDOMSlider();
		}

		let _positionLeftItem = 0; // position of the left active element
		_items.lastDirection = 'none';



		let _transformItem = function (direction) {
			if (direction === 'right') {
				if (_items.lastDirection === 'right') {
					let returnWay = _items[0].transform + _items.length * 100;

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
					let returnWay = _items[_items.length - 1].transform - _items.length * 100;

					_items[_items.length - 1].transform = returnWay;
					_items[_items.length - 1].item.style.transform = 'translateX(' + returnWay + '%)';
					_items.unshift(_items.pop());
				}
				_items.lastDirection = 'left';
				_positionLeftItem--;
				_transform += _step;
			}

			_sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
		};


		// automatic slider change
		let _cycle = function (isCycling, direction, interval) {
			if (isCycling) {
				_timerId = setInterval(() => {
					_transformItem(direction);
				}, interval);
			}
		};

		let _controlClick = function (evt) {
			let direction = this.classList.contains('miniSlider__control_right') ? 'right' : 'left';
			evt.preventDefault();
			_transformItem(direction);
		};

		let _setUpListeners = function () {
			_sliderControls.forEach(function (item) {
				item.addEventListener('click', _controlClick);
			});
			_mainElement.addEventListener('mouseenter', () => {
				if (_config.pause) clearInterval(_timerId);
			});
			_mainElement.addEventListener('mouseleave', () => {
				if (_config.pause) {
					clearInterval(_timerId);
					_cycle(_config.isCycling, _config.direction, _config.interval);
				}
			})
		};

		_setUpListeners();
		_cycle(_config.isCycling, _config.direction, _config.interval);
	}
}());

let miniSlider = multiItemSlider('.miniSlider', {
	isCycling: true,
});