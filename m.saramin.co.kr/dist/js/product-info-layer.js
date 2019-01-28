/**
 * Created by JPJUNG on 2015-09-07.
 */

(function($, window) {

    var contact = window.salesContact;

    var inqueryText = ''
        +'<div class="discount_with_pcproduct" data-title="logo_default">'
        +'<p>PC ��ǰ�� ���� ���� �� ����! �ڼ��� ������ �����ͷ� �����ϼ���</p>'
        +'</div>';


    if (contact.consultant_email != '' || contact.consultant_tel != '') {
        inqueryText = ''
        +'<div class="discount_with_pcproduct" data-title="logo_matching">'
        +'<p>PC ��ǰ�� ���� ���� �� ����! �ڼ��� ������ VIP�Ŵ������� �����ϼ���</p>'
        +'</div>';
    }

    var realtimeText = ''
        +'<div class="discount_with_pcproduct" data-title="realtime_default">'
        +'<p>PC ��ǰ�� ���� ���� �� 50% ����!</p>'
        +'</div>';

    var applyMethod = "��ȭ ��� �� ���� ����";
    var applyMethodRealtime = "PC ��(www.saramin.co.kr)�� �����Ͽ� ���� ��� �� ���� ����"; // �ǽð� ���� ��ǰ�� ���� ��û���

    var article = '<article id="{{element_id}}" class="layer_product_detail">{{infoprd_layer}}</article>';
    var itemTemplete = ''
                //+'<article id="{{element_id}}" class="layer_product_detail">'
            + '    <div class="infoprd_layer">'
            + '        <h1 class="tit_header">��ǰ�ȳ�</h1>'
            + '        <button type="button" class="btn_close_layer">��ǰ�ȳ� �ݱ�</button>'
            + '        <div class="prd_cate">'
            + '            <h2 class="product_name">{{name}}</h2>'
            + '            <p class="price"><span class="point">{{price}}</span>{{unit}}</p>'
            + '        </div>'
            + '        <div class="about_prd">'
            + '            <h3 class="tit_depth2">��ǰ Ư¡</h3>'
            + '            <ul class="about_list">{{about1}}</ul>'
                //+'                <li>����� ����� ù ������ ��� <span class="point">�÷�Ƽ�� M</span> ���� ����</li>'
                //+'                <li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>'
                //+'            </ul>'
            + '            <h3 class="tit_depth2">�߰� ���� ��ġ</h3>'
            + '            <ul class="about_list">{{about2}}</ul>'
                //+'                <li>����� ����/���/���� <span class="point">�����̾� �÷��� M</span>���� ����</li>'
                //+'                <li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 12ȸ M</span> ����</li>'
                //+'                <li>����� ����/���/���� ����Ʈ�� <span class="point">ȿ����Ű��(�÷�) M</span> ����</li>'
                //+'                <li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
                //+'            </ul>'
            + '        </div>'
            + '{{realtime_text}}'
            //    // [Dev]�ΰ� ��ǰ > ������� ��Ī�� ���
            //+ '        <div class="discount_with_pcproduct" data-title="logo_matching" style="display: none;">'
            //+ '          <p>PC ��ǰ�� ���� ���� �� ����! �ڼ��� ������ VIP�Ŵ������� �����ϼ���</p>'
            //+ '        </div>'
            //    // [Dev]�ǽð� ���� ��ǰ�� ���
            //+ '        <div class="discount_with_pcproduct" data-title="realtime_default" style="display: none;">'
            //+ '            <p>PC ��ǰ�� ���� ���� �� 50% ����!</p>'
            //+ '        </div>'
            + '        <div class="bottom_desc">'
            + '            <dl class="apply_method">'
            + '                <dt>��û���</dt>'
            + '                <dd>{{apply_method}}</dd>'
            + '            </dl>'
            + '        <div class="wrap_button">'
            + '            <a href="tel:' + contact.phone.replace('-', '') + '" class="cellphone">' + contact.phone + '></a>'
            + '            <a href="' + contact.link + '" class="email">E-mail����</a>'
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

            unit = data.unit === 'day' ? '��/��' : '��/��';

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

    function readProductDesc() { // ��ǰ �󼼼��� ���̾� ���� �ݱ�

        //if (!document.getElementById("productDesc")) {
        //    return;
        //} // '��ǰ �󼼼���'�� ���ٸ� ���� ����

        var flag = false,
            wrapProduct = $('<section id="productDesc"></section>'),
            //wrapProduct = $("#productDesc"),
            bodyElement = $("body").eq(0),
            dimdElement = $('<div id="imdModal" class="dimd_modal"></div>'),
            btnDetailPopup = $("#content a.go_product_guide"),
            btnDetailPopup2 = $("#productTable a.go_product_guide"),
            //btnCloseLayer = $("#productDesc .btn_close_layer"),
            openedProduct = null;

        bodyElement.append(wrapProduct).append(dimdElement); // body�� �ڽĳ��� �̵�
        dimdElement.hide();

        // '��ǰ�ȳ� �󼼺���'��ư �̺�Ʈ ����

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
                    btnPrev = $('<button type="button" class="btn_product_prev">���� ��ǰ</button>'),
                    btnNext = $('<button type="button" class="btn_product_next">���� ��ǰ</button>');

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
                $("#dimdModal").add($(openedTarget).find(".infoprd_layer").eq(0)).unbind("touchmove"); // ��ũ�� ��� ����
            });

            event.preventDefault();
        });
        // '��ǰ�ȳ� �󼼺���'��ư �̺�Ʈ ��
    }

    var description = {
        productDescPlatinum: [
            {
                name: '�÷�Ƽ�� M',
                price: '2,600,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ù ������ ��� <span class="point">�÷�Ƽ�� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">�����̾� �÷��� M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 12ȸ M</span> ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">ȿ����Ű��(�÷�) M</span> ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescSpecialGold: [
            {
                name: '����� ��� M',
                price: '1,650,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ù ������ ��� <span class="point">����� ��� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� ��޽����� <span class="point">��� �÷�</span>�� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">�����̾� ���� M</span> ���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 12ȸ M</span> ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">ȿ����Ű��(�÷�) M</span> ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescSpecialPlus: [
            {
                name: '����� �÷��� M',
                price: '1,265,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ù ������ ��� <span class="point">����� �÷��� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� ��޽����� <span class="point">��� �÷�</span>�� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">�����̾� ���� M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 6ȸ M</span> ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">ȿ����Ű��(�÷�) M</span> ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescSpecial: [
            {
                name: '����� M',
                price: '990,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ù ������ ��� <span class="point">����� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� ����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">�����̾� M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 6ȸ M</span> ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescEutteumFixed: [
            {
                name: '���� �÷��� M',
                price: '770,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ù ������ ��� <span class="point">���� �÷��� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� ��޽����� <span class="point">��� �÷�</span>�� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">��Ŀ�� �÷��� M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 6ȸ M</span> ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescEutteum: [
            {
                name: '���� M',
                price: '660,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ù ������ ��� <span class="point">���� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">��Ŀ�� �÷��� M</span>���� ���� </li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 6ȸ M</span> ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            },
            {
                name: '�ǽð� ���� M',
                price: '100,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ù ������ ��� <span class="point">���� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">��Ŀ�� M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 3ȸ M</span> ����</li>'
                + '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }

        ],
        productDescAljjaFixed: [
            {
                name: '��¥ �÷��� M',
                price: '495,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ù ������ ��� <span class="point">��¥ �÷��� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� ��޽����� <span class="point">��� �÷�</span>�� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">PLUS M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 6ȸ M</span> ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescAljja: [
            {
                name: '��¥ M',
                price: '385,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ù ������ ��� <span class="point">��¥ M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">PLUS M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 6ȸ M</span> ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            },
            {
                name: '�ǽð� ��¥ M',
                price: '55,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ù ������ ��� <span class="point">��¥ M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">TOP M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 3ȸ M</span> ����</li>'
                + '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescNarae: [
            {
                name: '���� M',
                price: '346,500',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ù ������ �ϴ� <span class="point">���� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">PLUS M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 6ȸ M</span> ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            },
            {
                name: '�ǽð� ���� M',
                price: '50,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ù ������ �ϴ� <span class="point">���� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">PLUS M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 3ȸ M</span> ����</li>'
                + '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescHeadlinePrime: [
            {
                name: '������ ������ M',
                price: '495,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ��ü ä������ ���� ���<br /><span class="point">������ M</span> ���� �켱 ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� ��޽����� <span class="point">��� �÷�</span>�� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">�����̾� M</span>���� ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescHeadline: [
            {
                name: '������ M',
                price: '385,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ��ü ä������ ���� ���<br /><span class="point">������ M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� ��޽����� <span class="point">��� �÷�</span>�� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">�����̾� M</span>���� ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescNuri: [
            {
                name: '���� M',
                price: '275,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ��ü ä������ ���� ���<br /> <span class="point">���� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">��Ŀ�� M</span>���� ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescGaram: [
            {
                name: '���� M',
                price: '247,500',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ��ü ä������ ���� ���<br /> <span class="point">���� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">��Ŀ�� M</span>���� ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescGaon: [
            {
                name: '���� M',
                price: '231,000',
                unit: 'week',
                about1: '<li>����� ����� ��ü ä������ ���� ��� <br /><span class="point">���� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">��Ŀ�� M</span>���� ����</li>'
                + '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescBestRecruit: [
            {
                name: 'BEST ��ä�Ӻ� M',
                price: '1,155,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ��ä�� �� ���<br /> <span class="point">BEST ��ä�Ӻ� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� ��޽����� <span class="point">��� �÷�</span>�� �ָ� ����</li>'
                + '<li class="attention">�� �� ��ǰ�� ����(���� 1000��, ������, ����� ��)�� ���� ��ǰ����, �Ϻ� ����� �ǸŰ� ���ѵ� �� �ֽ��ϴ�.</li>',
                about2: '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescBestSpecialRecruit: [
            {
                name: 'BEST �����Ӻ� M',
                price: '385,000',
                realtime_fl: 0,
                unit: 'week',
                about1: '<li>����� ����� ��üä�� ī�װ� ��� <span class="point">BEST �����Ӻ� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� ��޽����� <span class="point">��� �÷�</span>�� �ָ� ����</li>'
                + '<li class="attention">�� �� ��ǰ�� ���� �о߿� Ưȭ�� ī�װ��� ����Ǵ� ��ǰ���� ���� �´� ī�װ��� ���� ��� �ǸŰ� ���ѵ� �� �ֽ��ϴ�.</li>',
                about2: '<li class="press_horizontally">��� ���� ī�� (����, ���̹� ��) �� Ŀ�´�Ƽ (�˻� ��), ��л�(�Ӵ������̵�) ��� ���� �Խ��� �� ����� �����Ӻ� ���ó���</li>'
            }
        ],
        productDescRealEutteum: [
            {
                name: '�ǽð� ���� M',
                price: '100,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ù ������ ��� <span class="point">���� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">��Ŀ�� M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 3ȸ M</span> ����</li>'
                + '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescRealAljja: [
            {
                name: '�ǽð� ��¥ M',
                price: '55,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ù ������ ��� <span class="point">��¥ M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">TOP M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 3ȸ M</span> ����</li>'
                + '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescRealNarae: [
            {
                name: '�ǽð� ���� M',
                price: '50,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ù ������ �ϴ� <span class="point">���� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>',
                about2: '<li>����� ����/���/���� <span class="point">PLUS M</span>���� ����</li>'
                + '<li>����� ����/���/���� ����Ʈ�� <span class="point">��ũ�� 3ȸ M</span> ����</li>'
                + '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescPremiumFix: [
            {
                name: '�����̾� �÷��� M',
                price: '60,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� ���<br><span class="point">�����̾� M</span> ���� �켱 ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� <span class="point">��� �÷� ����</span></li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 2�� (120,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            },
            {
                name: '�����̾� ���� M',
                price: '35,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� ��� <br><span class="point">�����̾� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� <span class="point">��� �÷�</span>�� �ָ� ����</li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 2�� (70,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            },
            {
                name: '�����̾� M',
                price: '30,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� ��� <br><span class="point">�����̾� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 2�� (60,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescPremiumAlpha: [
            {
                name: '�����̾� ���� M',
                price: '35,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� ��� <br><span class="point">�����̾� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� <span class="point">��� �÷�</span>�� �ָ� ����</li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 2�� (70,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescPremium: [
            {
                name: '�����̾� M',
                price: '30,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� ��� <br><span class="point">�����̾� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 2�� (60,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescFocusFix: [
            {
                name: '��Ŀ�� �÷��� M',
                price: '25,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� ��� <span class="point">��Ŀ�� �÷��� M</span> ���� �켱 ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� <span class="point">��� �÷� ����</span></li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 2�� (50,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            },
            {
                name: '��Ŀ�� M',
                price: '22,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� ��� <span class="point">��Ŀ�� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 2�� (44,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescFocus: [
            {
                name: '��Ŀ�� M',
                price: '22,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� ��� <span class="point">��Ŀ�� M</span> ���� ����</li>'
                + '<li><span class="point">��� �ΰ�</span>�� �����Ǿ� �ָ� ����</li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 2�� (44,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescTop: [
            {
                name: 'TOP M',
                price: '17,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� �ϴ� <span class="point">TOP M</span> ���� ����</li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 3�� (51,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescPlus: [
            {
                name: 'PLUS M',
                price: '11,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� ����� ����/���/���� �ϴ� <span class="point">PLUS M</span> ���� ����</li>'
                + '<li>4�� �̻� ���� �̿� �� ����, ��ũ�� ���� ����</li>'
                + '<li>�ּ� ��û: 3�� (33,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescRankup3: [
            {
                name: '��ũUP 3ȸ M',
                price: '10,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li><span class="point">8�ð�</span>���� ����� �Ϲ� ����Ʈ �ֻ������ �ڵ� ����</li>'
                + '<li>����� �տ�<span class="point">UP</span>������ ǥ��</li>'
                + '<li>�ּ� ��û: 3��(30,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescRankup6: [
            {
                name: '��ũUP 6ȸ M',
                price: '13,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li><span class="point">4�ð�</span>���� ����� �Ϲ� ����Ʈ �ֻ������ �ڵ� ����</li>'
                + '<li>����� �տ�<span class="point">UP</span>������ ǥ��</li>'
                + '<li>�ּ� ��û: 3��(39,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescRankup12: [
            {
                name: '��ũUP 12ȸ M',
                price: '20,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li><span class="point">2�ð�</span>���� ����� �Ϲ� ����Ʈ �ֻ������ �ڵ� ����</li>'
                + '<li>����� �տ�<span class="point">UP</span>������ ǥ��</li>'
                + '<li>�ּ� ��û: 3��(60,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescBold: [
            {
                name: '���� M',
                price: '6,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� �Ϲ� ����Ʈ�� ����� + �������� ���� ���ϰ� ���� ǥ��</li>'
                + '<li>�ּ� ��û: 3��(18,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescColor: [
            {
                name: '�÷� M',
                price: '5,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� �Ϲ� ����Ʈ�� ����� + �������� ������ �÷��� ���� ǥ��</li>'
                + '<li>�ּ� ��û: 3��(15,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescAttention: [
            {
                name: '�ָ� M',
                price: '4,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� �Ϲ� ����Ʈ�� ����� �� ���� ��� ������ ǥ��</li>'
                + '<li>�ּ� ��û: 3��(12,000��)</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescEffectPacHighlighter: [
            {
                name: 'ȿ����Ű��(������) M',
                price: '17,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� �Ϲ� ����Ʈ�� ������ + ���� + ������ + �÷��� ���� ǥ��</li>'
                + '<li>�ּ� ��û: 3��(51,000��)</li>'
                + '<li class="attention">�� TOP M, PLUS M�� �Բ� �̿��Ͻø� ���� ȿ�����Դϴ�.</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescEffectPacColor: [
            {
                name: 'ȿ����Ű��(�÷�) M',
                price: '12,000',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>����� �Ϲ� ����Ʈ�� ������ + ���� + �÷��� ���� ǥ��</li>'
                + '<li>�ּ� ��û: 3��(36,000��)</li>'
                + '<li class="attention">�� TOP M, PLUS M�� �Բ� �̿��Ͻø� ���� ȿ�����Դϴ�.</li>',
                about2: '<li>����� �Ϲ� ����Ʈ�� ���̶���Ʈ ȿ�� ����</li>'
            }
        ],
        productDescSearchKeyword: [
            {
                name: '�˻� Ű���� M',
                price: '1,650',
                realtime_fl: 1,
                unit: 'day',
                about1: '<li>Ű���� �˻� �� ���հ˻� ��� ������ ����</li>'
                + '<li>�ּ� ��û: 2��</li>'
                + '<li>�ּ� 5��, �ִ� 10������ ���� ����<br>(�İ� ����� �ִ� 15�� ���� ����)</li>',
                about2: '<li>����� �˻� �� ���հ˻� ��� ������ ����</li>'
            }
        ],

        x_end: {}
    };

    $(function() {
        readProductDesc();
    });

})(jQuery, window);
/*
     FILE ARCHIVED ON 02:57:54 Jul 22, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 07:24:55 Jan 28, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 65.346 (3)
  esindex: 0.009
  captures_list: 87.603
  CDXLines.iter: 17.126 (3)
  PetaboxLoader3.datanode: 96.777 (4)
  exclusion.robots: 0.196
  exclusion.robots.policy: 0.182
  RedisCDXSource: 1.666
  PetaboxLoader3.resolve: 35.955
  load_resource: 100.62
*/