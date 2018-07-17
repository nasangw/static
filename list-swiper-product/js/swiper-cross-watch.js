'use strict';

var strapCode,
    strapLabel,
    bodyCode,
    bodyLabel,
    productCode,
    arraySelectedProductCode,
    arraySelectedProductLabel,
    swiperHorizontal,
    swiperVertical,
    isSelectBody,
    totalItemCount,
    horizontalSpaceBetween,
    jsonData
;

if (!isSelectBody) {
    hideElem('#btnTargetStrap');
}

// define empty array
arraySelectedProductCode = [];
arraySelectedProductLabel = [];

// set total count for items
totalItemCount = 4;

function showElem(target) {
    if (!target) {
        return;
    }
    $(target).show();
}

function hideElem(target) {
    if (!target) {
        return;
    }
    $(target).hide();
}

function readyForBuy() {
    // console.log('구성품을 모두 선택하였으니 구매 버튼을...');
    // console.log(arraySelectedProductCode);

    showElem('#finalPrice');
}

function showListItem() {
    if (!arraySelectedProductCode.length) {
        return;
    }
    var listItemInCart = $('#listItemInCart');
    listItemInCart.empty();

    arraySelectedProductCode.forEach(function(elem, index) {
        var li = $('<li></li>');
        if (index === 0) {
            li.addClass('type-body');
        }
        $('<span class="title-item"></span>').text(arraySelectedProductLabel[index]).appendTo(li);
        $('<button type="button" class="btn-remove-incart">remove item</button>').data('code', elem).appendTo(li);
        li.appendTo(listItemInCart);
    });
}

function isReturnCheckRepetition(value) {
    if (!arraySelectedProductCode.length) {
        return;
    }
    var repetition;

    for(var i=0; i<arraySelectedProductCode.length; i++) {
        if (value === arraySelectedProductCode[i]) {
            repetition = true;
            break;
        }
    }

    if (repetition) {
        return true;
    }else {
        return false;
    }
}

function activateEventRemoveButton() {
    $('.btn-remove-incart').on('click', function() {
        removeItemInCart(this);
    });
}

function removeItemInCart(elem) {
    var itemIndex,
        isBody = $(elem).parent().hasClass('type-body');

    if (isBody) {
        arraySelectedProductCode[0] = undefined;
        arraySelectedProductLabel[0] = undefined;
        isSelectBody = false;
        hideElem('#btnTargetStrap');
        // showElem('#btnTargetBody');
        $('#btnTargetBody').show().focus();
    }else {
        itemIndex = getIndexInArray( $(elem).data('code') );
        arraySelectedProductCode.splice(itemIndex, 1);
        arraySelectedProductLabel.splice(itemIndex, 1);

        // hideElem('#btnTargetBody');
        if (isSelectBody) {
            // showElem('#btnTargetStrap');
            $('#btnTargetStrap').show().focus();
        }
        $('#btnTargetBody').focus();
    }
    $(elem).parent().remove();
    hideElem('#finalPrice');
    toggleLayerClass();
}

function getIndexInArray(value) {
    var index;
    for(var i=0; i<arraySelectedProductCode.length; i++) {
        if (value === arraySelectedProductCode[i]) {
            index = i;
            break;
        }
    }
    if (index) {
        return index;
    }
}

function matchItemCode() {
    arraySelectedProductCode.sort();
    // arraySelectedProductCode.sort(function(a, b) {
    //     return a - b;
    // });

    // $.getJSON('json/new-mix-item-code.json', function(data) {
    //     for(var key in data) {
    //         if(arraySelectedProductCode.toLocaleString() === data[key].toLocaleString()) {
    //             productCode = key;
    //             alert('상품코드는 ' + productCode + ' 입니다.');
    //             console.log('상품코드는 ' + productCode + ' 입니다.');
    //             return false;
    //         }
    //     }
    // });

    for(var key in jsonData) {
        if(arraySelectedProductCode.toLocaleString() === jsonData[key].toLocaleString()) {
            productCode = key;
            alert('상품코드는 ' + productCode + ' 입니다.');
            console.log('상품코드는 ' + productCode + ' 입니다.');
            // goodsAddCart(productCode);
            return false;
        }
    }
}

function toggleLayerClass() {
    if (arraySelectedProductCode.length > 0) {
        if (typeof(arraySelectedProductCode[0]) === 'undefined' && arraySelectedProductCode.length === 1) {
            $('#layerCart').removeClass('activate');
        }else {
            $('#layerCart').addClass('activate');
        }
    }
}

// define event for add product to cart
$('#btnTargetStrap').on('click', function(e) {
    if (isReturnCheckRepetition(strapCode)) {
        alert('이미 추가한 상품입니다.');
    }else {
        arraySelectedProductCode.push(strapCode);
        arraySelectedProductLabel.push(strapLabel);
        showListItem();
        activateEventRemoveButton();
    }

    if (arraySelectedProductCode.length === totalItemCount) {
        hideElem(this);
        readyForBuy();
    }
    toggleLayerClass();
});
$('#btnTargetBody').on('click', function(e) {
    if (isSelectBody) {
        return;
    }
    arraySelectedProductCode[0] = bodyCode;
    arraySelectedProductLabel[0] = bodyLabel;
    isSelectBody = true;

    showListItem();
    activateEventRemoveButton();
    hideElem(this);
    if (arraySelectedProductCode.length === totalItemCount) {
        readyForBuy();
    }else {
        $('#btnTargetStrap').show().focus();
    }

    toggleLayerClass();
});
$('#btnBuy').on('click', function(e) {
    if (arraySelectedProductCode.length !== totalItemCount) {
        alert('바디 1개, 스트랩 3개를 선택해주세요.');
    }else {
        if (isSelectBody) {
            matchItemCode();
        }
    }
});

