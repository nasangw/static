




/*
     FILE ARCHIVED ON 7:24:53 Jan 28, 2019 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 7:24:54 Jan 28, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
var bRecommendExcute = true;

var Cmm = {
	core : window.$,
	bStart : false,
	bDebug : false,
	init : function() {

		if (typeof Cmm.core != 'function') {
			return;
		}
		Cmm.bStart = true;
		var sCurrentHost = document.location.host;
		if (sCurrentHost.indexOf('m.local.') > -1 || sCurrentHost.indexOf('m.stg2.') > -1  || sCurrentHost.indexOf('m-mt.stg2.') > -1) {
			Cmm.bDebug = true;
		}
		Cmm.bDebug = true;
	},
	isExcuteAble : function() {
		if (Cmm.bStart) {
			return true;
		}
		return false;
	},
	lrClick : function(el) {
		if (Cmm.isExcuteAble) {
            var $elt = $(el),
                url = '';

            if ( !!$elt.next('.logging-url') ) {
                url = $elt.next('.logging-url').val();
            }

            if ( !url ) {
            	location.href = $elt.attr('href');
                return;
            }

            $.get('/recruit/logging-crm-click', {url : url}, function(data) {
            	location.href = $elt.attr('href');
            });
		}
	},
	showRecommendList : function(params,obj) {
		if (Cmm.isExcuteAble) {
			$.get('/recruit/recommend-list', params,
	           function(data) {
	               $('#'+obj).html(data);
	        });
		}
	},
	showMainRecommendList : function(params,obj) {
		if (Cmm.isExcuteAble) {
			$.get('/recruit/main-recommend-list', params,
	           function(data) {
	               $('#'+obj).html(data);
	        });
		}
	},
	showSearchRecommendList : function(params,obj) {
		if (Cmm.isExcuteAble) {
			$.get('/recruit/search-recommend-list', params,
	           function(data) {
	               $('#'+obj).html(data);
	        });
		}
	},
	showTogetherList : function(params,obj) {
		if (Cmm.isExcuteAble) {
			$.get('/recruit/together-list', params,
	           function(data) {
	               $('#'+obj).html(data);
	        });
		}
	},
    showRecommendAllList : function(params,obj) {
        if (Cmm.isExcuteAble) {
            $.get('/recruit/recommend-list-all', params,
                function(data) {
                    $('#'+obj).html(data);
                });
        }
    },
    /**
     * 앱으로 보기
     * @param appstoreUrl 설치 URL
     * @param customUrl 엘리먼트.onclick에서 return false;할 경우만! href 값을 보내준다.
     * Android는 Intent를 사용하면 됨.
     *           confirm을 띄우려면 customurl 넘겨주면 되지만, 갤4 일부에서 custom url 동작 안 함
     */
    openApp : function(appstoreUrl, customUrl) {
        var userAgent = navigator.userAgent;
        if (appstoreUrl && /(iPhone|iPad)/i.test(userAgent)) {
            var clickedAt = +new Date;
            sriAppCheckTimer = setTimeout(function() {
                if (+new Date - clickedAt < 500) {
                    //if (window.confirm("설치페이지로 이동하시겠습니까?")){//safari에서 confirm 작동 안함
                    location.href = appstoreUrl;
                }
            }, 50);
            if (customUrl) {
                location.href = customUrl;
            }
        } else if (customUrl && /(Android)/i.test(userAgent)) {
            var clickedAt = +new Date;
            $("<iframe></iframe>").attr("name", "checkframe")
                .attr("src", customUrl)
                .css({display : "none"})
                .appendTo(document.body);

            sriAppCheckTimer = setTimeout(function() {
                if(+new Date - clickedAt < 2000){
                    if(confirm("사람인앱이 설치되지 않았거나, 최신버전이 아닙니다.\n지금 마켓으로 이동하시겠습니까?")){
                        location.href = appstoreUrl;
                    }
                }
            }, 1500);
        }
    }
}
Cmm.init();

// 상세검색Form > 스크롤 고정 기능
// 3뎁스 공고 목록 라인맵과 함께 작동. 속도를 위해 dom 스크립트로 최대한 이용. -2015.06 jbyjby
var fixlimit;
var fixed_top_jqel;
var wrapFixedHeight = 0;
var fixedOffsetTop;
var search_panel_dom;
var linemap_panel_dom;
var searchPanelStatus;
var lineMapStatus;
var dummy_dom;

