$(document).ready(function() {
	var $main = $('.main-text');

	$main.on('click', '.nav-button', function(e) {
		e.preventDefault();
		var $currentPage = $(e.target).closest('.page'),
			pageNumber = $currentPage.data('page');
			
		$currentPage.hide();

		if ($currentPage.data('back')) {
			setPage(pageNumber - 1);
		} else {
			setPage(pageNumber + 1);
		}
	});

	$('#getStarted').on('click', function(e) {
		e.preventDefault();
		var $currentPage = $('.page');

		$currentPage.hide();
		setPage(2);
	});

	$('.nav-link').addClass('animated bounceInLeft');

	function setPage(newPage) {
		if (newPage === 1) {
			window.location.hash = '';
		} else {
			window.location.hash = newPage;
		}
		renderPage(newPage);
	}

	function renderPage(page) {
		var $currentPage = $('.page[data-page="'+page+'"]');
		$currentPage.fadeIn('slow');
	}

	setPage(1);
});