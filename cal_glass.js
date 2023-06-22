var defImgSrc = "./img/";
var imgSrc = defImgSrc;
var	item = [[6000, 8200, 16000]
			,[7000, 8200, 9600]
			,[8000, 9200, 7600]
			,[9000, 8200, 7600]
			,[6000, 5200, 6600]
			,[7000, 4200, 6600]
			,[8000, 5200, 7600]
			,[9000, 6200, 8600]
			,[6000, 8200, 7600]];
var selItem = [];

$(function(){
	// 01. 거울 색상 선택
	$(".glassSort li").click(function(){
		$(".glassSort li").removeClass('selected');
		$(this).addClass('selected');
		
		imgSrc = defImgSrc + "glass_" + $(this).find('input').val() + ".png";
		selItem = item[$(this).find('a').attr('gid')];	

		$("#selected_glass_link img").attr('src', imgSrc);

		initStatus();

		$("#glasstype_select").attr("disabled", false);
		$("#glasssize_width").attr("disabled", false);
		$("#glasssize_height").attr("disabled", false);
		$("#glasssize_count").attr("disabled", false);

		$("#glasssize_count").val("1");
	});

	// 값 변경
	$("#glasstype_select").change(function(){
		$("#glasssize_width").val("");
		$("#glasssize_height").val("");
		$("#glasssize_diameter").val("");
		
		// 원형 > 지름값 / 이외에는 가로 * 세로
		if($(this).val() == "1"){
			$("._li_basic_val").hide();
			$("._li_circle_val").show();
		}else{
			$("._li_basic_val").show();
			$("._li_circle_val").hide();
		}
			
		set_cal_price();
	});

	// 비상방지안전시트 
	$("input[name=chk_sheet]").change(function(){
		set_cal_price();
	});
	
	// 지름 값
	$('#glasssize_diameter').on('keyup', function(){
		if(parseInt($('#glasssize_diameter').val().replace(/[^0-9]/, '')) > 2400){
			alert('선택하신 거울의 최대 지름은 900mm 를 초과하실 수 없습니다.');
			$('#glasssize_diameter').val("900");
		}
		
		$("#glasssize_width").val($(this).val());
		$("#glasssize_height").val($(this).val());
		
		set_cal_price();
	});
	
	$('#glasssize_width, #glasssize_height, #glasssize_count').on('keyup', function(){			
		// 거울 : 가로 X 세로 : 2400 * 1200 / 1200 * 2400
		if(parseInt($('#glasssize_width').val().replace(/[^0-9]/, '')) > 2400){
			alert('선택하신 거울의 최대 가로 폭은 2400mm 를 초과하실 수 없습니다.');
			$('#glasssize_width').val("2400");
		}
		
		if( parseInt($('#glasssize_width').val().replace(/[^0-9]/, '')) > 1200
		 && parseInt($('#glasssize_height').val().replace(/[^0-9]/, '')) > 1200){

			alert('선택하신 거울의 최대 길이는 1200mm 를 초과하실 수 없습니다.');
			$('#glasssize_height').val("1200");
		}
		
		if(parseInt($('#glasssize_height').val().replace(/[^0-9]/, '')) > 2400){
			alert('선택하신 목재의 최대 길이는 2400mm 를 초과하실 수 없습니다.');
			$('#glasssize_height').val("2400");
		}
		
		set_cal_price();
	});
	
	// 카트 담기
	$("#add_glass_cart").click(function(){
		addCart();
	});
	
	// 카트 내역 삭제
	$("#select_delete_cart").click(function(){
		if($('#glass_cal_cart > tbody tr').length == 0 ) {
			alert("견적서에 상품이 없습니다.");
			return;
		}
		
		if($('#glass_cal_cart > tbody tr .glasscheck input:checked').length == 0 ) {
			alert("선택된 상품이 없습니다.");
			return;
		}
		del_glass_cart();
	});
	
	$("#all_delete_cart").click(function(){	
		if($('#glass_cal_cart > tbody tr').length == 0 ) {
			alert("견적서에 상품이 없습니다.");
			return;
		}

		$('#glass_cal_cart > tbody').html('');
		cal_total_price();
	});

	// 이메일 보내기
	$("#send_email").click(function(){	
		send_email();
	});
});

// 값 초기화
function initStatus(){
	imgSrc = defImgSrc;
	
	$('#glasstype_select').val('').prop("selected",true);
	$("#glasssize_width").val("");
	$("#glasssize_height").val("");
	$("#glasssize_diameter").val("");
	$("#glasssize_count").val("");
	$("#glasssize_price").val("");
	$('input[name=chk_sheet]').prop('checked', false);
}

// 금액 계산
function set_cal_price(){
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

	// 100원 단위 반올림
	$("#glasssize_price").val(mark_num(Math.round(price/1000)*1000));
}

