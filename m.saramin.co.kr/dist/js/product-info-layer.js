/**
 * Created by JPJUNG on 2015-09-07.
 */

(function($, window) {

    var contact = window.salesContact;

    var inqueryText = ''
        +'<div class="discount_with_pcproduct" data-title="logo_default">'
        +'<p>PC 상품과 결합 구매 시 할인! 자세한 견적은 고객센터로 문의하세요</p>'
        +'</div>';


    if (contact.consultant_email != '' || contact.consultant_tel != '') {
        inqueryText = ''
        +'<div class="discount_with_pcproduct" data-title="logo_matching">'
        +'<p>PC 상품과 결합 구매 시 할인! 자세한 견적은 VIP매니저에게 문의하세요</p>'
        +'</div>';
    }

    var realtimeText = ''
        +'<div class="discount_with_pcproduct" data-title="realtime_default">'
        +'<p>PC 상품과 결합 구매 시 50% 할인!</p>'
        +'</div>';

    var applyMethod = "전화 상담 후 구매 가능";
    var applyMethodRealtime = "PC 웹(www.saramin.co.kr)에 접속하여 공고 등록 후 구매 가능"; // 실시간 노출 상품에 대한 신청방법

    var article = '<article id="{{element_id}}" class="layer_product_detail">{{infoprd_layer}}</article>';
    var itemTemplete = ''
                //+'<article id="{{element_id}}" class="layer_product_detail">'
            + '    <div class="infoprd_layer">'
            + '        <h1 class="tit_header">상품안내</h1>'
            + '        <button type="button" class="btn_close_layer">상품안내 닫기</button>'
            + '        <div class="prd_cate">'
            + '            <h2 class="product_name">{{name}}</h2>'
            + '            <p class="price"><span class="point">{{price}}</span>{{unit}}</p>'
            + '        </div>'
            + '        <div class="about_prd">'
            + '            <h3 class="tit_depth2">상품 특징</h3>'
            + '            <ul class="about_list">{{about1}}</ul>'
                //+'                <li>모바일 사람인 첫 페이지 상단 <span class="point">플래티넘 M</span> 영역 노출</li>'
                //+'                <li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>'
                //+'            </ul>'
            + '            <h3 class="tit_depth2">추가 노출 위치</h3>'
            + '            <ul class="about_list">{{about2}}</ul>'
                //+'                <li>모바일 직업/산업/지역 <span class="point">프리미엄 플러스 M</span>으로 노출</li>'
                //+'                <li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 12회 M</span> 적용</li>'
                //+'                <li>모바일 직업/산업/지역 리스트에 <span class="point">효과패키지(컬러) M</span> 적용</li>'
                //+'                <li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
                //+'            </ul>'
            + '        </div>'
            + '{{realtime_text}}'
            //    // [Dev]로고 상품 > 영업사원 매칭된 경우
            //+ '        <div class="discount_with_pcproduct" data-title="logo_matching" style="display: none;">'
            //+ '          <p>PC 상품과 결합 구매 시 할인! 자세한 견적은 VIP매니저에게 문의하세요</p>'
            //+ '        </div>'
            //    // [Dev]실시간 노출 상품일 경우
            //+ '        <div class="discount_with_pcproduct" data-title="realtime_default" style="display: none;">'
            //+ '            <p>PC 상품과 결합 구매 시 50% 할인!</p>'
            //+ '        </div>'
            + '        <div class="bottom_desc">'
            + '            <dl class="apply_method">'
            + '                <dt>신청방법</dt>'
            + '                <dd>{{apply_method}}</dd>'
            + '            </dl>'
            + '        <div class="wrap_button">'
            + '            <a href="tel:' + contact.phone.replace('-', '') + '" class="cellphone">' + contact.phone + '></a>'
            + '            <a href="' + contact.link + '" class="email">E-mail문의</a>'
            + '        </div>'
            + '        </div>'
            + '    </div>'
    //+'</article>'
        ;

    function appendTemplete(wrap, prodId) {
        var layer = '',
            content = [],
            temp = '',
            unit
        ;

        $.each(description[prodId], function(key, data) {

            unit = data.unit === 'day' ? '원/일' : '원/주';

            temp = itemTemplete;
            temp = temp.replace('{{name}}', data.name);
            temp = temp.replace('{{price}}', data.price);
            temp = temp.replace('{{unit}}', unit);
            temp = temp.replace('{{about1}}', data.about1);
            temp = temp.replace('{{about2}}', data.about2);
            if(data.realtime_fl) {
                temp = temp.replace('{{realtime_text}}', realtimeText);
                temp = temp.replace('{{apply_method}}', applyMethodRealtime);

            } else {
                temp = temp.replace('{{realtime_text}}', inqueryText);
                temp = temp.replace('{{apply_method}}', applyMethod);
            }
            content.push(temp);
        });

        layer = article.replace('{{element_id}}', prodId);
        layer = layer.replace('{{infoprd_layer}}', content.join(''));
        wrap.html(layer);
    }

    function readProductDesc() { // 상품 상세설명 레이어 열고 닫기

        //if (!document.getElementById("productDesc")) {
        //    return;
        //} // '상품 상세설명'이 없다면 실행 중지

        var flag = false,
            wrapProduct = $('<section id="productDesc"></section>'),
            //wrapProduct = $("#productDesc"),
            bodyElement = $("body").eq(0),
            dimdElement = $('<div id="imdModal" class="dimd_modal"></div>'),
            btnDetailPopup = $("#content a.go_product_guide"),
            btnDetailPopup2 = $("#productTable a.go_product_guide"),
            //btnCloseLayer = $("#productDesc .btn_close_layer"),
            openedProduct = null;

        bodyElement.append(wrapProduct).append(dimdElement); // body의 자식노드로 이동
        dimdElement.hide();

        // '상품안내 상세보기'버튼 이벤트 시작

        btnDetailPopup.add(btnDetailPopup2).bind("click", function (ev) {

            var targetID = $(this)[0].getAttribute("href").substr(1);
            appendTemplete(wrapProduct, targetID);

            var target = $("#" + targetID),
                targetInner = target.find("div.infoprd_layer"),
                scrollContents = target.find("div.about_prd"),
                btnMoveProduct = target.find("a[class^='btn_product']"),
                btnCloseLayer = $("#productDesc .btn_close_layer"),
                openedTarget = null;

            function closeOpenLayer(idx) {
                if (!idx) {
                    idx = 0;
                }
                targetInner.hide();
                targetInner.eq(idx).show();
                scrollContents.eq(idx).appendTo(target);
            }

            function revertScrollContents(idx) {
                if (!idx) {
                    idx = 0;
                }
                scrollContents.eq(idx).appendTo(targetInner.eq(idx));
            }

            target.append(scrollContents.eq(0));

            if (scrollContents.length > 1) {
                var idxProduct = 0,
                    btnPrev = $('<button type="button" class="btn_product_prev">이전 상품</button>'),
                    btnNext = $('<button type="button" class="btn_product_next">다음 상품</button>');

                targetInner.hide();
                targetInner.eq(idxProduct).show();
                target.append(btnPrev, btnNext);

                function checkIdxProduct(idx) {
                    if (idx === 0) {
                        btnPrev.hide();
                        btnNext.show();
                    } else if ((idx + 1) === scrollContents.length) {
                        btnPrev.show();
                        btnNext.hide();
                    } else {
                        btnPrev.show();
                        btnNext.show();
                    }
                }

                checkIdxProduct(idxProduct);

                btnPrev.bind("click", function () {
                    revertScrollContents(idxProduct);
                    idxProduct = idxProduct - 1;
                    checkIdxProduct(idxProduct);
                    closeOpenLayer(idxProduct);
                });
                btnNext.bind("click", function () {
                    revertScrollContents(idxProduct);
                    idxProduct = idxProduct + 1;
                    checkIdxProduct(idxProduct);
                    closeOpenLayer(idxProduct);
                });
            }

            target.addClass("on");
            dimdElement.show();
            flag = true;
            openedTarget = target;

            $("#dimdModal").bind("touchmove", function (e) {
                e.preventDefault();
            });
            $(target).find(".infoprd_layer").eq(0).bind("touchmove", function (e) {
                e.preventDefault();
            });
            btnCloseLayer.bind("click", function () {
                revertScrollContents(idxProduct);
                openedTarget.removeClass("on").removeAttr("style");
                dimdElement.hide();
                flag = false;
                idxProduct = 0;
                openedProduct = null;
                target = null;
                if (btnPrev) {
                    btnPrev.add(btnNext).remove();
                }
                $("#dimdModal").add($(openedTarget).find(".infoprd_layer").eq(0)).unbind("touchmove"); // 스크롤 잠금 해제
            });

            event.preventDefault();
        });
        // '상품안내 상세보기'버튼 이벤트 끝
    }

    var description = {
        productDescPlatinum: [
            {
                name: '플래티넘 M',
                price: '2,600,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">플래티넘 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">프리미엄 플러스 M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 12회 M</span> 적용</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">효과패키지(컬러) M</span> 적용</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescSpecialGold: [
            {
                name: '스페셜 골드 M',
                price: '1,650,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">스페셜 골드 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>와 고급스러운 <span class="point">배경 컬러</span>로 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">프리미엄 알파 M</span> 으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 12회 M</span> 적용</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">효과패키지(컬러) M</span> 적용</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescSpecialPlus: [
            {
                name: '스페셜 플러스 M',
                price: '1,265,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">스페셜 플러스 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>와 고급스러운 <span class="point">배경 컬러</span>로 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">프리미엄 알파 M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 6회 M</span> 적용</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">효과패키지(컬러) M</span> 적용</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescSpecial: [
            {
                name: '스페셜 M',
                price: '990,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">스페셜 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 노출되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">프리미엄 M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 6회 M</span> 적용</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescEutteumFixed: [
            {
                name: '으뜸 플러스 M',
                price: '770,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">으뜸 플러스 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>와 고급스러운 <span class="point">배경 컬러</span>로 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">포커스 플러스 M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 6회 M</span> 적용</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescEutteum: [
            {
                name: '으뜸 M',
                price: '660,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">으뜸 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">포커스 플러스 M</span>으로 노출 </li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 6회 M</span> 적용</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            },
            {
                name: '실시간 으뜸 M',
                price: '100,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">으뜸 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">포커스 M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 3회 M</span> 적용</li>'
                + '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }

        ],
        productDescAljjaFixed: [
            {
                name: '알짜 플러스 M',
                price: '495,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">알짜 플러스 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>와 고급스러운 <span class="point">배경 컬러</span>로 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">PLUS M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 6회 M</span> 적용</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescAljja: [
            {
                name: '알짜 M',
                price: '385,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">알짜 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">PLUS M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 6회 M</span> 적용</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            },
            {
                name: '실시간 알짜 M',
                price: '55,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">알짜 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">TOP M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 3회 M</span> 적용</li>'
                + '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescNarae: [
            {
                name: '나래 M',
                price: '346,500',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 첫 페이지 하단 <span class="point">나래 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">PLUS M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 6회 M</span> 적용</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            },
            {
                name: '실시간 나래 M',
                price: '50,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 첫 페이지 하단 <span class="point">나래 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">PLUS M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 3회 M</span> 적용</li>'
                + '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescHeadlinePrime: [
            {
                name: '헤드라인 프라임 M',
                price: '495,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 전체 채용정보 메인 상단<br /><span class="point">헤드라인 M</span> 영역 우선 노출</li>'
                + '<li><span class="point">기업 로고</span>와 고급스러운 <span class="point">배경 컬러</span>로 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">프리미엄 M</span>으로 노출</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescHeadline: [
            {
                name: '헤드라인 M',
                price: '385,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 전체 채용정보 메인 상단<br /><span class="point">헤드라인 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>와 고급스러운 <span class="point">배경 컬러</span>로 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">프리미엄 M</span>으로 노출</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescNuri: [
            {
                name: '누리 M',
                price: '275,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 전체 채용정보 메인 상단<br /> <span class="point">누리 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">포커스 M</span>으로 노출</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescGaram: [
            {
                name: '가람 M',
                price: '247,500',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 전체 채용정보 메인 상단<br /> <span class="point">가람 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">포커스 M</span>으로 노출</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescGaon: [
            {
                name: '가온 M',
                price: '231,000',
                unit: 'week',
                about1: '<li>모바일 사람인 전체 채용정보 메인 상단 <br /><span class="point">가온 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">포커스 M</span>으로 노출</li>'
                + '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescBestRecruit: [
            {
                name: 'BEST 공채속보 M',
                price: '1,155,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 공채의 명가 상단<br /> <span class="point">BEST 공채속보 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>와 고급스러운 <span class="point">배경 컬러</span>로 주목도 높음</li>'
                + '<li class="attention">※ 본 상품은 대기업(매출 1000대, 상장기업, 공기업 등)을 위한 상품으로, 일부 기업에 판매가 제한될 수 있습니다.</li>',
                about2: '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescBestSpecialRecruit: [
            {
                name: 'BEST 전문속보 M',
                price: '385,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>모바일 사람인 전체채용 카테고리 상단 <span class="point">BEST 전문속보 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>와 고급스러운 <span class="point">배경 컬러</span>로 주목도 높음</li>'
                + '<li class="attention">※ 본 상품은 전문 분야에 특화된 카테고리에 노출되는 상품으로 공고에 맞는 카테고리가 없을 경우 판매가 제한될 수 있습니다.</li>',
                about2: '<li class="press_horizontally">취업 관련 카페 (다음, 네이버 등) 및 커뮤니티 (뽐뿌 등), 언론사(머니투데이등) 취업 관련 게시판 및 사람인 전문속보 동시노출</li>'
            }
        ],
        productDescRealEutteum: [
            {
                name: '실시간 으뜸 M',
                price: '100,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">으뜸 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">포커스 M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 3회 M</span> 적용</li>'
                + '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescRealAljja: [
            {
                name: '실시간 알짜 M',
                price: '55,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 첫 페이지 상단 <span class="point">알짜 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">TOP M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 3회 M</span> 적용</li>'
                + '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescRealNarae: [
            {
                name: '실시간 나래 M',
                price: '50,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 첫 페이지 하단 <span class="point">나래 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>',
                about2: '<li>모바일 직업/산업/지역 <span class="point">PLUS M</span>으로 노출</li>'
                + '<li>모바일 직업/산업/지역 리스트에 <span class="point">랭크업 3회 M</span> 적용</li>'
                + '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescPremiumFix: [
            {
                name: '프리미엄 플러스 M',
                price: '60,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 상단<br><span class="point">프리미엄 M</span> 영역 우선 노출</li>'
                + '<li><span class="point">기업 로고</span>와 <span class="point">배경 컬러 제공</span></li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 2일 (120,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            },
            {
                name: '프리미엄 알파 M',
                price: '35,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 상단 <br><span class="point">프리미엄 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>와 <span class="point">배경 컬러</span>로 주목도 높음</li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 2일 (70,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            },
            {
                name: '프리미엄 M',
                price: '30,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 상단 <br><span class="point">프리미엄 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 2일 (60,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescPremiumAlpha: [
            {
                name: '프리미엄 알파 M',
                price: '35,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 상단 <br><span class="point">프리미엄 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>와 <span class="point">배경 컬러</span>로 주목도 높음</li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 2일 (70,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescPremium: [
            {
                name: '프리미엄 M',
                price: '30,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 상단 <br><span class="point">프리미엄 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 2일 (60,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescFocusFix: [
            {
                name: '포커스 플러스 M',
                price: '25,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 상단 <span class="point">포커스 플러스 M</span> 영역 우선 노출</li>'
                + '<li><span class="point">기업 로고</span>와 <span class="point">배경 컬러 제공</span></li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 2일 (50,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            },
            {
                name: '포커스 M',
                price: '22,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 상단 <span class="point">포커스 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 2일 (44,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescFocus: [
            {
                name: '포커스 M',
                price: '22,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 상단 <span class="point">포커스 M</span> 영역 노출</li>'
                + '<li><span class="point">기업 로고</span>가 제공되어 주목도 높음</li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 2일 (44,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescTop: [
            {
                name: 'TOP M',
                price: '17,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 하단 <span class="point">TOP M</span> 영역 노출</li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 3일 (51,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescPlus: [
            {
                name: 'PLUS M',
                price: '11,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 사람인 직업/산업/지역 하단 <span class="point">PLUS M</span> 영역 노출</li>'
                + '<li>4일 이상 유료 이용 시 볼드, 랭크업 서비스 제공</li>'
                + '<li>최소 신청: 3일 (33,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescRankup3: [
            {
                name: '랭크UP 3회 M',
                price: '10,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li><span class="point">8시간</span>마다 모바일 일반 리스트 최상단으로 자동 점프</li>'
                + '<li>기업명 앞에<span class="point">UP</span>아이콘 표시</li>'
                + '<li>최소 신청: 3일(30,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescRankup6: [
            {
                name: '랭크UP 6회 M',
                price: '13,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li><span class="point">4시간</span>마다 모바일 일반 리스트 최상단으로 자동 점프</li>'
                + '<li>기업명 앞에<span class="point">UP</span>아이콘 표시</li>'
                + '<li>최소 신청: 3일(39,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescRankup12: [
            {
                name: '랭크UP 12회 M',
                price: '20,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li><span class="point">2시간</span>마다 모바일 일반 리스트 최상단으로 자동 점프</li>'
                + '<li>기업명 앞에<span class="point">UP</span>아이콘 표시</li>'
                + '<li>최소 신청: 3일(60,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescBold: [
            {
                name: '볼드 M',
                price: '6,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 일반 리스트에 기업명 + 공고제목 굵고 진하게 강조 표시</li>'
                + '<li>최소 신청: 3일(18,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescColor: [
            {
                name: '컬러 M',
                price: '5,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 일반 리스트에 기업명 + 공고제목 강렬한 컬러로 강조 표시</li>'
                + '<li>최소 신청: 3일(15,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescAttention: [
            {
                name: '주목 M',
                price: '4,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 일반 리스트에 기업명 앞 눈에 띄는 아이콘 표시</li>'
                + '<li>최소 신청: 3일(12,000원)</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescEffectPacHighlighter: [
            {
                name: '효과패키지(형광펜) M',
                price: '17,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 일반 리스트에 아이콘 + 볼드 + 형광펜 + 컬러로 강조 표시</li>'
                + '<li>최소 신청: 3일(51,000원)</li>'
                + '<li class="attention">※ TOP M, PLUS M과 함께 이용하시면 더욱 효과적입니다.</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescEffectPacColor: [
            {
                name: '효과패키지(컬러) M',
                price: '12,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>모바일 일반 리스트에 아이콘 + 볼드 + 컬러로 강조 표시</li>'
                + '<li>최소 신청: 3일(36,000원)</li>'
                + '<li class="attention">※ TOP M, PLUS M과 함께 이용하시면 더욱 효과적입니다.</li>',
                about2: '<li>모바일 일반 리스트에 하이라이트 효과 적용</li>'
            }
        ],
        productDescSearchKeyword: [
            {
                name: '검색 키워드 M',
                price: '1,650',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>키워드 검색 시 통합검색 상단 영역에 노출</li>'
                + '<li>최소 신청: 2일</li>'
                + '<li>최소 5개, 최대 10개까지 구매 가능<br>(파견 기업은 최대 15개 구매 가능)</li>',
                about2: '<li>기업명 검색 시 통합검색 상단 영역에 노출</li>'
            }
        ],

        x_end: {}
    };

    $(function() {
        readProductDesc();
    });

})(jQuery, window);