$(document).ready(function() {
	var $main = $('.main-text');

	$main.on('click', '.nav-button', function(e) {
		e.preventDefault();
		setPage(2);
	});

	$main.on('click', '.view-card', function(e) {
		e.preventDefault();
		setPage(3);
	});

	$('.card-container').addClass('animated bounceInUp');
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
		var $targetPage = $('.page[data-page="'+page+'"]'),
			$previousPage;

		if (page !== 1) {
			$previousPage = $('.page[data-page="'+(page-1)+'"]');
			$previousPage.hide();
		}

		switch (page) {
			case 2:
				break;
			default:
				break;
		}

		$targetPage.fadeIn('slow');
	}

	setPage(1);
});