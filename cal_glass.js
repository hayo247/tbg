var defImgSrc = "./img/";
var imgSrc = defImgSrc;
var selItem =[];
var images = [];

function preload() {
	var src = defImgSrc + "glass/default/";
	
	for(let i = 0; i < preload.arguments.length; i++) {
		for(let j = 0; j < preload.arguments[i].length; j++) {
			images[preload.arguments[i][j]] = new Image();
			images[preload.arguments[i][j]].src = src + preload.arguments[i][j] + ".jpg";
		}
	}
}

$(function(){
	$("#market_name").val(getParameter("to"));
	$('#loading').hide(); //첫 시작시 로딩바를 숨겨준다.

	preload(marble, wood, pattern)

	// ================ MO START ======================

	if(isMobile()){
		$("body").addClass('mobile');
		$(".mo_select_glasstype").show();
		$(".glass_group_step1").hide();
		$(".glass_group_step2").hide();

		// 타입 선택 select
		$("#sel_glass_group_step1").change(function(){		
			if($(this).val() == ""){
				$("#sel_glass_group_step2").val("");
				$('.tp_step3').hide();
				$("#sel_glass_group_step2").attr('disabled', true);
			}else{
				$("#sel_glass_group_step2").attr('disabled', false);
			}
			fn_typeSortLi($(".glass_group_step1 input[value='" + $(this).val() + "']").parents('li'));
		});
		
		// 타입 선택 select
		$("#sel_glass_group_step2").change(function(){
			if($(this).val() == ""){
				$('.tp_step3').hide();
			}
			fn_typeSortLi($(".glass_group_step2 input[value='" + $(this).val() + "']").parents('li'));
		});
	}
	// ================ MO END ======================

	// 타입 선택
	$(".glassTypeSort li").click(function(){
		fn_typeSortLi(this);
	});

	// 값 변경
	$("#glasstype_select").change(function(){
		initStatus();	
		
		// 원형 > 지름값 / 이외에는 가로 * 세로
		if($(this).val() == "1"){
			$("._li_basic_val").hide();
			$("._li_circle_val").show();
		}else{
			$("._li_basic_val").show();
			$("._li_circle_val").hide();
		}
		
		// 안전모서리 노출 여부
		if($(this).val() == "0"){
			$(".li_safe_where").show();
			$(".li_safe_size").show();
		}else{
			$(".li_safe_where").hide();
			$(".li_safe_size").hide();
		}
			
		set_cal_price();
	});

	// 옵션 값 변경시 값 재설정
	$("input[name=chk_sheet], #sel_safe_where, #sel_safe_size").change(function(){
		if($(this).attr('id') == "sel_safe_where"){
			if($(this).val() == "" || $(this).val() == "0"){
				$(".li_safe_size").hide();
				$('#sel_safe_size').val('').prop("selected",true);
			}else{
				$(".li_safe_size").show();
			}
		}			
		set_cal_price();
	});
	
	// 지름 값
	$('#glasssize_diameter').on('keyup', function(){
		if(parseInt($('#glasssize_diameter').val().replace(/[^0-9]/, '')) > 1500){
			layer_popup($("#layer_alert"), "A", "선택하신 거울의 최대 지름은 1500mm 를 초과하실 수 없습니다.");
			$('#glasssize_diameter').val("1500");
		}
		
		$("#glasssize_width").val($(this).val());
		$("#glasssize_height").val($(this).val());
		
		set_cal_price();
	});
	
	$('.button-guide').on('mouseover click', function(){
		var $el = $(this);
		$el.attr('aria-expanded',true);
		$el.next().show();

		$('.box-guide-close').on('click', function(){
			$el.attr('aria-expanded',false);
			$el.next().hide();
		});
	});
	
	$('.button-guide').on('mouseout', function(){
		$(this).attr('aria-expanded',false);
		$(this).next().hide();
	});
	
	$('#glasssize_width, #glasssize_height, #glasssize_count').on('keyup', function(){			
		$(this).val($(this).val().replace(/[^0-9]/g, ""));
		
		// 거울 : 가로 X 세로 : 2400 * 1200 / 1200 * 2400 , 최소값 : 100mm
		if(parseInt($('#glasssize_width').val().replace(/[^0-9]/, '')) > 2400){
			layer_popup($("#layer_alert"), "A", '선택하신 거울의 최대 가로 폭은 2400mm 를 초과하실 수 없습니다.');
			$('#glasssize_width').val("2400");
		}
		
		if( parseInt($('#glasssize_width').val().replace(/[^0-9]/, '')) > 1200
		 && parseInt($('#glasssize_height').val().replace(/[^0-9]/, '')) > 1200){
			layer_popup($("#layer_alert"), "A", '선택하신 거울의 최대 길이는 1200mm 를 초과하실 수 없습니다.');
			$('#glasssize_height').val("1200");
		}
		
		if(parseInt($('#glasssize_height').val().replace(/[^0-9]/, '')) > 2400){
			layer_popup($("#layer_alert"), "A", '선택하신 거울의 최대 길이는 2400mm 를 초과하실 수 없습니다.');
			$('#glasssize_height').val("2400");
		}
		
		set_cal_price();
	});
	
	
	$('#glasssize_width, #glasssize_height, #glasssize_diameter').on('focusout', function(){	
		$(this).val($(this).val().replace(/[^0-9]/g, ""));
		
		// 거울 : 가로 X 세로 : 2400 * 1200 / 1200 * 2400 , 최소값 : 100mm		
		if(parseInt($(this).val().replace(/[^0-9]/, '')) < 100){
			layer_popup($("#layer_alert"), "A", '선택하신 거울의 최소 폭은 100mm를 미만하실 수 없습니다.');
			$(this).val("100");
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
			layer_popup($("#layer_alert"), "A", '견적서에 상품이 없습니다.');
			return;
		}
		
		if($('#glass_cal_cart > tbody tr .glasscheck input:checked').length == 0 ) {
			layer_popup($("#layer_alert"), "A", '선택된 상품이 없습니다.');
			return;
		}
		del_glass_cart();
	});
	
	$("#all_delete_cart").click(function(){	
		if($('#glass_cal_cart > tbody tr').length == 0 ) {
			layer_popup($("#layer_alert"), "A", '견적서에 상품이 없습니다.');
			return;
		}

		$('#glass_cal_cart > tbody').html('');
		cal_total_price();
	});

	// 이메일 보내기
	$("#send_email").click(function(){	
		send_email();
	});
})
.ajaxStart(function(){ //ajax실행시 로딩바를 보여준다.
	layer_popup($("#loading"));
})