function setFixLimit(type) {
    if(type) {
        if (!fixedOffsetTop) fixedOffsetTop = parseInt(fixed_top_jqel.offset().top);
        fixlimit = fixedOffsetTop + parseInt(fixed_top_jqel.height());
        if (dummy_dom) fixlimit += dummy_dom.offsetHeight;
    } else {
        if (!fixedOffsetTop) fixedOffsetTop = parseInt(fixed_top_jqel.offset().top);
        fixlimit = fixedOffsetTop;
        if (dummy_dom) fixlimit += dummy_dom.offsetHeight;
    }
}

(function($) {
    $(function() {
        function fixedTopSearch(){if (!document.getElementById("fixedTopSearch")) {
            return;
        }
            fixed_top_jqel = $('#fixedTopSearch');
            dummy_dom = document.createElement("DIV");
            dummy_dom.style.display = 'none';
            dummy_dom.style.height = '0';
            if (!document.getElementById("content")) {
                document.getElementById('wrap').insertBefore(dummy_dom, document.getElementById('wrap').childNodes[0]);
            } else {
                document.getElementById('content').insertBefore(dummy_dom, document.getElementById('content').childNodes[0]);
            }
            search_panel_dom = document.getElementById('search_panel');
            linemap_panel_dom = document.getElementById('linemap_panel');
            if (!!linemap_panel_dom) {
                setFixLimit(linemap_panel_dom.style.display === "block");
            } else {
                setFixLimit(false);
            }

            var lineMapHeight;

            $(window).on('scroll', function () {
                reduceHeight = 0;
                if ($(window).scrollTop() >= fixlimit) {
                    if (!wrapFixedHeight) wrapFixedHeight = fixed_top_jqel.height();
                    reduceHeight = wrapFixedHeight;

                    if (linemap_panel_dom && linemap_panel_dom.style.display != 'none') {
                        if (!lineMapHeight) lineMapHeight = linemap_panel_dom.offsetHeight;
                        linemap_panel_dom.style.display = 'none';
                        $('.btn_linemap').removeClass("linemap_on");

                        lineMapStatus = 'open';
                        reduceHeight += lineMapHeight;
                    }

                    if (reduceHeight > 0) {
                        dummy_dom.style.display = '';
                        dummy_dom.style.height = wrapFixedHeight + 'px';
                    }

                    fixed_top_jqel.addClass('fixed');
                    $('.btn_on').addClass('arrow_hidden');
                } else {
                    reduceHeight = 0;
                    wrapFixedHeight = 0;

                    if (linemap_panel_dom && lineMapStatus == 'open' && linemap_panel_dom.style.display == 'none') {
                        linemap_panel_dom.style.display = '';
                        $('.btn_linemap').addClass("linemap_on");
                        reduceHeight += lineMapHeight;
                    }
                    dummy_dom.style.display = 'none';
                    fixed_top_jqel.removeClass('fixed');
                    $('.btn_on').removeClass('arrow_hidden');
                }
            });

        }

        fixedTopSearch();

        $(".btn_detail").click(function(){
            // WMG-18926 : M 상세검색 패널 개편
            var type = $(this).data('detail_type');
            if (type !== undefined && type == 'window') {
                return false;
            }

            history.pushState(null, null, location.href);

            window.oriScroll = $(window).scrollTop();

            var search_panel = $('#search_panel');

            $("#wrap").append("<div id=\"detail_search_panel\"></div>");
            $('#moving_wrap').hide();
            $('#detail_search_panel').html(search_panel);

            search_panel.show();

            window.scrollTo(0, 0);

            // 트랙이벤트 - 상세검색
            try{n_trackEvent('m.saramin', 'rec_list', 'rec_search', 'open_close');}catch(e){}
        });

        $(".btn_linemap").click(function(){
            if (linemap_panel_dom) {
                if (linemap_panel_dom.style.display == 'none') {
                    linemap_panel_dom.style.display='';
                    lineMapStatus = 'open';
                } else {
                    linemap_panel_dom.style.display='none';
                    lineMapStatus = '';
                }
            }
            $(this).toggleClass("linemap_on");

            if (fixed_top_jqel && fixed_top_jqel.hasClass('fixed')) {
                if (searchPanelStatus == 'open') {
                    $(".btn_detail").addClass('btn_on');
                    search_panel_dom.style.display='';
                }
                dummy_dom.style.display='none';
                wrapFixedHeight = 0;
                window.scrollTo(0, fixedOffsetTop);
            }
            //fixedSearchPanelOffsetTop = ($('#q_search')) ? parseInt($('#q_search').offset().top) : parseInt($(search_panel_dom).offset().top);
            if(searchPanelStatus == 'open' || lineMapStatus == 'open') {
                setFixLimit(true);
            } else {
                setFixLimit(false);
            }
        });
        // 트랙이벤트 - 모바일 지원 가능
        $("#apply_mobile").click(function(){
            try{n_trackEvent('m.saramin', 'rec_list', 'mobile_apply');}catch(e){}
        });
        // 트랙이벤트 - 공고 정렬 기준 변경
        $("#sort").click(function(){
            try{n_trackEvent('m.saramin', 'rec_list', 'align_button');}catch(e){}
        });
        // 트랙이벤트 - 라인맵 2뎁스
        $(".txt_linemap a, a.txt_linemap").click(function(){
            try{n_trackEvent('m.saramin', 'rec_list', 'linemap', '2depth');}catch(e){}
        });

        // 상단 이전버튼
        $('.btn_top_prev').click(function() {
            if (!sriScript.goBack()) {
                window.history.back();
            }
            return false;
        });

        $('.open_appview').on('click', function () {
            var $el = $(this),
                slide = $(this).data('slide') || '',
                close = $(this).data('close') || 'n',
                newWebview = $(this).data('new') || 'y';


            var link = '';

            var domain = document.domain;
            var prev_link = $el.attr('href');

            if (prev_link.match(/^http?:\/\//) || prev_link.match(/^https?:\/\//)) {
                link = prev_link;
            } else {
                link = "http://" + domain + prev_link;
            }

            callOpenModalWebView(close, slide, newWebview, link);
            return false;
        });


        var topBtnClickHandler = function(){
            if(dummy_dom) dummy_dom.style.display='none';
            wrapFixedHeight = 0;
            //location.href='#wrapper';
            window.scrollTo(0, 0);
        }

        var backBtnClickHandler = function(){
            window.history.back();
        }

        // 최하단 top 버튼 제어 // 공고뷰 job-search/view 는 자체적인 스크롤을 쓴다.;;;
        $('.btn_top:not(._job_search_view)')
            .attr('onclick','')
            .click(topBtnClickHandler);

        // 플로팅 top 버튼 제어
        var layer_btn_top_jqel = $('.layer_btn_top');
        if (layer_btn_top_jqel) {
            $(window).scroll(function() {
                if (layer_btn_top_jqel) {
                    if (layer_btn_top_jqel.hasClass('stop_scroll_event')) {
                        return;
                    }
                    if ($(window).scrollTop() > $(window).height() / 2) {
                        if (layer_btn_top_jqel.hasClass('_job_search_view')) {
                            layer_btn_top_jqel.addClass('layer_btn_top_show');
                        } else {
                            layer_btn_top_jqel.stop().fadeIn({
                                duration:100,
                                queue:false
                            });
                        }
                    } else {
                        if (layer_btn_top_jqel.hasClass('_job_search_view')) {
                            layer_btn_top_jqel.removeClass('layer_btn_top_show');
                        } else {
                            layer_btn_top_jqel.stop().fadeOut({
                                duration:100,
                                queue:false
                            });
                        }
                    }
                }
            });
            // 공고뷰 job-search/view 는 자체적인 스크롤을 쓴다.;;;
            if ( !$(layer_btn_top_jqel).hasClass('_job_search_view') ) {
                $(layer_btn_top_jqel).click(topBtnClickHandler);
            }
        }

        // 플로팅 back 버튼 제어
        var layer_btn_back_jqel = $('.layer_btn_back');
        if (layer_btn_back_jqel && (!layer_btn_back_jqel.hasClass('non_back')) ) {
            $(layer_btn_back_jqel).click(backBtnClickHandler);

        }
    });

})(jQuery);


FixedTop = (function($) {
    'use strict';

    var $win = $(window);

    function FixedTop(element, options) {
        this.$el = $(element);
        this.opts = $.extend({}, FixedTop.defaults, options);

        this.initialize();
    }

    FixedTop.prototype.initialize = function() {
        var ua = navigator.userAgent.toLowerCase(),
            AOSVersion = parseFloat(ua.slice(ua.indexOf("android") + 8));

        if (AOSVersion <= 3) {
            return;
        }

        if (this.$el.length <= 0) {
            return;
        }

        this.$elOffsetTop = this.$el.offset().top;
        this.$elMarginTop = this.$el.css('margin-top');
        this.$elHeight = this.$el.outerHeight();

        this.addHandler();
    };

    FixedTop.prototype.featureTest = function(property, value, noPrefixes) {
        var prop = property + ':',
            el = document.createElement('test'),
            mStyle = el.style;

        if (!noPrefixes) {
            mStyle.cssText = prop + ['-webkit-', '-moz-', '-ms-', '-o-', ''].join(value + ';' + prop) + value + ';';
        } else {
            mStyle.cssText = prop + value;
        }
        return mStyle[property].indexOf(value) !== -1;
    };

    FixedTop.prototype.isIOS = function() {
        return navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
    };

    FixedTop.prototype.wrapping = function(fnCallback) {
        this.$el
            .css('margin-top', 0)
            .wrapAll($('<div class="' + this.opts.fixedWrapClassName + '"></div>').css({
                height: this.$elHeight,
                'padding-top': this.$elMarginTop
            }));
        fnCallback();
    };

    FixedTop.prototype.addHandler = function() {
        this.wrapping($.proxy(function() {
            $win.on('load resize scroll', $.proxy(function() {
                if (!this.$el.hasClass('nav_is_fixed') && this.$el.offset().top > 0 && this.$el.parent().css('display') === 'block') {
                    this.$elOffsetTop = this.$el.offset().top;
                }

                if ($win.scrollTop() >= this.$elOffsetTop - this.opts.topSpacing) {
                    this.$el
                        .addClass(this.opts.fixedClassName)
                        .css('top', this.opts.topSpacing);
                } else {
                    this.$el
                        .removeClass(this.opts.fixedClassName)
                        .css('top', 'auto');
                }
            }, this))
        }, this));
    };

    FixedTop.defaults = {
        topSpacing: 0,
        fixedClassName: 'nav_is_fixed',
        fixedWrapClassName: 'nav_is_fixed_wrap'
    };

    return FixedTop;

}(jQuery));

// 여기까지 상세검색Form > 스크롤 고정 기능, 최하단 TOP 버튼 제어

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }

    return 0;
}

