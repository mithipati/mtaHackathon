$(document).ready(function() {
	var $main = $('.main-text');

	$main.on('click', '.nav-button', function(e) {
		e.preventDefault();
		var $targetPage = $('.page[data-page="2"]'),
			$previousPage = $('.page[data-page="1"]');
		$('.welcome-text').addClass('animated fadeOutLeft');
		$('.sub-text').addClass('animated fadeOutLeft');
		$('.welcome-text').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
			function() {
				$previousPage.hide();
				$targetPage.show();
				$('#vis').addClass('animated fadeInRight');
				$('.status-text').addClass('animated fadeInRight');
				$('#progress').css('width', '25%');
				window.location.hash = '2';
			}
		);
	});

	$main.on('click', '.view-card', function(e) {
		e.preventDefault();
		var $targetPage = $('.page[data-page="3"]'),
			$previousPage = $('.page[data-page="2"]');
		$('#vis').addClass('animated fadeOutLeft');
		$('.status-text').addClass('animated fadeOutLeft');
		$('#vis').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
			function() {
				$previousPage.hide();
				$targetPage.show();
				$('#vis').removeClass('animated fadeInLeft');
				$('.next-button').removeClass('animated fadeInDown');
				$('.next-button').fadeOut();
				$('.status-text').removeClass('animated fadeInLeft');
				$('.card-container').addClass('bounceInRight');
				$('#progress').css('width', '50%');
				window.location.hash = '3';
			}
		);
	});

	$main.on('click', '.dismiss', function(e) {
		e.preventDefault();
		dismissCard();
	});

	$('.card-container').addClass('animated bounceInRight');
	$('.nav-link').addClass('animated bounceInLeft');

	$.ajax({
		// url: 'http://default-environment-8k3maxsvf3.elasticbeanstalk.com/laf/category/Currency',
		url: 'http://default-environment-8k3maxsvf3.elasticbeanstalk.com/laf/latest',
		dataType: 'json'
	}).success(function(data) {
		console.log(data);
	});

	function setPage(newPage, isBack) {
		if (newPage === 1) {
			window.location.hash = '';
		} else {
			window.location.hash = newPage;
		}
		renderPage(newPage, isBack);
	}

	function renderPage(page, isBack) {
		var $targetPage = $('.page[data-page="'+page+'"]'),
			$previousPage;

		if (page !== 1) {
			if (isBack) {
				$previousPage = $('.page[data-page="'+(page+1)+'"]');
			} else {
				$previousPage = $('.page[data-page="'+(page-1)+'"]');
			}
			$previousPage.hide();
		}

		$targetPage.fadeIn('slow');
	}

	function dismissCard() {
		var $targetPage = $('.page[data-page="2"]'),
			$previousPage = $('.page[data-page="3"]');
	
		$('.card-container').addClass('animated bounceOutRight');
		$('#vis').removeClass('animated fadeOutLeft');
		$('.status-text').removeClass('animated fadeOutLeft');
		$('#vis').removeClass('animated fadeInRight');
		$('.status-text').removeClass('animated fadeInRight');

		$('.card-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
			function() {
				$previousPage.hide();
				$targetPage.fadeIn('fast');
				$('.card-container').removeClass('bounceOutRight');
				$('#vis').addClass('animated fadeInLeft');
				$('.status-text').addClass('animated fadeInLeft');
				$('#progress').css('width', '25%');
				window.location.hash = '2';
			}
		);
	}

	setPage(1);
});