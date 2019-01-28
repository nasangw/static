
/**
 * Created by JPJUNG on 2015-09-09.
 */

(function($, window) {
    //var isFirstLoad = true;

    $(function() {

        window.platinum_m = Swipe(document.getElementById('platinum_container'), {
            continuous: true,
            startSlide: getLoadBannerPageNum('platinum_m'),
            moreSlideLeft: 48,
            moreSlideRight: 48,
            callback: function (index, element) {
                paging(index, 'platinum_m', platinum_m);
            }
        });

    });


})(jQuery, window);

var makeBanner = {
    bufferSpecial : [],
    buffer : [],
    addBuffer : function(parameters) {

        this.buffer.push(parameters);

    },
    addBufferSpecial : function(parameters) {

        this.bufferSpecial.push(parameters);

    },
    load : function() {

        var loadBannerCategory = getloadBannerCategory();

        $.each(this.buffer, function(idx, parameters) {
            $.ajax({
                method: 'POST',
                url: '/index/assign-banner-list',
                dataType: 'json',
                data: {'jsonString': '['+makeBanner.makeJsonString(parameters)+']'}
            }).done(function (data) {

                $('#' + parameters.adsCategory + '_load').html(data[parameters.itemId]);

                window[parameters.adsCategory] = Swipe(document.getElementById(parameters.adsCategory + '_container'), {
                    continuous: true,
                    startSlide: getLoadBannerPageNum(parameters.adsCategory),
                    moreSlideRight: 48,
                    callback: function (index, element) {
                        paging(index, parameters.adsCategory, window[parameters.adsCategory]);
                    }
                });

                if (parameters.adsCategory == loadBannerCategory && !!window[loadBannerCategory]) {
                    paging(getLoadBannerPageNum(parameters.adsCategory), loadBannerCategory, window[loadBannerCategory]);
                }
            });

        });

    },
    loadGroup : function(type) {

        type = type || 'normal';

        var loadBannerCategory = getloadBannerCategory(),
            paramSet = {
                'special' : this.bufferSpecial,
                'normal' : this.buffer
            }
        ;

        //var sName = navigator.platform || '',
        //    nHeight = screen.height || '',
        //    dRatio = window.devicePixelRatio || ''
        //;

        // $.ajax({
        //     method: 'POST',
        //     url: '/index/assign-banner-list',
        //     dataType: 'json',
        //     data: {'jsonString' : this.makeJsonString(paramSet[type]), 'startPage': '1'}
        // }).done(function(data) {
        //     $.each(paramSet[type], function(idx, parameters){

        //         $('#' + parameters.adsCategory + '_load').append(data[parameters.itemId]);

        //         window[parameters.adsCategory] = Swipe(document.getElementById(parameters.adsCategory + '_container'), {
        //             continuous: true,
        //             startSlide: getLoadBannerPageNum(parameters.adsCategory),
        //             moreSlideRight: 48,
        //             callback: function (index, element) {
        //                 paging(index, parameters.adsCategory, window[parameters.adsCategory]);
        //             }
        //         });

        //         if (parameters.adsCategory == loadBannerCategory && !!window[loadBannerCategory]) {
        //             paging(getLoadBannerPageNum(parameters.adsCategory), loadBannerCategory, window[loadBannerCategory]);
        //         }
        //     });
        // });

    },

    /**
     * json형태의 문자열 생성.
     */
    makeJsonString : function(objData, keyStr) {

        var dataList = [],
            data = [],
            jsonString = '';

        objList = objData.length == undefined ? [objData] : objData;

        $.each(objList, function(idx, obj){
            data = [];
            for( key in obj ) {
                if( keyStr == undefined || keyStr.indexOf(key) > - 1) {
                    data.push('"'+key+'":"' + obj[key]+'"');
                }
            }
            dataList.push('{' + data.join(',') + '}');
        } );

        if( objData.length == undefined ) {
            jsonString = dataList[0];
        } else {
            jsonString = '[' + dataList.join(',') + ']';
        }

        return jsonString;
    },

    x_end : {}
}


function paging(index, targetId, swipeObj) {

    var elt = sliderList[targetId].currentPage;

    swipeObj.setActiveSlideClass(index);

    if( !!elt ) {
        var orgSlideLength = swipeObj.getOriSlideLength();

        if( orgSlideLength < (index+1) ) {
            if( orgSlideLength == 3 || orgSlideLength == 4 ) {
                index = index - orgSlideLength;
            } else if ( orgSlideLength == 2 ) {
                index = index%2;
            } else {
                index = Math.ceil(index/2) - 1;
            }
        }

        elt.html(index+1);
    }
}

var sliderList = {
    "platinum_m" : {
        "slider" : 'platinum_container',
        "currentPage" : $('#productPlatinum').find('.current_page')
    },
    "prime_m" : {
        "slider" : 'prime_m_container',
        "currentPage" : $('#productPrime').find('.current_page')
    },
    "special_gold_m" : {
        "slider" : 'special_gold_m_container',
        "currentPage" : $('#productSpecialGold').find('.current_page')
    },
    "special_plus_m" : {
        "slider" : 'special_plus_m_container',
        "currentPage" : $('#productSpecialPlus').find('.current_page')
    },
    "special_m" : {
        "slider" : 'special_m_container',
        "currentPage" : $('#productSpecial').find('.current_page')
    },
    "eutteum_fix_m" : {
        "slider" : 'eutteum_fix_m_container',
        "currentPage" : $('#productFirstFixed').find('.current_page')
    },
    "eutteum_m" : {
        "slider" : 'eutteum_m_container',
        "currentPage" : $('#productFirst').find('.current_page')
    },
    "aljja_fix_m" : {
        "slider" : 'aljja_fix_m_container',
        "currentPage" : $('#productEssenceFixed').find('.current_page')
    },
    "aljja_m" : {
        "slider" : 'aljja_m_container',
        "currentPage" : $('#productEssence').find('.current_page')
    },
    "narae_m" : {
        "slider" : 'narae_m_container',
        "currentPage" : $('#productNarae').find('.current_page')
    }
};

/**
 * 클릭 배너 page History 처리
 */
var bannerPageHistory = function(category) {
    var slidePageNum = 0;
    $.each(sliderList, function(sliderName, data) {
        if( sliderName == category && data.currentPage ) {
            slidePageNum = data.currentPage.html();
        }
    });
    deleteLocalStorage();
    saveLocalStorage('m_banner_category', category);
    saveLocalStorage('m_banner_page', slidePageNum);
}

/**
 * local storage data save
 */
var saveLocalStorage = function(item, value) {
    try {
        localStorage.setItem(item, value);
        return true;
    } catch(e) {
        return false;
    }
}

/**
 * get local storage data
 */
var getLocalStorage = function(item) {
    try {
        return localStorage.getItem(item);
    } catch(e) {
        return '';
    }
}

/**
 * delete local storage data
 */
var deleteLocalStorage = function() {
    try {
        localStorage.removeItem('m_banner_category');
        localStorage.removeItem('m_banner_page');
        return true;
    } catch(e) {
        return false;
    }
}

function getLoadBannerPageNum(name) {
    var page = 0 ;
    $.each(sliderList, function(sliderName, data) {
        if( loadBannerCategory && loadBannerCategory == sliderName && sliderName == name) {
            if( Number(loadBannerPage) > 1 ) {
                page = Number(loadBannerPage)-1;
                return page;
            }
        }
    });
    return page;
}

var loadBannerCategory = getLocalStorage('m_banner_category');
var loadBannerPage = getLocalStorage('m_banner_page') || 1;

function getloadBannerCategory() {
    return loadBannerCategory || '';
}
