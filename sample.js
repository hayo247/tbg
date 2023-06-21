var defImgSrc = "./img/";
var imgSrc = defImgSrc;
var	item = [[6000, 8000, 10000]
			,[7000, 8000, 9000]
			,[8000, 9000, 7000]
			,[9000, 8000, 7000]
			,[6000, 5000, 6000]
			,[7000, 3000, 6000]
			,[8000, 5000, 7000]
			,[9000, 6000, 8000]
			,[6000, 8000, 7000]];
var selItem = [];

$(function(){
	$(".glassSort li").click(function(){
		$(".glassSort li").removeClass('selected');
		$(this).addClass('selected');
		
		imgSrc = defImgSrc + "glass_" + $(this).find('input').val() + ".png";
		selItem = item[$(this).find('a').attr('gid')];	

		$("#selected_glass_link img").attr('src', imgSrc);

		initStatus();
		$("#glasssize_count").val("1");
	});

	$("#glasstype_select, input[name=chk_sheet]").change(function(){
		setPrice();
	});
	
	$('#glasssize_width, #glasssize_height, #glasssize_count').on('keyup', function(){		
		if(parseInt($('#glasssize_width').val().replace(/[^0-9]/, '')) > 2400){
			alert('선택하신 목재의 최대 폭은 2400mm 를 초과하실 수 없습니다.');
			$('#glasssize_width').val("2400");
		}
		
		if(parseInt($('#glasssize_height').val().replace(/[^0-9]/, '')) > 2400){
			alert('선택하신 목재의 최대 길이는 2400mm 를 초과하실 수 없습니다.');
			$('#glasssize_height').val("2400");
		}
		
		setPrice();
	});
	
	$("#add_glass_cart").click(function(){
		addCart();
	});
	

});

// 값 초기화
var initStatus = function(){
	imgSrc = defImgSrc;
	
	$('#glasstype_select').val('').prop("selected",true);
	$("#glasssize_width").val("");
	$("#glasssize_height").val("");
	$("#glasssize_count").val("");
	$("#glasssize_price").val("");
	$('input[name=chk_sheet]').prop('checked', false);
}

// 금액 계산
var setPrice = function(){
	var input_width = 0;
	var input_height = 0;
	var input_price = 0;
	var price = 0;
	var totalJa = 0;

	if($("#glasstype_select").val() != ''){
		input_price = parseInt(selItem[$("#glasstype_select").val()]);
	}
	
	if($('#glasssize_width').val().replace(/[^0-9]/, '') != ''){
		input_width = parseInt($('#glasssize_width').val());
	}
	
	if($('#glasssize_height').val().replace(/[^0-9]/, '') != ''){
		input_height = parseInt($('#glasssize_height').val());
	}
	
	totalJa = calJa(input_width) * calJa(input_height);
	
	price = input_price * totalJa * $("#glasssize_count").val();

	if($('input[name=chk_sheet]:checked').val() == "추가"){
		price = price + totalJa * 1500 * $("#glasssize_count").val();
	}

	$("#glasssize_price").val(price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
}

// 자평 계산
var calJa = function(n){
	var cut = n%300;
	var ja = Math.floor(n/300) + 1;
	if ( cut == 0){
		ja = ja - 1;
	}
	
	return ja;
}

// 목재 담기
var addCart = function(){
	var html = "";
	
	html = "<tr>";
	html += "	<input type='hidden' name='count' value='" + $("#glasssize_count").val() + "'/>";
	html += "	<input type='hidden' name='price' value='" + $("#glasssize_price").val() + "'/>";
	html += "	<td class='glasscheck'>";
	html += "		<input type='checkbox'/>";
	html += "	</td>";
	html += "	<td class='glassname'>" + $(".glassSort ul li.selected a")[0].innerText + "<br>[ " + $('#glasssize_width').val() + " X " + $('#glasssize_height').val() + " ] </td>" ;
	html += "	<td class='glasscount'>" + $("#glasssize_count").val() + "</td>";
	html += "	<td class='glasstype'>" + $("#glasstype_select option:checked").text() + "</td>";
	html += "	<td class='glasssheet'>" + $('input[name=chk_sheet]:checked').val() + "</td>";
	html += "	<td class='glassprice'>" + $("#glasssize_price").val() + "</td>";
	
	html += "</tr>";
	
	$('#glass_cal_cart > tbody').append(html);
	
	cal_total_price();
}

var cal_total_price = function(){
	var tot_cnt = 0;
	var tot_price = 0;
	
	$('#glass_cal_cart > tbody input[name="count"]').each(function(){
		tot_cnt += parseInt($(this).val());
	});
	
	$('#glass_cal_cart > tbody input[name="price"]').each(function(){
		tot_price += parseInt($(this).val().replace(/,/g, ""));
	});
	
	$("#tot_count").text(tot_cnt);
	$("#tot_price").text(tot_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
}