// 값 초기화
function initStatus(type){
	if(type == "A"){
		imgSrc = defImgSrc;
		$('#glasstype_select').val('').prop("selected",true);
		
		$("._li_basic_val").show();
		$("._li_circle_val").hide();
		$('.li_option').hide();
	}
	
	$("#glasssize_width").val("");
	$("#glasssize_height").val("");
	$("#glasssize_diameter").val("");
	$("#glasssize_count").val("1");
	$("#glasssize_price").val("");	
	$('input[name=chk_sheet]').prop('checked', false);
	$('#sel_safe_where').val('').prop("selected",true);
	$('#sel_safe_size').val('').prop("selected",true);
}

function fn_typeSortLi(el){
	if($(el).parents('ul').hasClass('disabled')){
		return;
	}
	
	$("#glasstype_select").attr("disabled", true);
	$("#glasssize_width").attr("disabled", true);
	$("#glasssize_height").attr("disabled", true);
	$("#glasssize_count").attr("disabled", true);
	
	initStatus('A');		
	imgSrc = defImgSrc + "defalt.png";

	var step = $(el).data('step');

	if(step != undefined){
		if(step == 1){			
			$('.tp_step3').hide();
			$('.glassTypeSort li').removeClass('selected');
			$('.tp_step2').removeClass('disabled');
			
		}else if(step == 2){
			var detail =  $(el).find('input').val();
			var item;
			
			if(detail == 'common'){
				$("#li_sheet").show();
				$('.tp_step3').hide();

				imgSrc = defImgSrc + "glass/common_" + $(".glassTypeSort .tp_step1 .selected a").html() + ".png";

				$("#glasstype_select").attr("disabled", false);
				$("#glasssize_width").attr("disabled", false);
				$("#glasssize_height").attr("disabled", false);
				$("#glasssize_count").attr("disabled", false);
			} else{
				if(detail == 'color'){
					item = color[0]
				}else if(detail == 'marble'){
					item = marble;
				}else if(detail == 'wood'){
					item = wood;
				}else if(detail == 'pattern'){
					item = pattern;
				}

				$('ul.tp_step3').html("");
				var html = "";
				for(var n=0; n < item.length; n++){		
					html +=  '<li class="' + detail + ' design" data-step="3" data-val="' + item[n] +'" onClick="javascript:fn_typeSortLi(this)">';
					html += '	<input type="hidden" id="glass_group_step3_' + n + '" name="glass_group_step3[]" value="' + n + '">';

					if(detail == 'color'){
						html += '	<div class="glass_group" style="background:#' + color[1][n] + '" gid="' + n + '">' + item[n] + '</div>';
					}else{
						html += '	<div class="glass_group" gid="' + n + '" >';
						html += '		<img src="' + images[item[n]].src + '" style="height:100%; width:100%;">';
						html += '		<div>' + item[n] + '</div>';
						html += '	</div>';
					}
					html += '</li>';
				}

				$('ul.tp_step3').append(html);
				$('.tp_step3').show();
			}
		}else{
			imgSrc = defImgSrc + "glass/" +$(".glassTypeSort .tp_step2 .selected input").val() + "_" + $(el).data('val') + ".png";

			$("#glasstype_select").attr("disabled", false);
			$("#glasssize_width").attr("disabled", false);
			$("#glasssize_height").attr("disabled", false);
			$("#glasssize_count").attr("disabled", false);
		}

		$(el).parents('ul').find('li').removeClass('selected');
		$(el).addClass('selected');
			
		selItem = cost[$(".tp_step1 li.selected input").val()];	
	}

	$(".glass_img img").attr('src', imgSrc);
}


