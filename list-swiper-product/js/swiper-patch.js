'use strict';

// Youtube API 로드
var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
tag.src = "./js/iframe_api.js";
var firstScriptTag = document.querySelectorAll('head script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/**
 * onYouTubeIframeAPIReady 함수는 필수로 구현해야 한다.
 * 플레이어 API에 대한 JavaScript 다운로드 완료 시 API가 이 함수 호출한다.
 * 페이지 로드 시 표시할 플레이어 개체를 만들어야 한다.
 */

var objIndexSlide, objSwiper, objPlayer, liveSwiperElem;

objSwiper = {};
objPlayer = {};
objIndexSlide = {};

function onYouTubeIframeAPIReady() {
    // depend on jQuery
    if(!jQuery || !$) {
        return;
    }

    $('.swiper-patch').each(function(index){
        var attrId = $(this).attr('id');

        objIndexSlide[attrId] = null;
        $(this).find('iframe').each(function() {
            objPlayer[$(this).attr('id')] = new YT.Player($(this).attr('id'), {});
        });

        // if(typeof(index) === 'number') {
        if(index === 0) {
            initSwiper(attrId);
            if(!$('#' + attrId).hasClass('active')) {
                $('#' + attrId).addClass('active');
            }
            liveSwiperElem = this;
        }
    });
}

function initSwiper(attrId) {
    if(!attrId || !objSwiper) {
        return;
    }

    if(!objSwiper[attrId]) {
        objSwiper[attrId] = new Swiper('#' + attrId, {
            nextButton: '#' + attrId + ' .swiper-button-next',
            prevButton: '#' + attrId + ' .swiper-button-prev',
            pagination: '#' + attrId + ' .swiper-pagination',
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            // spaceBetween: 40,
            // slidesPerView: 3,
            // loop: true,
            coverflow: {
                rotate: 40,
                stretch: -40,
                depth: 400,
                modifier: 1,
                slideShadows : false
            },
            onInit: function(s) {
                objIndexSlide[attrId] = s.activeIndex;
            }
        });
        objSwiper[attrId].on('onTransitionEnd', function(s){
            if(objIndexSlide[attrId] !== s.activeIndex) {
                for(var key in objPlayer) {
                    objPlayer[key].pauseVideo();
                }
                objIndexSlide[attrId] = s.activeIndex;
            }
        });
        // console.log( objSwiper );
    }
}

$('#swiperPatchThumb').each(function(){
    var $thumbs = $(this).find('a.swiper-slide');
    $thumbs.on('click', function(ev){
        var targetId = this.getAttribute('href').substr( this.getAttribute('href').indexOf('#')+1 ),
            targetSwiperElem = document.getElementById(targetId);

        if(targetSwiperElem === liveSwiperElem) {
            return;
        }
        for(var key in objPlayer) {
            objPlayer[key].pauseVideo();
        }
        initSwiper(targetId);
        $thumbs.each(function(){
            $(this).removeClass('active');
        });
        $(liveSwiperElem).removeClass('active');
        $(targetSwiperElem).addClass('active');
        $(this).addClass('active');
        liveSwiperElem = targetSwiperElem;

        ev.preventDefault();
    });
});