function mark_num(num){
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 자평 계산
function calJa (n){
	var cut = n%300;
	var ja = Math.floor(n/300) + 1;
	if ( cut == 0){
		ja = ja - 1;
	}
	
	return ja;
}

// 거울(물품) 담기
function addCart(){	
	// 빈값 체크
	if($('#glasstype_select').val() == ""){
		alert("모양을 선택하세요.");
		$("#glasstype_select").focus();
		return;
	}

	if($('#glasssize_width').val() == ""){
		alert("가로 값을 입력하세요.");
		$("#glasssize_width").focus();
		return;
	}
	
	if($('#glasssize_height').val() == ""){
		alert("세로 값을 입력하세요.");
		$("#glasssize_height").focus();
		return;
	}
	
	if($('#glasssize_count').val() == ""){
		alert("수량을 입력하세요.");
		$("#glasssize_count").focus();
		return;
	}
	
	if($('input[name=chk_sheet]:checked').val() == undefined){
		alert("비상방지안전시트를 선택하세요.");
		$("#input[name=chk_sheet]").focus();
		return;
	}

	var html = "";
	
	html = "<tr>";
	html += "	<input type='hidden' name='index' value='" + $('#glass_cal_cart > tbody tr').length + "'/>";
	html += "	<td class='glasscheck'>";
	html += "		<input type='checkbox'/>";
	html += "	</td>";
	html += "	<td class='glassname'>" + $(".glassSort ul li.selected a")[0].innerText + "<br>[ " + $('#glasssize_width').val() + " X " + $('#glasssize_height').val() + " ] </td>" ;
	html += "	<td class='glasscount'>" + mark_num($("#glasssize_count").val()) + "</td>";
	html += "	<td class='glasstype'>" + $("#glasstype_select option:checked").text() + "</td>";
	html += "	<td class='glasssheet'>" + $('input[name=chk_sheet]:checked').val() + "</td>";
	html += "	<td class='glassprice'>" + $("#glasssize_price").val() + "</td>";
	
	html += "</tr>";
	
	$('#glass_cal_cart > tbody').append(html);
	
	cal_total_price();
}

// 장바구니에 담긴 값의 토탈 값
function cal_total_price(){
	var tot_cnt = 0;
	var tot_price = 0;
	
	$('#glass_cal_cart > tbody .glasscount').each(function(){
		tot_cnt += parseInt($(this).text().replace(/,/g, ""));
	});
	
	$('#glass_cal_cart > tbody .glassprice').each(function(){
		tot_price += parseInt($(this).text().replace(/,/g, ""));
	});
	
	$("#tot_count").text(mark_num(tot_cnt));
	$("#tot_price").text(mark_num(tot_price));
}

// 장바구니 삭제
function del_glass_cart(){
	$('#glass_cal_cart > tbody tr .glasscheck input:checked').each(function(){
		$(this).parents('tr').remove();
	});
	
	cal_total_price();
}


// 이메일 보내기
function send_email(){
	if($('#glass_cal_cart > tbody tr').length == 0 ) {
		alert("견적서에 상품이 없습니다.");
		return;
	}
	
	if($('#order_name').val() == "" ){
		alert("주문자 명을 입력해주세요.");
		return;
	}
	if($('#order_tel').val() == "" ){
		alert("연락처를 입력해주세요.");
		return;
	}
	if($('#order_email').val() == "" ){
		alert("이메일을 입력해주세요.");
		return;
	}

	if($("#agree_privacy:checked").length == 0 ){
		alert("개인정보 취급동의에 체크해주세요.");
		return;
	}	
	
	$('#name').val($('#order_name').val());
	$('#tel').val($('#order_tel').val());
	$('#email').val($('#order_email').val());
	$('#price_total').val($('#tot_price').text());
	$('#price_count').val($('#tot_count').text());
	$('#memo').val($('#order_memo').val());
	
	var cartTxt = "";
	
	$('#glass_cal_cart > tbody tr').each(function(){
		if($(this).find('input[name="index"]').val() != 0){
			cartTxt += "/"
		}
		cartTxt += $(this).find('.glassname').text() + "|" + $(this).find('.glasscount').text() + "|" + $(this).find('.glasstype').text() + "|" ;
		cartTxt += $(this).find('.glasssheet').text() + "|" + $(this).find('.glassprice').text();
	});
	
	
	$('#cart').text(cartTxt);
	
	var queryString = $("form[name=emailfrm]").serialize() ;

	$.ajax({
		data : queryString,
		type : 'post',
		url : 'https://script.google.com/macros/s/AKfycbzqlHRY8xWh-TXOPF9h-b5xZsaAk4OwciP-zH6Bx6kRHfmLqpHUXo63np8nmgYOLgeoXA/exec',
		dataType : 'json',
		error: function(xhr, status, error){
			alert(error);
		},
		success : function(json){
			alert("견적서가 발송되었습니다.");
		}
	});
	
}