// 금액 계산
function set_cal_price(){
	var input_width = 0;
	var input_height = 0;
	var input_price = 0;
	var price = 0;
	var totalJa = 0;

	if($("#glasstype_select").val() != ''){
		var gid = parseInt($(".tp_step2 li.selected a").attr('gid'));
		if($('input[name=chk_sheet]:checked').val() == "추가"){
			gid += 2;
		}
		input_price = parseInt(selItem[gid].split("/")[$("#glasstype_select").val()]);
	}
	
	if($('#glasssize_width').val().replace(/[^0-9]/, '') != ''){
		input_width = parseInt($('#glasssize_width').val());
	}
	
	if($('#glasssize_height').val().replace(/[^0-9]/, '') != ''){
		input_height = parseInt($('#glasssize_height').val());
	}
	
	totalJa = calJa(input_width) * calJa(input_height);
	
	price = input_price * totalJa * $("#glasssize_count").val();
	
	if(totalJa == 1){
		price = price * 2;
	} else{
		price = price + (price*0.5);
	}
	
	if($('#sel_safe_size').is(':visible')){
		price = price + parseInt($('#sel_safe_size').val() + "000");
	}

	// 100원 단위 반올림
	$("#glasssize_price").val(format_num(Math.round(price/1000)*1000));
}