horizontalSpaceBetween = document.documentElement.offsetWidth > 500 ? 140 : 50;

// set swiper for body of watch
swiperHorizontal = new Swiper('#swiperHorizontal', {
    // pagination: '.swiper-pagination',
    slidesPerView: 'auto',
    centeredSlides: true,
    paginationClickable: true,
    spaceBetween: horizontalSpaceBetween,
    // touchEventsTarget: 'wrapper',
    speed: 700,
    loop: true,
    onTouchStart: function(e) {
        $('#swiperHorizontal').addClass('up-zindex');
    },
    onTouchEnd: function(e) {
        setTimeout(function(){
            $('#swiperHorizontal').removeClass('up-zindex');
        }, 300);
    },
    onInit: function(s) {
        var active = $('#swiperHorizontal').find('.swiper-slide-active');
        bodyCode = active.data('product-code');
        bodyLabel = active.data('product-label');
    },
    onSlideChangeEnd: function(s) {
        var active = $('#swiperHorizontal').find('.swiper-slide-active');
        bodyCode = active.data('product-code');
        bodyLabel = active.data('product-label');
    },
});

// set swiper for body of strap
swiperVertical = new Swiper('#swiperVertical', {
    // pagination: '.swiper-pagination',
    // paginationClickable: true,
    // prevButton: '.swiper-button-prev',
    // nextButton: '.swiper-button-next',
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 30,
    direction: 'vertical',
    // touchEventsTarget: 'wrapper',
    loop: true,
    // onTouchStart: function(e) {
    //     $('#swiperHorizontal').addClass('up-zindex');
    // },
    // onTouchEnd: function(e) {
    //     setTimeout(function(){
    //         $('#swiperHorizontal').removeClass('up-zindex');
    //     }, 300);
    // },
    onInit: function(s) {
        var active = $('#swiperVertical').find('.swiper-slide-active');
        // strapCode = parseInt(active.data('product-code').substring(3));
        strapCode = active.data('product-code');
        strapLabel = active.data('product-label');
    },
    onSlideChangeEnd: function(s) {
        var active = $('#swiperVertical').find('.swiper-slide-active');
        // strapCode = parseInt(active.data('product-code').substring(3));
        strapCode = active.data('product-code');
        strapLabel = active.data('product-label');
    },
});


// disable bounce effect scroll on iPhone Browser
if (navigator.userAgent.indexOf('iPhone OS')) {
    document.addEventListener("touchmove", function(event){
        event.preventDefault();
    });
}

