var morphList = (function() {

	var
		slice = Array.prototype.slice,
		toArray = function(o, n) { 
			return slice.call(o, n || 0); 
		},
		source,
		sourceChildren,
		targetChildren
	;
	
	return addCssRules;

	function morphList(_source, targetMarkup) {
		source = _source;
		sourceChildren = source.children;
		
		var target = document.createElement('div');
		target.innerHTML = targetMarkup;
		targetChildren = toArray(target.firstElementChild.children);

		animateMoves(findMoves(sourceChildren, targetChildren), function() {
			source.innerHTML = '';
			
			targetChildren.forEach(function(li) {
				source.appendChild(li);
			});
		});
		//animateSwap(0, 2);
		//findSwaps(sourceChildren, target.children).forEach(function(swap) { animateSwap(swap[0], swap[1]); });
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

	function findSwaps(source, target) {
		var 
			swaps = [],
			source = toArray(source),
			sl = source.length,
			tl = targetChildren.length,
			i, j
		;
		
		for (i = 0; i < sl; i++) {
			var s = source[i];
			for (j = 0; j < tl; j++) {
				var t = targetChildren[j];
				if (s.id === t.id && i != j) {
					swaps.push([i, j]);
					break;
				}
			}
		}
		
		return swaps;
	}

	function animateMoves(moves, done) {
		source.addEventListener('transitionend', function f(e) {
			source.classList.remove('morphing');
			source.removeEventListener('transitionend', f, false);
			done();
		}, false);

		source.classList.add('morphing');
		
		moves.forEach(function(m) {
			var movingNode = sourceChildren[m[0]];
			var destNode = sourceChildren[m[1]];
			
			var displacement = [destNode.offsetLeft - movingNode.offsetLeft, destNode.offsetTop - movingNode.offsetTop];
			movingNode.style.transform = `translate(${displacement[0] + 'px'}, ${displacement[1] + 'px'})`;
		});
	}

	function animateSwap(i, j) {
		var iNode = sourceChildren[i];
		var jNode = sourceChildren[j];
		
		var displacement = [jNode.offsetLeft - iNode.offsetLeft, jNode.offsetTop - iNode.offsetTop];
		iNode.style.transform = `translate(${displacement[0] + 'px'}, ${displacement[1] + 'px'})`;
		jNode.style.transform = `translate(-${displacement[0] + 'px'}, -${displacement[1] + 'px'})`;
		
		source.addEventListener('transitionend', function f(e) {
			source.removeEventListener('transitionend', f, false);
			
			iNode.style.transform = '';
			jNode.style.transform = '';
			
			var next = jNode.nextElementSibling;
			source.insertBefore(jNode, iNode);
			source.insertBefore(iNode, next);
		}, false);
	}
	 
	function addCssRules() {
		var style = document.createElement('style');
		style.textContent = '.morphing > li { transition: transform 1s linear; }';
		document.head.appendChild(style);
		
		window.morphList = morphList;
		morphList.apply(this, arguments);
	}

})();
