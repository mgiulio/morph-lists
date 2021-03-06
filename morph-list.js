var morphList = (function() {

	var
		slice = Array.prototype.slice,
		toArray = function(o, n) { 
			return slice.call(o, n || 0); 
		},
		augment = function(target) {
			var length = arguments.length;
			for (var index = 1; index < length; index++) {
				var 
					source = arguments[index],
					keys = Object.keys(source),
					l = keys.length
				;
				for (var i = 0; i < l; i++) {
					var key = keys[i];
					target[key] = source[key];
				}
			}
			return target;
		},
		
		source,
		sourceChildren,
		target,
		targetChildren,
		morphingClassName = 'morphing',
		defaultCfg = {
			duration: '1s',
			easing: 'ease-in-out'
		},
		cfg,
		itemStyle
	;
	
	return install;
	
	function install() {
		target = document.createElement('div');
		
		var style = document.createElement('style');
		style.textContent = '.' + morphingClassName + ' > li {  }';
		document.head.appendChild(style);
		itemStyle = style.sheet.cssRules[0].style;
		
		window.morphList = morphList;
		morphList.apply(this, arguments);
	}

	function morphList(_source, targetMarkup, _cfg) {
		source = _source;
		sourceChildren = source.children;
		
		cfg = augment({}, defaultCfg, _cfg || {});
		
		itemStyle.transition = 'transform ' + cfg.duration + ' ' + cfg.easing;
		
		target.innerHTML = targetMarkup;
		targetChildren = toArray(target.firstElementChild.children);

		animateMoves(findMoves(sourceChildren, targetChildren), function() {
			source.innerHTML = '';
			targetChildren.forEach(source.appendChild.bind(source));
		});
	}

	function findMoves(sourceChildren, targetChildren) {
		var moves = [];
		
		for (var i = 0; i < sourceChildren.length; i++) {
			var s = sourceChildren[i];
			for (var j = 0; j < targetChildren.length; j++) {
				if (s.id === targetChildren[j].id && i != j) {
					moves.push([i, j]);
					break;
				}
			}
		}
		
		return moves;
	}
	
	function animateMoves(moves, done) {
		source.addEventListener('transitionend', onTransitionEnd, false);

		source.classList.add(morphingClassName);
		
		moves.forEach(function(m) {
			var movingNode = sourceChildren[m[0]];
			var destNode = sourceChildren[m[1]];
			
			var displacement = [destNode.offsetLeft - movingNode.offsetLeft, destNode.offsetTop - movingNode.offsetTop];
			movingNode.style.transform = `translate(${displacement[0] + 'px'}, ${displacement[1] + 'px'})`;
		});
		
		function onTransitionEnd() {
			source.classList.remove(morphingClassName);
			source.removeEventListener('transitionend', onTransitionEnd, false);
			done();
		}
	}
 
})();