// 인벤토리 넛지 통계 
// params = inventory,target,campaign 
function invStat(params) {
    try {
        $.ajax({
            url:'/appinstall-nudge/stat?params='+params,
            success:function(data){
                return;
            }
        })
    } catch(e) { return; }
}

// 앱 디바이스 정보 callBack
function callBackNeedDeviceToken(data , callback)
{
	data = jQuery.parseJSON(data);
     // try,catch 구문으로 나누어 일반문자열과 JSON 구분
    try{
        //callback = decodeURIComponent(callback);
        var dataObject = jQuery.parseJSON(callback);
        PushKeyword.init(dataObject, data);
        return;
    }catch(e){}

    // 오늘 한번이라도 넛지가 떳을때 생성되는 로컬스토리지 값이 있거나, 
    var nudgeViewDate = localStorage.getItem('notif_appnudge_layer_alarm'); // 알림설정 넛지가 노출된 날짜 값 가져오기
    
    //alert(nudgeViewDate);
    if (localStorage != undefined && nudgeViewDate != null) {
        var nudgeViewdate1 = new Date();
        var nudgeViewdate2 = new Date(nudgeViewDate);
        var nudgeViewdiffDays = parseInt((nudgeViewdate1 - nudgeViewdate2) / (1000 * 60 * 60 * 24));
        if (nudgeViewdiffDays == 0) {
            return;
        }
    }
    // 현재 로컬스토리지에 callbak 을 키로 가지는 값의 날짜와 비교하여 7일 내에 설정된 값이 있을경우 넛지를 띄우지 않도록 함
    if (localStorage != undefined && localStorage.getItem(callback) != null) {
        var date1 = new Date();
        var date2 = new Date(localStorage.getItem(callback));
        var diffDays = parseInt((date1 - date2) / (1000 * 60 * 60 * 24));
        //alert(callback + ',' +diffDays);
        if (diffDays <= 7) {
            return;
        }
    }
    
    var objAppInfo = data; // json string 형태의 변수로 넘어온 파라메터를 다시 객체화 
    var query = window.location.search.substring(1);
    var queryPairs = query.split('&');
    var queryJSON = {};
    
    // 현재 페이지의 쿼리스트링이 포함하는 변수를 같이 념겨줄수 있도록 json 객체에 담음
    $.each(queryPairs, function() {
    	queryJSON[this.split('=')[0]] = this.split('=')[1]; 
    });
    
    try { 
        $.ajax({
            url : '/my-saramin/notif-nudge',
            method : 'post',
            async : false,
            data : { nudge_type : callback, device_info : objAppInfo, queryParams : queryJSON},
            dataType : 'json',
            success : function (data) {
                //alert(JSON.stringify(data));
                //alert(data.showNudge);
                if (data.showNudge == true) {
                    showPushNudgeLayer(objAppInfo, data.pushCode, data.nudgeMessage, callback, data.stat_code);
                }
            },
            error : function () {
                alert('서버의 응답이 없습니다.\n다시 시도하여 주시기 바랍니다.');
            }
        });
    } catch(e) {}
    
}
// 앱 디바이스 정보 가져오기 앱 method call
function callNeedDeviceToken(callback)
{
    callback =  decodeURIComponent(callback);
    sriScript.getDeviceInfo('device_token,consumer_kind,device_id', 'callBackNeedDeviceToken(%@, \'' + callback + '\')');
}
    	
