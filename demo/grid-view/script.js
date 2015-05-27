var 
	size = 20,
	completedProb = 0.4,
	//l = document.getElementById('list')
	collection,
	sourceList
;

init();

function init() {
	generateCollection(size);
	
	var html = listTemplate(collection);
	var listCont = document.getElementById('list-container');
	listCont.innerHTML = html;
	sourceList = listCont.firstElementChild;
	
	document.getElementById('toolbar').addEventListener('click',  buttonHandler, false);
}

// Model

function generateCollection(n) {
	var 
		item
	;
	
	collection = new Array(n);
	
	for (var i = 1; i <= n; i++) {
		item = {
			id: `item-${ i < 10 ? '0' + i : i }`,
			title: `Item #${i}`,
			completed: Math.random() <= completedProb
		};
		
		collection[i - 1] = item;
	}
	
}

function compareItems(item1, item2) { 
	if (item1.id < item2.id)
		return -1;
	else if (item1.id == item2.id)
		return 0;
	else
		return 1;
}
	
function sortAsc(items) {
	items.sort(compareItems);
}

function sortDesc(items) {
	items.sort(function(item1, item2) { return -1 * compareItems(item1, item2); });
}

// Templating

function listTemplate(items) {
	return `
		<ul id="list">
			${ items.map(function(item, i) { return `<li id="${item.id}"  class="item${ item.completed ? ' completed' : '' }">${item.title}</li>`; }).join('') }
		</ul>
	`;
}

// UI

function buttonHandler(e) {
	if (e.target.tagName != 'BUTTON')
		return;
	
	e.stopPropagation();
	
	switch (e.target.id) {
		case 'sort-asc':
			sortAsc(collection);
			break;
		case 'sort-desc':
			sortDesc(collection);
			break;
		case 'shuffle':
			collection = shuffle(collection);
			break;
	}
	
	var html = listTemplate(collection);
	var duration = 0.5 + Math.random() * 5;
	morphList(sourceList, html, {'duration':  duration + 's'});
}

// Adapted from Underscore.js
function shuffle(array) {
	var 
		l = array.length,
		shuffled = new Array(l),
		i,
		rand
	;
	
	for (i = 0; i < l; i++) {
		rand = random(0, i);
		if (rand !== i) 
			shuffled[i] = shuffled[rand];
		shuffled[rand] = array[i];
	}
	
	return shuffled;
}

// Return a random integer between min and max (inclusive). From Underscore.js
 function random(min, max) {
	if (max == null) {
	  max = min;
	  min = 0;
	}
	return min + Math.floor(Math.random() * (max - min + 1));
}