// 숫자 포맷
function format_num(num){
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
		layer_popup($("#layer_alert"), "A", '모양을 선택하세요.', $("#glasstype_select"));
		return;
	}

	if($('#glasssize_width').val() == ""){
		layer_popup($("#layer_alert"), "A", '가로 값을 입력하세요.', $("#glasssize_width"));
		return;
	}
	
	if($('#glasssize_height').val() == ""){
		layer_popup($("#layer_alert"), "A", '세로 값을 입력하세요.', $("#glasssize_height"));
		return;
	}
	
	if($('#glasssize_count').val() == ""){
		layer_popup($("#layer_alert"), "A", '수량을 입력하세요.', $("#glasssize_count"));
		return;
	}
	
	if($("#li_sheet").is(":visible") && $('input[name=chk_sheet]:checked').val() == undefined){
		layer_popup($("#layer_alert"), "A", '비상방지안전시트를 선택하세요.', $("#input[name=chk_sheet]"));
		return;
	}
	
	if($(".li_safe_where").is(":visible") && $('#sel_safe_where').val() == ""){
		layer_popup($("#layer_alert"), "A", '모서리가공 위치를 선택하세요.', $('#sel_safe_where'));
		return;
	}

	if($(".li_safe_size").is(":visible") && $('#sel_safe_size').val() == ""){
		layer_popup($("#layer_alert"), "A", '모서리가공 크기를 선택하세요.', $('#sel_safe_size'));
		return;
	}

	var html = "";
	var tot_len = parseInt($('#glasssize_width').val()) + parseInt($('#glasssize_height').val());
	var option_deliver = "F";
	var optCnt = 0;
	var type = $(".tp_step1 .selected .glass_group").html() + "_" + $(".tp_step2 .selected .glass_group").html()

	if($(".tp_step3").is(":visible")){
		type += "_" + $(".tp_step3 .selected").data('val');
				
		if($(".tp_step2 li.selected input").val() == "color"){
				type += "(#" + color[1][$(".glassTypeSort .tp_step3 .selected input").val()] + ")";
		}
	}

	var safeCorner = "";
	

	if($("#sel_safe_where").val() != ""){
		safeCorner += $("#sel_safe_where option:checked").text();
		
		if($(".li_safe_size").is(":visible") && $('#sel_safe_size').val() != ""){
			safeCorner += " > " + $("#sel_safe_size option:checked").text();
		}
		optCnt++;
	}
	
	html = "<tr>";	
	html += "	<input type='hidden' name='index' value='" + $('#glass_cal_cart > tbody tr').length + "'/>";
	html += "	<input type='hidden' name='type' value='" + type + "'/>";
	html += "	<input type='hidden' name='shape' value='" + $("#glasstype_select option:checked").text() + "'/>";
	html += "	<input type='hidden' name='width' value='" + $('#glasssize_width').val() + "'/>";
	html += "	<input type='hidden' name='height' value='" + $('#glasssize_height').val() + "'/>";
	html += "	<input type='hidden' name='count' value='" + $("#glasssize_count").val() + "'/>";
	html += "	<input type='hidden' name='sheet' value='" + $('input[name=chk_sheet]:checked').val() + "'/>";
	html += "	<input type='hidden' name='safeCorner' value='" + safeCorner + "'/>";
	html += "	<input type='hidden' name='price' value='" + $("#glasssize_price").val() + "'/>";
	
	if($("#glasstype_select").val() == "1"){		
		if(tot_len > 1800){
			option_deliver = "Y";
		}
		html += "	<input type='hidden' name='deliver' value='" + option_deliver + "'/>";
	}else{
		if(tot_len > 2000){
			option_deliver = "Y";
		}
		html += "	<input type='hidden' name='deliver' value='" + option_deliver + "'/>";
	}
	
	html += "	<td class='glasscheck'>";
	html += "		<input type='checkbox'/>";
	html += "	</td>";
	
	
	if(isMobile() && !$(".fix_head_table thead").is(':visible')){
		html += "	<td colspan='5' class='glassAll'>";
		html += "		<ul>";
		html += "			<li>";
		html += '				<span class="td_title">제품명</span>';		
		html += "				<span class='td_value'>" + type + "</span>";
		html += "			</li><li>";
		html += "			<li>";
		html += '				<span class="td_title">사이즈</span>';		
		html += "				<span class='td_value'>" + $('#glasssize_width').val() + " X " + $('#glasssize_height').val() + "</span>";
		html += "			</li><li>";
		html += '				<span class="td_title">수량</span>';		
		html += "				<span class='td_value'>" + format_num($("#glasssize_count").val()) + "</span>";
		html += "			</li><li>";
		html += '				<span class="td_title">모양</span>';		
		html += "				<span class='td_value'>" + $("#glasstype_select option:checked").text(); + "</span>";
		html += "			</li>";
		
		if($('input[name=chk_sheet]:checked').val() == "추가"){
			html += "<li><span class='td_title td_plus'>&emsp;+&nbsp;</span><span class='td_value'>비상방지안전시트 추가</span></li>";
		}

		if(safeCorner != "") {
			html += "<li><span class='td_title td_plus'>&emsp;+&nbsp;</span><span class='td_value'>" + safeCorner + "</span></li>";
		}

		html += "			<li>";
		html += '				<span class="td_title">금액</span>';		
		html += "				<span class='td_value'>" + $("#glasssize_price").val() + "</span>";
		html += "			</li>";		
		html += "		</ul>";
		html += "	</td>";
	}else{
		html += "	<td class='glassname'>" + type;
		html += "<br>[ " + $('#glasssize_width').val() + " X " + $('#glasssize_height').val() + " ] </td>" ;
		html += "	<td class='glasscount'>" + format_num($("#glasssize_count").val()) + "</td>";
		html += "	<td class='glasstype2'>" + $("#glasstype_select option:checked").text() + "</td>";
		html += "	<td class='glassoption'>";

		if($('input[name=chk_sheet]:checked').val() == "추가"){
			html += "비상방지안전시트 추가";
			optCnt++;
		}

		optCnt > 1 ? html += "<br>" : "";
		html += safeCorner;
		
		optCnt == 0 ? html += "없음" : "";
		html += "</td>";

		html += "	<td class='glassprice'>" + $("#glasssize_price").val() + "</td>";
	}
	html += "</tr>";
	
	$('#glass_cal_cart > tbody').append(html);
	
	cal_total_price();
	
	initStatus('A');
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
	
	$("#tot_count").text(format_num(tot_cnt));
	$("#tot_price").text(format_num(tot_price));
	
	$("#option_pay_count").text(format_num(tot_price/1000));
	
	option_deliver()
}