// 토큰 없는 경우 (푸시키워드에서 사용)
function callNoNeedDeviceToken(data) {
    data = decodeURIComponent(data);
    var dataObject = jQuery.parseJSON(data);
    PushKeyword.init(dataObject, null);
}

// 클릭 이벤트
function loggingTrackEvent(category, action, opt_label, opt_value) {
    try {
        n_trackEvent(category, action, opt_label, opt_value);
    } catch (e) {
    }
}

// 구글 태그매니져 이벤트 분석로깅
function loggingTagManager(event, category, event_flow, event_label) {
    try {
        dataLayer.push({
            'event': event,
            'category': category,
            'event-flow': event_flow,
            'event-label': event_label
        });
    } catch (e) {
    }
}

// 클릭 이벤트 + 구글 태그매니져 로깅
function loggingEventAndTagManager(trackEventAttr, tagManagerAttr) {
    loggingTrackEvent(trackEventAttr[0], trackEventAttr[1], trackEventAttr[2], trackEventAttr[3]);
    loggingTagManager(tagManagerAttr[0], tagManagerAttr[1], tagManagerAttr[2], tagManagerAttr[3]);
}

// 알림설정 갱신하기
function updatePushNotif(consumer_kind, device_token, pushCode)
{
    //alert(consumer_kind+'::'+ device_token + '::' + pushCode);
    // todo
    // push 코드를 업데이트 시켜주도록 ajax 처리하기 
    try { 
        $.ajax({
            url : '/my-saramin/set-notif-on',
            method : 'post',
            async : false,
            data : { consumer_kind : consumer_kind, device_token : device_token, push_code : pushCode},
            dataType : 'json',
            success : function (data) {
                //alert(JSON.stringify(data));
            },
            error : function () {
                alert('서버의 응답이 없습니다.\n다시 시도하여 주시기 바랍니다.');
            }
        });
    } catch(e) {}
}

