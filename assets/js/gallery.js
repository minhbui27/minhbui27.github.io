/*
	Photo grids, driven from the HTML.

	Put this anywhere in the page (any folder name works):

		<div class="insta-grid" data-folder="images/2025-Japan"></div>

	and the script fills it with the photos of that folder. Write whatever
	HTML you like around it - headings, text, more grids.

	The folder must contain a captions.csv listing every photo, one line
	per photo:

		1,A caption for img1
		2,
		3,"Commas, inside a caption, are fine"

	The number N refers to imgN.jpg (also tries .jpeg/.png/.webp/.gif).
	An empty caption after the comma (or a line with just the number) means
	no caption - the lightbox then shows no caption bar. Photos are shown in
	numerical order; gaps in the numbering are fine. A header line like
	"number,caption" is ignored automatically.
*/

(function($) {

	var EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

	// Resolves to the URL of <dir>/img<n>.<ext> if it exists, else null.
	function findImage(dir, n) {
		return new Promise(function(resolve) {
			(function tryExt(i) {
				if (i >= EXTENSIONS.length)
					return resolve(null);
				var url = dir + '/img' + n + '.' + EXTENSIONS[i];
				var probe = new Image();
				probe.onload = function() { resolve(url); };
				probe.onerror = function() { tryExt(i + 1); };
				probe.src = url;
			})(0);
		});
	}

	// Parses captions.csv into [{n, caption}] sorted by n, or null if absent.
	async function loadManifest(dir) {
		var text;
		try {
			var response = await fetch(dir + '/captions.csv');
			if (!response.ok)
				return null;
			text = await response.text();
		} catch (e) {
			return null;
		}

		var entries = [];
		text.split(/\r?\n/).forEach(function(line) {
			var comma = line.indexOf(',');
			var numberField = comma < 0 ? line : line.slice(0, comma);
			var n = parseInt(numberField.trim(), 10);
			if (isNaN(n))
				return;
			var caption = comma < 0 ? '' : line.slice(comma + 1).trim();
			if (caption.length >= 2 && caption[0] === '"' && caption[caption.length - 1] === '"')
				caption = caption.slice(1, -1);
			entries.push({ n: n, caption: caption });
		});
		entries.sort(function(a, b) { return a.n - b.n; });
		return entries;
	}

	async function buildGrid($grid) {
		var dir = String($grid.data('folder')).replace(/\/+$/, '');
		var entries = await loadManifest(dir);
		if (!entries || !entries.length) {
			console.warn('gallery: no captions.csv found in ' + dir + ' (or it lists no photos)');
			return;
		}

		var urls = await Promise.all(entries.map(function(entry) {
			return findImage(dir, entry.n);
		}));

		entries.forEach(function(entry, i) {
			if (!urls[i]) {
				console.warn('gallery: ' + dir + '/img' + entry.n + ' is listed in captions.csv but no image file was found');
				return;
			}
			$('<article class="work-item"></article>')
				.append($('<a class="image thumb"></a>').attr('href', urls[i])
					.append($('<img />').attr({ src: urls[i], alt: entry.caption })))
				.append($('<h3></h3>').text(entry.caption))
				.appendTo($grid);
		});

		// Lightbox (same options main.js used for the old static gallery).
		$grid.poptrox({
			caption: function($a) { return $a.next('h3').text(); },
			overlayColor: '#2c2c2c',
			overlayOpacity: 0.85,
			popupBlankCaptionText: '',
			popupCloserText: '',
			popupLoaderText: '',
			selector: '.work-item a.image',
			usePopupCaption: true,
			usePopupDefaultStyling: false,
			usePopupEasyClose: false,
			usePopupNav: true,
			windowMargin: ((typeof breakpoints !== 'undefined' && breakpoints.active('<=small'))
				? 0
				: Math.round(Math.min($(window).width(), $(window).height()) * 0.075))
		});
	}

	$(function() {
		$('.insta-grid[data-folder]').each(function() {
			buildGrid($(this));
		});
	});

})(jQuery);