// 배송비 운임 여부
function option_deliver(){
	var tot_len = 0;
	var showYn = false;

	$('#glass_cal_cart > tbody tr input[name="deliver"]').each(function(){
		if($(this).val() == "Y" && !showYn){
			showYn = true;
		}
	});
	
	if(showYn){
		$(".option_deliver").show()
	}else{
		$(".option_deliver").hide()
	}

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
		layer_popup($("#layer_alert"), "A", '견적서에 상품이 없습니다.');
		return;
	}
	
	if($('#order_name').val() == "" ){
		layer_popup($("#layer_alert"), "A", '주문자 명을 입력해주세요.', $('#order_name'));
		return;
	}
	if($('#order_tel').val() == "" ){
		layer_popup($("#layer_alert"), "A", '연락처를 입력해주세요.', $('#order_tel'));
		return;
	}
	if($('#order_email').val() == "" ){
		layer_popup($("#layer_alert"), "A", '이메일을 입력해주세요.', $('#order_email'));
		return;
	}

	if($("#agree_privacy:checked").length == 0 ){
		layer_popup($("#layer_alert"), "A", '개인정보 취급동의에 체크해주세요.', $("#agree_privacy"));
		return;
	}	
	
	$('#name').val($('#order_name').val());
	$('#tel').val($('#order_tel').val());
	$('#email').val($('#order_email').val());
	$('#price_total').val($('#tot_price').text());
	$('#price_count').val($('#tot_count').text());
	$('#price_option').val($('#option_pay_count').text());
	$('#memo').val($('#order_memo').val());
	
	if($(".option_deliver").is(':visible')){
		$('#deliver').val('추가');
	}else{
		$('#deliver').val('없음');
	}
	
	var cartTxt = "";
	
	$('#glass_cal_cart > tbody tr').each(function(){
		if($(this).find('input[name="index"]').val() != 0){
			cartTxt += "/"
		}
		cartTxt += $(this).find('input[name="type"]').val() + "|";
		cartTxt += $(this).find('input[name="shape"]').val() + "|" 
		cartTxt += $(this).find('input[name="width"]').val() + "|" ;
		cartTxt += $(this).find('input[name="height"]').val() + "|" ;
		cartTxt += $(this).find('input[name="count"]').val() + "|" ;
		cartTxt += $(this).find('input[name="safeCorner"]').val() + "|" ;
		cartTxt += $(this).find('input[name="sheet"]').val() + "|" ;
		cartTxt += $(this).find('input[name="price"]').val();
	});
	
	
	$('#cart').text(cartTxt);
	
	var queryString = $("form[name=emailfrm]").serialize() ;

	$.ajax({
		data : queryString,
		type : 'post',
		url : 'https://script.google.com/macros/s/AKfycby8QE_5inEQRVvrzh5bS1xIeacD_avHLIMBGaNCDOh49c5o1NASj4NIXqNRKIo00d8bzw/exec',
		dataType : 'json',
		error: function(xhr, status, error){
			$("#loading").hide();
			layer_popup($("#layer_alert"), 'A', error);
		},
		success : function(json){
			$("#loading").hide();
			layer_popup($("#layer_alert"), 'A', "견적서가 발송되었습니다.");
		}
	});
	
}

function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// 레이어 팝업
function layer_popup(el, type, txt, focusEl){

	var $el = $(el);    //레이어의 id를 $el 변수에 저장
	var isDim = $el.parent('.dim-layer').find('.dimBg'); //dimmed 레이어를 감지하기 위한 boolean 변수

	isDim ? $('.dim-layer').fadeIn() : $el.fadeIn();

	var $elWidth = ~~($el.outerWidth()),
		$elHeight = ~~($el.outerHeight()),
		docWidth = $(document).width(),
		docHeight = $(document).height();

	// 화면의 중앙에 레이어를 띄운다.
	if ($elHeight < docHeight || $elWidth < docWidth) {
		$el.css({
			marginTop: -$elHeight /2,
			marginLeft: -$elWidth/2
		})
	} else {
		$el.css({top: 0, left: 0});
	}
	
	if(type == "A"){
		$("#alert_txt").text(txt);

		$el.find('a.btn-layerClose').click(function(){
			$el.hide();
			isDim ? $('.dim-layer').fadeOut() : $el.fadeOut(); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
			
			if(focusEl){focusEl.focus();}
			return false;
		});

		$('.layer .dimBg').click(function(){
			$el.hide();
			$('.dim-layer').fadeOut();

			if(focusEl){focusEl.focus();}
			return false;
		});
	}
	
	$el.show();	
}


function isMobile(){
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