// 알림용 넛지 뿌리기
function showPushNudgeLayer (objAppInfo, pushCode, msg, callback, statCode) 
{
	var nudgeHtml = '';
	nudgeHtml += '<div class="layer_dim" id="notif_appnudge_layer_alarm" style="display:block">';
	nudgeHtml += '    <div class="layer_alarm">';
	nudgeHtml += '        <div class="msg">';
	nudgeHtml += msg;
	nudgeHtml += '            <button class="btn" onclick="updatePushNotif(\''+objAppInfo.consumer_kind+'\',\''+objAppInfo.device_token+'\', \''+pushCode+'\', \''+callback+'\');setCloseNudgeDate(\''+callback+'\');n_trackEvent(\''+statCode.category+'\', \''+statCode.action+'\', \''+statCode.opt_label+'\', \'ok\');$(\'#notif_appnudge_layer_alarm\').hide();"><span>네, 좋아요!</span></button>';
	nudgeHtml += '        </div>';
	nudgeHtml += '        <button class="btn_close" onclick="setCloseNudgeDate(\''+callback+'\');n_trackEvent(\''+statCode.category+'\', \''+statCode.action+'\', \''+statCode.opt_label+'\', \'close\');document.getElementById(\'notif_appnudge_layer_alarm\').style.display=\'none\'"><span>닫기</span></button>';
	nudgeHtml += '    </div>';
	nudgeHtml += '</div>';
	
	var elemDiv = document.createElement('div');
	elemDiv.innerHTML = nudgeHtml;
	document.body.appendChild(elemDiv);
	
	var today = new Date();
	var today_year = today.getFullYear();
	var today_month = today.getMonth()+1;
	var today_day = today.getDate();
	// 넛지 노출되는 순간 해당 넛지가 뜬 날짜를 저장 (전체 넛지중 아무거나라도 하루에 한번만 띄우기 위함)
	localStorage.setItem('notif_appnudge_layer_alarm', today_month+'/'+today_day+'/'+today_year);
	
	// 트랙 이벤트 코드
	try{n_trackEvent(statCode.category, statCode.action, statCode.opt_label, statCode.opt_value);}catch(e){};
}

