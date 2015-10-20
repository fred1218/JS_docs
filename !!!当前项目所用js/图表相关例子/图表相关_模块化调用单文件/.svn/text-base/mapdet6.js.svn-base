$(function() {

	var $el1 = $('#add1'),
		$el2 = $('#add2'),
		$el3 = $('#add3'),
		$el4 = $('#add4');
	var $tel = $('#addTotal');

	function addNum($el) {
		var dual = $el.data('per');
		var t = setInterval(function() {
			var dataOld = $el.data('old');
			var num = (Math.random() * 10).toFixed(2);
			var total = parseFloat(dataOld, 10) + parseFloat(num, 10);
			$el.data('old', total).text(total.toLocaleString());
		}, dual)
	}

	//以最小变化的那个为准
	function getAddNum(callback) {
		setInterval(function() {
			var dataorigin = parseFloat($tel.data('origin'), 10);
			var dataOld = parseFloat($tel.data('old'), 10);
			var dataNew = parseFloat($el1.data('old'), 10) + parseFloat($el2.data('old'), 10) + parseFloat($el3.data('old'), 10) + parseFloat($el4.data('old'), 10);
			$tel.data('old', dataNew).text(dataNew.toLocaleString());
			var cha = (dataNew - dataorigin).toFixed(2);
			callback(cha);
		}, 500)
	}


	addNum($el1);
	addNum($el2);
	addNum($el3);
	addNum($el4);
	getAddNum(fly);
	var $fly = $('#addAni');

	var flag = 0,
		begin = false;

	function fly(num) {
		$('#tellnum').html(num);
		if (num > 100) {
			if (begin) {
				var n = Math.floor(num / 100);
				if (n - flag) {
					flag = n;
					$fly.css({
						bottom: '-0px'
					});
				} else {
					$fly.animate({
						bottom: '+=50px'
					});
				}
			} else {
				begin = true;
				flag = Math.floor(num / 100);
				$fly.css({
					bottom: '-0px'
				});

			}

		} else {
			$fly.animate({
				bottom: '+=50px'
			});
		}

	}


})