jsonData = {
    "1101": ["B-SB", "STR01", "STR02", "STR03"],
    "1102": ["B-SB", "STR01", "STR02", "STR04"],
    "1103": ["B-SB", "STR01", "STR02", "STR05"],
    "1104": ["B-SB", "STR01", "STR02", "STR06"],
    "1105": ["B-SB", "STR01", "STR02", "STR07"],
    "1106": ["B-SB", "STR01", "STR02", "STR08"],
    "1107": ["B-SB", "STR01", "STR02", "STR09"],
    "1108": ["B-SB", "STR01", "STR02", "STR10"],
    "1109": ["B-SB", "STR01", "STR03", "STR04"],
    "1110": ["B-SB", "STR01", "STR03", "STR05"],
    "1111": ["B-SB", "STR01", "STR03", "STR06"],
    "1112": ["B-SB", "STR01", "STR03", "STR07"],
    "1113": ["B-SB", "STR01", "STR03", "STR08"],
    "1114": ["B-SB", "STR01", "STR03", "STR09"],
    "1115": ["B-SB", "STR01", "STR03", "STR10"],
    "1116": ["B-SB", "STR01", "STR04", "STR05"],
    "1117": ["B-SB", "STR01", "STR04", "STR06"],
    "1118": ["B-SB", "STR01", "STR04", "STR07"],
    "1119": ["B-SB", "STR01", "STR04", "STR08"],
    "1120": ["B-SB", "STR01", "STR04", "STR09"],
    "1121": ["B-SB", "STR01", "STR04", "STR10"],
    "1122": ["B-SB", "STR01", "STR05", "STR06"],
    "1123": ["B-SB", "STR01", "STR05", "STR07"],
    "1124": ["B-SB", "STR01", "STR05", "STR08"],
    "1125": ["B-SB", "STR01", "STR05", "STR09"],
    "1126": ["B-SB", "STR01", "STR05", "STR10"],
    "1127": ["B-SB", "STR01", "STR06", "STR07"],
    "1128": ["B-SB", "STR01", "STR06", "STR08"],
    "1129": ["B-SB", "STR01", "STR06", "STR09"],
    "1130": ["B-SB", "STR01", "STR06", "STR10"],
    "1131": ["B-SB", "STR01", "STR07", "STR08"],
    "1132": ["B-SB", "STR01", "STR07", "STR09"],
    "1133": ["B-SB", "STR01", "STR07", "STR10"],
    "1134": ["B-SB", "STR01", "STR08", "STR09"],
    "1135": ["B-SB", "STR01", "STR08", "STR10"],
    "1136": ["B-SB", "STR01", "STR09", "STR10"],
    "1137": ["B-SB", "STR02", "STR03", "STR04"],
    "1138": ["B-SB", "STR02", "STR03", "STR05"],
    "1139": ["B-SB", "STR02", "STR03", "STR06"],
    "1140": ["B-SB", "STR02", "STR03", "STR07"],
    "1141": ["B-SB", "STR02", "STR03", "STR08"],
    "1142": ["B-SB", "STR02", "STR03", "STR09"],
    "1143": ["B-SB", "STR02", "STR03", "STR10"],
    "1144": ["B-SB", "STR02", "STR04", "STR05"],
    "1145": ["B-SB", "STR02", "STR04", "STR06"],
    "1146": ["B-SB", "STR02", "STR04", "STR07"],
    "1147": ["B-SB", "STR02", "STR04", "STR08"],
    "1148": ["B-SB", "STR02", "STR04", "STR09"],
    "1149": ["B-SB", "STR02", "STR04", "STR10"],
    "1150": ["B-SB", "STR02", "STR05", "STR06"],
    "1151": ["B-SB", "STR02", "STR05", "STR07"],
    "1152": ["B-SB", "STR02", "STR05", "STR08"],
    "1153": ["B-SB", "STR02", "STR05", "STR09"],
    "1154": ["B-SB", "STR02", "STR05", "STR10"],
    "1155": ["B-SB", "STR02", "STR06", "STR07"],
    "1156": ["B-SB", "STR02", "STR06", "STR08"],
    "1157": ["B-SB", "STR02", "STR06", "STR09"],
    "1158": ["B-SB", "STR02", "STR06", "STR10"],
    "1159": ["B-SB", "STR02", "STR07", "STR08"],
    "1160": ["B-SB", "STR02", "STR07", "STR09"],
    "1161": ["B-SB", "STR02", "STR07", "STR10"],
    "1162": ["B-SB", "STR02", "STR08", "STR09"],
    "1163": ["B-SB", "STR02", "STR08", "STR10"],
    "1164": ["B-SB", "STR02", "STR09", "STR10"],
    "1165": ["B-SB", "STR03", "STR04", "STR05"],
    "1166": ["B-SB", "STR03", "STR04", "STR06"],
    "1167": ["B-SB", "STR03", "STR04", "STR07"],
    "1168": ["B-SB", "STR03", "STR04", "STR08"],
    "1169": ["B-SB", "STR03", "STR04", "STR09"],
    "1170": ["B-SB", "STR03", "STR04", "STR10"],
    "1171": ["B-SB", "STR03", "STR05", "STR06"],
    "1172": ["B-SB", "STR03", "STR05", "STR07"],
    "1173": ["B-SB", "STR03", "STR05", "STR08"],
    "1174": ["B-SB", "STR03", "STR05", "STR09"],
    "1175": ["B-SB", "STR03", "STR05", "STR10"],
    "1176": ["B-SB", "STR03", "STR06", "STR07"],
    "1177": ["B-SB", "STR03", "STR06", "STR08"],
    "1178": ["B-SB", "STR03", "STR06", "STR09"],
    "1179": ["B-SB", "STR03", "STR06", "STR10"],
    "1180": ["B-SB", "STR03", "STR07", "STR08"],
    "1181": ["B-SB", "STR03", "STR07", "STR09"],
    "1182": ["B-SB", "STR03", "STR07", "STR10"],
    "1183": ["B-SB", "STR03", "STR08", "STR09"],
    "1184": ["B-SB", "STR03", "STR08", "STR10"],
    "1185": ["B-SB", "STR03", "STR09", "STR10"],
    "1186": ["B-SB", "STR04", "STR05", "STR06"],
    "1187": ["B-SB", "STR04", "STR05", "STR07"],
    "1188": ["B-SB", "STR04", "STR05", "STR08"],
    "1189": ["B-SB", "STR04", "STR05", "STR09"],
    "1190": ["B-SB", "STR04", "STR05", "STR10"],
    "1191": ["B-SB", "STR04", "STR06", "STR07"],
    "1192": ["B-SB", "STR04", "STR06", "STR08"],
    "1193": ["B-SB", "STR04", "STR06", "STR09"],
    "1194": ["B-SB", "STR04", "STR06", "STR10"],
    "1195": ["B-SB", "STR04", "STR07", "STR08"],
    "1196": ["B-SB", "STR04", "STR07", "STR09"],
    "1197": ["B-SB", "STR04", "STR07", "STR10"],
    "1198": ["B-SB", "STR04", "STR08", "STR09"],
    "1199": ["B-SB", "STR04", "STR08", "STR10"],
    "1200": ["B-SB", "STR04", "STR09", "STR10"],
    "1201": ["B-SB", "STR05", "STR06", "STR07"],
    "1202": ["B-SB", "STR05", "STR06", "STR08"],
    "1203": ["B-SB", "STR05", "STR06", "STR09"],
    "1204": ["B-SB", "STR05", "STR06", "STR10"],
    "1205": ["B-SB", "STR05", "STR07", "STR08"],
    "1206": ["B-SB", "STR05", "STR07", "STR09"],
    "1207": ["B-SB", "STR05", "STR07", "STR10"],
    "1208": ["B-SB", "STR05", "STR08", "STR09"],
    "1209": ["B-SB", "STR05", "STR08", "STR10"],
    "1210": ["B-SB", "STR05", "STR09", "STR10"],
    "1211": ["B-SB", "STR06", "STR07", "STR08"],
    "1212": ["B-SB", "STR06", "STR07", "STR09"],
    "1213": ["B-SB", "STR06", "STR07", "STR10"],
    "1214": ["B-SB", "STR06", "STR08", "STR09"],
    "1215": ["B-SB", "STR06", "STR08", "STR10"],
    "1216": ["B-SB", "STR06", "STR09", "STR10"],
    "1217": ["B-SB", "STR07", "STR08", "STR09"],
    "1218": ["B-SB", "STR07", "STR08", "STR10"],
    "1219": ["B-SB", "STR07", "STR09", "STR10"],
    "1220": ["B-SB", "STR08", "STR09", "STR10"],
    "1221": ["B-SW", "STR01", "STR02", "STR03"],
    "1222": ["B-SW", "STR01", "STR02", "STR04"],
    "1223": ["B-SW", "STR01", "STR02", "STR05"],
    "1224": ["B-SW", "STR01", "STR02", "STR06"],
    "1225": ["B-SW", "STR01", "STR02", "STR07"],
    "1226": ["B-SW", "STR01", "STR02", "STR08"],
    "1227": ["B-SW", "STR01", "STR02", "STR09"],
    "1228": ["B-SW", "STR01", "STR02", "STR10"],
    "1229": ["B-SW", "STR01", "STR03", "STR04"],
    "1230": ["B-SW", "STR01", "STR03", "STR05"],
    "1231": ["B-SW", "STR01", "STR03", "STR06"],
    "1232": ["B-SW", "STR01", "STR03", "STR07"],
    "1233": ["B-SW", "STR01", "STR03", "STR08"],
    "1234": ["B-SW", "STR01", "STR03", "STR09"],
    "1235": ["B-SW", "STR01", "STR03", "STR10"],
    "1236": ["B-SW", "STR01", "STR04", "STR05"],
    "1237": ["B-SW", "STR01", "STR04", "STR06"],
    "1238": ["B-SW", "STR01", "STR04", "STR07"],
    "1239": ["B-SW", "STR01", "STR04", "STR08"],
    "1240": ["B-SW", "STR01", "STR04", "STR09"],
    "1241": ["B-SW", "STR01", "STR04", "STR10"],
    "1242": ["B-SW", "STR01", "STR05", "STR06"],
    "1243": ["B-SW", "STR01", "STR05", "STR07"],
    "1244": ["B-SW", "STR01", "STR05", "STR08"],
    "1245": ["B-SW", "STR01", "STR05", "STR09"],
    "1246": ["B-SW", "STR01", "STR05", "STR10"],
    "1247": ["B-SW", "STR01", "STR06", "STR07"],
    "1248": ["B-SW", "STR01", "STR06", "STR08"],
    "1249": ["B-SW", "STR01", "STR06", "STR09"],
    "1250": ["B-SW", "STR01", "STR06", "STR10"],
    "1251": ["B-SW", "STR01", "STR07", "STR08"],
    "1252": ["B-SW", "STR01", "STR07", "STR09"],
    "1253": ["B-SW", "STR01", "STR07", "STR10"],
    "1254": ["B-SW", "STR01", "STR08", "STR09"],
    "1255": ["B-SW", "STR01", "STR08", "STR10"],
    "1256": ["B-SW", "STR01", "STR09", "STR10"],
    "1257": ["B-SW", "STR02", "STR03", "STR04"],
    "1258": ["B-SW", "STR02", "STR03", "STR05"],
    "1259": ["B-SW", "STR02", "STR03", "STR06"],
    "1260": ["B-SW", "STR02", "STR03", "STR07"],
    "1261": ["B-SW", "STR02", "STR03", "STR08"],
    "1262": ["B-SW", "STR02", "STR03", "STR09"],
    "1263": ["B-SW", "STR02", "STR03", "STR10"],
    "1264": ["B-SW", "STR02", "STR04", "STR05"],
    "1265": ["B-SW", "STR02", "STR04", "STR06"],
    "1266": ["B-SW", "STR02", "STR04", "STR07"],
    "1267": ["B-SW", "STR02", "STR04", "STR08"],
    "1268": ["B-SW", "STR02", "STR04", "STR09"],
    "1269": ["B-SW", "STR02", "STR04", "STR10"],
    "1270": ["B-SW", "STR02", "STR05", "STR06"],
    "1271": ["B-SW", "STR02", "STR05", "STR07"],
    "1272": ["B-SW", "STR02", "STR05", "STR08"],
    "1273": ["B-SW", "STR02", "STR05", "STR09"],
    "1274": ["B-SW", "STR02", "STR05", "STR10"],
    "1275": ["B-SW", "STR02", "STR06", "STR07"],
    "1276": ["B-SW", "STR02", "STR06", "STR08"],
    "1277": ["B-SW", "STR02", "STR06", "STR09"],
    "1278": ["B-SW", "STR02", "STR06", "STR10"],
    "1279": ["B-SW", "STR02", "STR07", "STR08"],
    "1280": ["B-SW", "STR02", "STR07", "STR09"],
    "1281": ["B-SW", "STR02", "STR07", "STR10"],
    "1282": ["B-SW", "STR02", "STR08", "STR09"],
    "1283": ["B-SW", "STR02", "STR08", "STR10"],
    "1284": ["B-SW", "STR02", "STR09", "STR10"],
    "1285": ["B-SW", "STR03", "STR04", "STR05"],
    "1286": ["B-SW", "STR03", "STR04", "STR06"],
    "1287": ["B-SW", "STR03", "STR04", "STR07"],
    "1288": ["B-SW", "STR03", "STR04", "STR08"],
    "1289": ["B-SW", "STR03", "STR04", "STR09"],
    "1290": ["B-SW", "STR03", "STR04", "STR10"],
    "1291": ["B-SW", "STR03", "STR05", "STR06"],
    "1292": ["B-SW", "STR03", "STR05", "STR07"],
    "1293": ["B-SW", "STR03", "STR05", "STR08"],
    "1294": ["B-SW", "STR03", "STR05", "STR09"],
    "1295": ["B-SW", "STR03", "STR05", "STR10"],
    "1296": ["B-SW", "STR03", "STR06", "STR07"],
    "1297": ["B-SW", "STR03", "STR06", "STR08"],
    "1298": ["B-SW", "STR03", "STR06", "STR09"],
    "1299": ["B-SW", "STR03", "STR06", "STR10"],
    "1300": ["B-SW", "STR03", "STR07", "STR08"],
    "1301": ["B-SW", "STR03", "STR07", "STR09"],
    "1302": ["B-SW", "STR03", "STR07", "STR10"],
    "1303": ["B-SW", "STR03", "STR08", "STR09"],
    "1304": ["B-SW", "STR03", "STR08", "STR10"],
    "1305": ["B-SW", "STR03", "STR09", "STR10"],
    "1306": ["B-SW", "STR04", "STR05", "STR06"],
    "1307": ["B-SW", "STR04", "STR05", "STR07"],
    "1308": ["B-SW", "STR04", "STR05", "STR08"],
    "1309": ["B-SW", "STR04", "STR05", "STR09"],
    "1310": ["B-SW", "STR04", "STR05", "STR10"],
    "1311": ["B-SW", "STR04", "STR06", "STR07"],
    "1312": ["B-SW", "STR04", "STR06", "STR08"],
    "1313": ["B-SW", "STR04", "STR06", "STR09"],
    "1314": ["B-SW", "STR04", "STR06", "STR10"],
    "1315": ["B-SW", "STR04", "STR07", "STR08"],
    "1316": ["B-SW", "STR04", "STR07", "STR09"],
    "1317": ["B-SW", "STR04", "STR07", "STR10"],
    "1318": ["B-SW", "STR04", "STR08", "STR09"],
    "1319": ["B-SW", "STR04", "STR08", "STR10"],
    "1320": ["B-SW", "STR04", "STR09", "STR10"],
    "1321": ["B-SW", "STR05", "STR06", "STR07"],
    "1322": ["B-SW", "STR05", "STR06", "STR08"],
    "1323": ["B-SW", "STR05", "STR06", "STR09"],
    "1324": ["B-SW", "STR05", "STR06", "STR10"],
    "1325": ["B-SW", "STR05", "STR07", "STR08"],
    "1326": ["B-SW", "STR05", "STR07", "STR09"],
    "1327": ["B-SW", "STR05", "STR07", "STR10"],
    "1328": ["B-SW", "STR05", "STR08", "STR09"],
    "1329": ["B-SW", "STR05", "STR08", "STR10"],
    "1330": ["B-SW", "STR05", "STR09", "STR10"],
    "1331": ["B-SW", "STR06", "STR07", "STR08"],
    "1332": ["B-SW", "STR06", "STR07", "STR09"],
    "1333": ["B-SW", "STR06", "STR07", "STR10"],
    "1334": ["B-SW", "STR06", "STR08", "STR09"],
    "1335": ["B-SW", "STR06", "STR08", "STR10"],
    "1336": ["B-SW", "STR06", "STR09", "STR10"],
    "1337": ["B-SW", "STR07", "STR08", "STR09"],
    "1338": ["B-SW", "STR07", "STR08", "STR10"],
    "1339": ["B-SW", "STR07", "STR09", "STR10"],
    "1340": ["B-SW", "STR08", "STR09", "STR10"],
    "1341": ["B-RB", "STR01", "STR02", "STR03"],
    "1342": ["B-RB", "STR01", "STR02", "STR04"],
    "1343": ["B-RB", "STR01", "STR02", "STR05"],
    "1344": ["B-RB", "STR01", "STR02", "STR06"],
    "1345": ["B-RB", "STR01", "STR02", "STR07"],
    "1346": ["B-RB", "STR01", "STR02", "STR08"],
    "1347": ["B-RB", "STR01", "STR02", "STR09"],
    "1348": ["B-RB", "STR01", "STR02", "STR10"],
    "1349": ["B-RB", "STR01", "STR03", "STR04"],
    "1350": ["B-RB", "STR01", "STR03", "STR05"],
    "1351": ["B-RB", "STR01", "STR03", "STR06"],
    "1352": ["B-RB", "STR01", "STR03", "STR07"],
    "1353": ["B-RB", "STR01", "STR03", "STR08"],
    "1354": ["B-RB", "STR01", "STR03", "STR09"],
    "1355": ["B-RB", "STR01", "STR03", "STR10"],
    "1356": ["B-RB", "STR01", "STR04", "STR05"],
    "1357": ["B-RB", "STR01", "STR04", "STR06"],
    "1358": ["B-RB", "STR01", "STR04", "STR07"],
    "1359": ["B-RB", "STR01", "STR04", "STR08"],
    "1360": ["B-RB", "STR01", "STR04", "STR09"],
    "1361": ["B-RB", "STR01", "STR04", "STR10"],
    "1362": ["B-RB", "STR01", "STR05", "STR06"],
    "1363": ["B-RB", "STR01", "STR05", "STR07"],
    "1364": ["B-RB", "STR01", "STR05", "STR08"],
    "1365": ["B-RB", "STR01", "STR05", "STR09"],
    "1366": ["B-RB", "STR01", "STR05", "STR10"],
    "1367": ["B-RB", "STR01", "STR06", "STR07"],
    "1368": ["B-RB", "STR01", "STR06", "STR08"],
    "1369": ["B-RB", "STR01", "STR06", "STR09"],
    "1370": ["B-RB", "STR01", "STR06", "STR10"],
    "1371": ["B-RB", "STR01", "STR07", "STR08"],
    "1372": ["B-RB", "STR01", "STR07", "STR09"],
    "1373": ["B-RB", "STR01", "STR07", "STR10"],
    "1374": ["B-RB", "STR01", "STR08", "STR09"],
    "1375": ["B-RB", "STR01", "STR08", "STR10"],
    "1376": ["B-RB", "STR01", "STR09", "STR10"],
    "1377": ["B-RB", "STR02", "STR03", "STR04"],
    "1378": ["B-RB", "STR02", "STR03", "STR05"],
    "1379": ["B-RB", "STR02", "STR03", "STR06"],
    "1380": ["B-RB", "STR02", "STR03", "STR07"],
    "1381": ["B-RB", "STR02", "STR03", "STR08"],
    "1382": ["B-RB", "STR02", "STR03", "STR09"],
    "1383": ["B-RB", "STR02", "STR03", "STR10"],
    "1384": ["B-RB", "STR02", "STR04", "STR05"],
    "1385": ["B-RB", "STR02", "STR04", "STR06"],
    "1386": ["B-RB", "STR02", "STR04", "STR07"],
    "1387": ["B-RB", "STR02", "STR04", "STR08"],
    "1388": ["B-RB", "STR02", "STR04", "STR09"],
    "1389": ["B-RB", "STR02", "STR04", "STR10"],
    "1390": ["B-RB", "STR02", "STR05", "STR06"],
    "1391": ["B-RB", "STR02", "STR05", "STR07"],
    "1392": ["B-RB", "STR02", "STR05", "STR08"],
    "1393": ["B-RB", "STR02", "STR05", "STR09"],
    "1394": ["B-RB", "STR02", "STR05", "STR10"],
    "1395": ["B-RB", "STR02", "STR06", "STR07"],
    "1396": ["B-RB", "STR02", "STR06", "STR08"],
    "1397": ["B-RB", "STR02", "STR06", "STR09"],
    "1398": ["B-RB", "STR02", "STR06", "STR10"],
    "1399": ["B-RB", "STR02", "STR07", "STR08"],
    "1400": ["B-RB", "STR02", "STR07", "STR09"],
    "1401": ["B-RB", "STR02", "STR07", "STR10"],
    "1402": ["B-RB", "STR02", "STR08", "STR09"],
    "1403": ["B-RB", "STR02", "STR08", "STR10"],
    "1404": ["B-RB", "STR02", "STR09", "STR10"],
    "1405": ["B-RB", "STR03", "STR04", "STR05"],
    "1406": ["B-RB", "STR03", "STR04", "STR06"],
    "1407": ["B-RB", "STR03", "STR04", "STR07"],
    "1408": ["B-RB", "STR03", "STR04", "STR08"],
    "1409": ["B-RB", "STR03", "STR04", "STR09"],
    "1410": ["B-RB", "STR03", "STR04", "STR10"],
    "1411": ["B-RB", "STR03", "STR05", "STR06"],
    "1412": ["B-RB", "STR03", "STR05", "STR07"],
    "1413": ["B-RB", "STR03", "STR05", "STR08"],
    "1414": ["B-RB", "STR03", "STR05", "STR09"],
    "1415": ["B-RB", "STR03", "STR05", "STR10"],
    "1416": ["B-RB", "STR03", "STR06", "STR07"],
    "1417": ["B-RB", "STR03", "STR06", "STR08"],
    "1418": ["B-RB", "STR03", "STR06", "STR09"],
    "1419": ["B-RB", "STR03", "STR06", "STR10"],
    "1420": ["B-RB", "STR03", "STR07", "STR08"],
    "1421": ["B-RB", "STR03", "STR07", "STR09"],
    "1422": ["B-RB", "STR03", "STR07", "STR10"],
    "1423": ["B-RB", "STR03", "STR08", "STR09"],
    "1424": ["B-RB", "STR03", "STR08", "STR10"],
    "1425": ["B-RB", "STR03", "STR09", "STR10"],
    "1426": ["B-RB", "STR04", "STR05", "STR06"],
    "1427": ["B-RB", "STR04", "STR05", "STR07"],
    "1428": ["B-RB", "STR04", "STR05", "STR08"],
    "1429": ["B-RB", "STR04", "STR05", "STR09"],
    "1430": ["B-RB", "STR04", "STR05", "STR10"],
    "1431": ["B-RB", "STR04", "STR06", "STR07"],
    "1432": ["B-RB", "STR04", "STR06", "STR08"],
    "1433": ["B-RB", "STR04", "STR06", "STR09"],
    "1434": ["B-RB", "STR04", "STR06", "STR10"],
    "1435": ["B-RB", "STR04", "STR07", "STR08"],
    "1436": ["B-RB", "STR04", "STR07", "STR09"],
    "1437": ["B-RB", "STR04", "STR07", "STR10"],
    "1438": ["B-RB", "STR04", "STR08", "STR09"],
    "1439": ["B-RB", "STR04", "STR08", "STR10"],
    "1440": ["B-RB", "STR04", "STR09", "STR10"],
    "1441": ["B-RB", "STR05", "STR06", "STR07"],
    "1442": ["B-RB", "STR05", "STR06", "STR08"],
    "1443": ["B-RB", "STR05", "STR06", "STR09"],
    "1444": ["B-RB", "STR05", "STR06", "STR10"],
    "1445": ["B-RB", "STR05", "STR07", "STR08"],
    "1446": ["B-RB", "STR05", "STR07", "STR09"],
    "1447": ["B-RB", "STR05", "STR07", "STR10"],
    "1448": ["B-RB", "STR05", "STR08", "STR09"],
    "1449": ["B-RB", "STR05", "STR08", "STR10"],
    "1450": ["B-RB", "STR05", "STR09", "STR10"],
    "1451": ["B-RB", "STR06", "STR07", "STR08"],
    "1452": ["B-RB", "STR06", "STR07", "STR09"],
    "1453": ["B-RB", "STR06", "STR07", "STR10"],
    "1454": ["B-RB", "STR06", "STR08", "STR09"],
    "1455": ["B-RB", "STR06", "STR08", "STR10"],
    "1456": ["B-RB", "STR06", "STR09", "STR10"],
    "1457": ["B-RB", "STR07", "STR08", "STR09"],
    "1458": ["B-RB", "STR07", "STR08", "STR10"],
    "1459": ["B-RB", "STR07", "STR09", "STR10"],
    "1460": ["B-RB", "STR08", "STR09", "STR10"],
    "1461": ["B-RW", "STR01", "STR02", "STR03"],
    "1462": ["B-RW", "STR01", "STR02", "STR04"],
    "1463": ["B-RW", "STR01", "STR02", "STR05"],
    "1464": ["B-RW", "STR01", "STR02", "STR06"],
    "1465": ["B-RW", "STR01", "STR02", "STR07"],
    "1466": ["B-RW", "STR01", "STR02", "STR08"],
    "1467": ["B-RW", "STR01", "STR02", "STR09"],
    "1468": ["B-RW", "STR01", "STR02", "STR10"],
    "1469": ["B-RW", "STR01", "STR03", "STR04"],
    "1470": ["B-RW", "STR01", "STR03", "STR05"],
    "1471": ["B-RW", "STR01", "STR03", "STR06"],
    "1472": ["B-RW", "STR01", "STR03", "STR07"],
    "1473": ["B-RW", "STR01", "STR03", "STR08"],
    "1474": ["B-RW", "STR01", "STR03", "STR09"],
    "1475": ["B-RW", "STR01", "STR03", "STR10"],
    "1476": ["B-RW", "STR01", "STR04", "STR05"],
    "1477": ["B-RW", "STR01", "STR04", "STR06"],
    "1478": ["B-RW", "STR01", "STR04", "STR07"],
    "1479": ["B-RW", "STR01", "STR04", "STR08"],
    "1480": ["B-RW", "STR01", "STR04", "STR09"],
    "1481": ["B-RW", "STR01", "STR04", "STR10"],
    "1482": ["B-RW", "STR01", "STR05", "STR06"],
    "1483": ["B-RW", "STR01", "STR05", "STR07"],
    "1484": ["B-RW", "STR01", "STR05", "STR08"],
    "1485": ["B-RW", "STR01", "STR05", "STR09"],
    "1486": ["B-RW", "STR01", "STR05", "STR10"],
    "1487": ["B-RW", "STR01", "STR06", "STR07"],
    "1488": ["B-RW", "STR01", "STR06", "STR08"],
    "1489": ["B-RW", "STR01", "STR06", "STR09"],
    "1490": ["B-RW", "STR01", "STR06", "STR10"],
    "1491": ["B-RW", "STR01", "STR07", "STR08"],
    "1492": ["B-RW", "STR01", "STR07", "STR09"],
    "1493": ["B-RW", "STR01", "STR07", "STR10"],
    "1494": ["B-RW", "STR01", "STR08", "STR09"],
    "1495": ["B-RW", "STR01", "STR08", "STR10"],
    "1496": ["B-RW", "STR01", "STR09", "STR10"],
    "1497": ["B-RW", "STR02", "STR03", "STR04"],
    "1498": ["B-RW", "STR02", "STR03", "STR05"],
    "1499": ["B-RW", "STR02", "STR03", "STR06"],
    "1500": ["B-RW", "STR02", "STR03", "STR07"],
    "1501": ["B-RW", "STR02", "STR03", "STR08"],
    "1502": ["B-RW", "STR02", "STR03", "STR09"],
    "1503": ["B-RW", "STR02", "STR03", "STR10"],
    "1504": ["B-RW", "STR02", "STR04", "STR05"],
    "1505": ["B-RW", "STR02", "STR04", "STR06"],
    "1506": ["B-RW", "STR02", "STR04", "STR07"],
    "1507": ["B-RW", "STR02", "STR04", "STR08"],
    "1508": ["B-RW", "STR02", "STR04", "STR09"],
    "1509": ["B-RW", "STR02", "STR04", "STR10"],
    "1510": ["B-RW", "STR02", "STR05", "STR06"],
    "1511": ["B-RW", "STR02", "STR05", "STR07"],
    "1512": ["B-RW", "STR02", "STR05", "STR08"],
    "1513": ["B-RW", "STR02", "STR05", "STR09"],
    "1514": ["B-RW", "STR02", "STR05", "STR10"],
    "1515": ["B-RW", "STR02", "STR06", "STR07"],
    "1516": ["B-RW", "STR02", "STR06", "STR08"],
    "1517": ["B-RW", "STR02", "STR06", "STR09"],
    "1518": ["B-RW", "STR02", "STR06", "STR10"],
    "1519": ["B-RW", "STR02", "STR07", "STR08"],
    "1520": ["B-RW", "STR02", "STR07", "STR09"],
    "1521": ["B-RW", "STR02", "STR07", "STR10"],
    "1522": ["B-RW", "STR02", "STR08", "STR09"],
    "1523": ["B-RW", "STR02", "STR08", "STR10"],
    "1524": ["B-RW", "STR02", "STR09", "STR10"],
    "1525": ["B-RW", "STR03", "STR04", "STR05"],
    "1526": ["B-RW", "STR03", "STR04", "STR06"],
    "1527": ["B-RW", "STR03", "STR04", "STR07"],
    "1528": ["B-RW", "STR03", "STR04", "STR08"],
    "1529": ["B-RW", "STR03", "STR04", "STR09"],
    "1530": ["B-RW", "STR03", "STR04", "STR10"],
    "1531": ["B-RW", "STR03", "STR05", "STR06"],
    "1532": ["B-RW", "STR03", "STR05", "STR07"],
    "1533": ["B-RW", "STR03", "STR05", "STR08"],
    "1534": ["B-RW", "STR03", "STR05", "STR09"],
    "1535": ["B-RW", "STR03", "STR05", "STR10"],
    "1536": ["B-RW", "STR03", "STR06", "STR07"],
    "1537": ["B-RW", "STR03", "STR06", "STR08"],
    "1538": ["B-RW", "STR03", "STR06", "STR09"],
    "1539": ["B-RW", "STR03", "STR06", "STR10"],
    "1540": ["B-RW", "STR03", "STR07", "STR08"],
    "1541": ["B-RW", "STR03", "STR07", "STR09"],
    "1542": ["B-RW", "STR03", "STR07", "STR10"],
    "1543": ["B-RW", "STR03", "STR08", "STR09"],
    "1544": ["B-RW", "STR03", "STR08", "STR10"],
    "1545": ["B-RW", "STR03", "STR09", "STR10"],
    "1546": ["B-RW", "STR04", "STR05", "STR06"],
    "1547": ["B-RW", "STR04", "STR05", "STR07"],
    "1548": ["B-RW", "STR04", "STR05", "STR08"],
    "1549": ["B-RW", "STR04", "STR05", "STR09"],
    "1550": ["B-RW", "STR04", "STR05", "STR10"],
    "1551": ["B-RW", "STR04", "STR06", "STR07"],
    "1552": ["B-RW", "STR04", "STR06", "STR08"],
    "1553": ["B-RW", "STR04", "STR06", "STR09"],
    "1554": ["B-RW", "STR04", "STR06", "STR10"],
    "1555": ["B-RW", "STR04", "STR07", "STR08"],
    "1556": ["B-RW", "STR04", "STR07", "STR09"],
    "1557": ["B-RW", "STR04", "STR07", "STR10"],
    "1558": ["B-RW", "STR04", "STR08", "STR09"],
    "1559": ["B-RW", "STR04", "STR08", "STR10"],
    "1560": ["B-RW", "STR04", "STR09", "STR10"],
    "1561": ["B-RW", "STR05", "STR06", "STR07"],
    "1562": ["B-RW", "STR05", "STR06", "STR08"],
    "1563": ["B-RW", "STR05", "STR06", "STR09"],
    "1564": ["B-RW", "STR05", "STR06", "STR10"],
    "1565": ["B-RW", "STR05", "STR07", "STR08"],
    "1566": ["B-RW", "STR05", "STR07", "STR09"],
    "1567": ["B-RW", "STR05", "STR07", "STR10"],
    "1568": ["B-RW", "STR05", "STR08", "STR09"],
    "1569": ["B-RW", "STR05", "STR08", "STR10"],
    "1570": ["B-RW", "STR05", "STR09", "STR10"],
    "1571": ["B-RW", "STR06", "STR07", "STR08"],
    "1572": ["B-RW", "STR06", "STR07", "STR09"],
    "1573": ["B-RW", "STR06", "STR07", "STR10"],
    "1574": ["B-RW", "STR06", "STR08", "STR09"],
    "1575": ["B-RW", "STR06", "STR08", "STR10"],
    "1576": ["B-RW", "STR06", "STR09", "STR10"],
    "1577": ["B-RW", "STR07", "STR08", "STR09"],
    "1578": ["B-RW", "STR07", "STR08", "STR10"],
    "1579": ["B-RW", "STR07", "STR09", "STR10"],
    "1580": ["B-RW", "STR08", "STR09", "STR10"]
}