// 넛지 닫기 시 일주일 다시 열지 않기용 키저장
function setCloseNudgeDate(closeKey)
{
	var today = new Date();
	var today_year = today.getFullYear();
	var today_month = today.getMonth()+1;
	var today_day = today.getDate();
	
	localStorage.setItem(closeKey, today_month+'/'+today_day+'/'+today_year);
	//alert(closeKey+':'+localStorage.getItem(closeKey));
	return;
}

// 전체 로컬 스토리지 삭제
function localStorageClear() 
{
	if (window.localStorage) {
		localStorage.clear();
		alert('스토리지 삭제');
	}
}


function closeModalWebView(brandApp, url) {
    if (url != '') {
        location.href = url;
    } else {
        history.back();
    }
}

function callOpenModalWebView(close, slide, newWindow, link){
    sessionStorage.clear();
    if (link != '') {

        var domain = document.domain;

        if (link.match(/^http?:\/\//) || link.match(/^https?:\/\//)) {
            link = link;
        } else {
            link = "http://" + domain + link;
        }
    }
    sriScript.closeWindow('');
}

function myServiceUrl(localCode) {
    var loginChkStr = '&appmode=need_login';
    if (sriScript.isAndroidApp()) {
        var appChk = /\|\|/.test(window.navigator.userAgent);
        if (!appChk) {
            loginChkStr = '#app_needLogin';
        }
    }
    location.href='/my-saramin/my?local_code=' + localCode + loginChkStr;
}

function closeWindow(brandApp) {
    if (brandApp) {
        if (!!window.sriapp && !!window.sriapp.closeWindow) {
            var message = {
                script: "console.log(1);"
            };
            window.sriapp.closeWindow(JSON.stringify(message));
        }
    } else {
        history.back();
    }
}

function goCompanyNotifSettingPanel() {
    if (!!window.sriapp && !!window.sriapp.openWindowFull) {
        var message = {
            types: "device_token,consumer_kind",
            script: "callbackGoCompanyNotifSettingPanel(%@);"
        }
        window.sriapp.getInfo(JSON.stringify(message));
    } else {
        var location_url = '/my-saramin/set-notif-company?device_token=&consumer_kind=';
        window.location.href = location_url;
    }
}

function callbackGoCompanyNotifSettingPanel(json) {
    if (typeof json !== 'object') {
        json = JSON.parse(json);
    }

    var location_url = '/my-saramin/set-notif-company?device_token='+json.device_token+'&consumer_kind='+json.consumer_kind+'&type=new';

    if (window.location.protocol == 'https:') {
        location_url = 'http://' + window.location.host + location_url;
    }
    
    var message = {
        url: location_url,      //full url or path
        type: "bottom",
        https: false
    }
    window.sriapp.openWindowFull(JSON.stringify(message));
}

function openNotification() {
    if (!!window.sriapp) {
        sriScript.getDeviceInfo('device_token,consumer_kind', 'notificationOpen(%@)');
    } else {
        window.location.href = '/notification/center';
    }
}

function setNotifOpen(json) {
    sriScript.goCenterOpen(json, '/my-saramin/set-notif');
}

function notificationOpen(json) {
    var url = '/notification/center';
    if (typeof json !== 'object') {
        json = JSON.parse(json);
        url += '?device_token=' + json.device_token + '&consumer_kind=' + json.consumer_kind;
   }
    window.location.href = url;
}

function setNotifCondiOpen(json) {
    sriScript.goCenterOpen(json, '/my-saramin/set-notif-conditions?category=push_company_all_yn');
}

function passDataOpen(e) {
    var url = e.href;
    if (!sriScript.openWindow(url, 'none')) {
        window.open(url);
    }
}

// 새창 열기 (앱처리 추가)
function openWindowWithApp(url, type, title) {
    if (!sriScript.openWindow(url, type)) {
        window.open(url, title, "");
    }
}
