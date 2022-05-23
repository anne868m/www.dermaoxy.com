var pageLinkManufacturerSearch = '/products/productlist.aspx';

function checkMaxLength(textarea, evt, maxLength) {
    var allowKey = false;
    var keyCode = document.layers ? evt.which : evt.keyCode;
    if (keyCode < 32 && keyCode != 13)
        allowKey = true;
    else
        allowKey = textarea.value.length < maxLength;
    textarea.selected = false;
    return allowKey;
}

function ensureMaxLength(textarea, maxLength, msg) {
    if (textarea.value.length > maxLength) {
        textarea.value = textarea.value.substring(0, maxLength);
    }
    countLeftSpace(textarea, maxLength, msg);
}


function ensureMaxLengthEvent(e, textarea, maxLength, msg) {
    if (e.keyCode < 0x20) {
        countLeftSpace(textarea, maxLength, msg);
        return; // Do nothing
    }
    if (textarea.value.length == maxLength) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
    } else if (textarea.value.length > maxLength) {
        // Maximum exceeded
        textarea.value = textarea.value.substring(0, maxLength);
    }
    countLeftSpace(textarea, maxLength, msg);
}

function countLeftSpace(textarea, maxLength, msg) {
    var el = document.getElementById("limitCharactersInfo");
    if (el) {
        el.innerHTML = msg.replace("{0}", (maxLength - textarea.value.length));
    } else {
        el = document.createElement('span');
        el.setAttribute("id", "limitCharactersInfo");
        el.innerHTML = msg.replace("{0}", (maxLength - textarea.value.length));
        textarea.parentNode.appendChild(el);
    }

}

function writeSWFtag(strSWFFile, intWidth, intHeight) {
    document.write('<object type="application/x-shockwave-flash" data="' + strSWFFile + '" ');
    document.write('width="' + intWidth + '" height="' + intHeight + '">');
    document.write('<param name="movie" value="' + strSWFFile + '"></object>');
}

function clickAnchorOnCR(anchor, e) {
    if (e.keyCode == 13) {
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
        e.cancel = true;
        if (e.stopPropagation)
            e.stopPropagation();
        if (anchor.getAttribute('onclick') == null) {
            if (anchor.getAttribute('href'))
                if (anchor.getAttribute('href').indexOf('javascript:') == 0) {
                    eval(anchor.getAttribute('href'));
                } else
                    document.location = anchor.getAttribute('href');
        } else anchor.onclick();
    }
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        };
    }
}

/*
* Håndtering af query string operationer.
*/

function PageQuery(q) {
    if (q.length > 1) this.q = q.substring(1, q.length);
    else this.q = null;
    this.keyValuePairs = new Array();
    if (q) {
        for (var i = 0; i < this.q.split("&").length; i++) {
            this.keyValuePairs[i] = this.q.split("&")[i];
        }
    }

    this.getKeyValuePairs = function () {
        return this.keyValuePairs;
    };
    this.getValue = function (s) {
        for (var j = 0; j < this.keyValuePairs.length; j++) {
            if (this.keyValuePairs[j].split("=")[0].toLowerCase() == s.toLowerCase())
                return this.keyValuePairs[j].split("=")[1];
        }
        return null;
    };
    this.getKeyValueIndex = function (s) {
        for (var j = 0; j < this.keyValuePairs.length; j++) {
            if (this.keyValuePairs[j].split("=")[0].toLowerCase() == s.toLowerCase())
                return j;
        }
        return -1;
    };
    this.getParameters = function () {
        var a = new Array(this.getLength());
        for (var j = 0; j < this.keyValuePairs.length; j++) {
            a[j] = this.keyValuePairs[j].split("=")[0];
        }
        return a;
    };
    this.getLength = function () {
        return this.keyValuePairs.length;
    };
    this.setValue = function (q, value) {
        if (this.getValue(q) == null) {
            this.keyValuePairs[this.keyValuePairs.length] = q + "=" + value;
        } else {
            this.keyValuePairs[this.getKeyValueIndex(q)] = q + "=" + value;
        }
    };
    this.toString = function () {
        var retval = '';
        for (var j = 0; j < this.keyValuePairs.length; j++) {
            if (j == 0) {
                retval = this.keyValuePairs[j];
            } else {
                retval = retval + '&' + this.keyValuePairs[j];
            }
        }
        return retval;
    };
}

// Create an instance of PageQuery to work on :)
var pageQuery = new PageQuery(location.search);


// Centers a div "divId" on a convas div. Used to render very simple message overlays clientside.

function centerDiv(canvasDivId, divId) {
    myCanvasElement = document.getElementById(canvasDivId);
    myFrameElement = document.getElementById(divId);
    //topPos = ((myCanvasElement.offsetHeight / 2) - (myFrameElement.offsetHeight / 2))
    if ((pageHeight() / 2) > myFrameElement.offsetHeight)
        topPos = posTop() + (pageHeight() / 3) - (myFrameElement.offsetHeight / 2);
    else
        topPos = posTop() + (pageHeight() / 2) - (myFrameElement.offsetHeight / 2);
    if (topPos < 0) topPos = 0;
    leftPos = ((myCanvasElement.offsetWidth / 2) - (myFrameElement.offsetWidth / 2));
    if (leftPos < 0) {
        leftPos = 0;
        myFrameElement.style.width = myCanvasElement.offsetWidth + 'px';
    }

    myFrameElement.style.left = leftPos + 'px';
    myFrameElement.style.top = topPos + 'px';
}

function posTop() {
    return typeof window.pageYOffset != 'undefined' ? window.pageYOffset : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
}

function pageHeight() {
    return window.innerHeight != null ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body != null ? document.body.clientHeight : null;
}

// Handles processing of ScriptAndHtml object returned from JSON call.
// Should be called as part of result processing when returned object inherits (or is) eSeller.JSON.ScriptAndHtml

function handleJSONScriptAndHtmlResult(o) {
    if (o.Scripts != null) {
        jQuery.each(o.Scripts, function () {
            if (this.IsGlobal) {
                jQuery.globalEval(this.ScriptContent);
            } else {
                eval(this.ScriptContent);
            }
        });
    }
    if (o.HtmlFragments != null) {
        jQuery.each(o.HtmlFragments, function () {
            var containerElement = document.getElementById(this.ClientContainerId);
            if (containerElement != null && this.Html != null) containerElement.innerHTML = this.Html;
        });
    }
    if (o.Message != null && o.Message.Content != null && o.Message.Content.length > 1) {
        message_box.show_message(o.Message.Title, o.Message.Content, o.Message.CloseText);
    }
}

//// Creates a simple message box using overlay technique clientside (as part of json result)
//// jQuery should be included in projekt for this to work.
var message_box = function () {
    return {
        show_message: function (title, body, closeTxt) {
            var button = '<a href="#" onclick="message_box.close_message(); return false;">' + closeTxt + '</a>';
            if (jQuery('#message_box').html() == null) {
                jQuery(document.body).append('<div id="message_box_canvas"></div>');
                jQuery(document.body).append('<div id="message_box"></div>');
            }
            if (title != null && title != 'undefined')
                button = '<span>' + title + '</span>' + button;
            jQuery('#message_box').html('<div id="message_boxtop">' + button + '<div style="clear:both;" /></div><div id="message_box_content"></div>');
            var message = '';
            message += body;
            jQuery('#message_box_content').html(message);
            var myCanvasElement = document.getElementById('message_box_canvas');
            var myFrameElement = document.getElementById('message_box');
            myCanvasElement.style.display = 'block';
            myCanvasElement.style.top = '0px';
            myCanvasElement.style.left = '0px';
            myFrameElement.style.display = 'block';
            centerDiv('message_box_canvas', 'message_box');
        },
        close_message: function () {
            var myCanvasElement = document.getElementById('message_box_canvas');
            var myFrameElement = document.getElementById('message_box');
            myCanvasElement.style.display = 'none';
            myFrameElement.style.display = 'none';
        }
    };
} ();

//// Example function that renders a simple message returned by clientside call (using json)
//function showMessageBox(type, cmsId) {
//    jQuery.getJSON('/SOME_URL_HERE.ashx?type=' + type + '&id=' + cmsId,
//    function (o, t, xhr) {
//        if (o.Html.length > 1) {
//            message_box.show_message('', o.Html, o.CloseText);
//        }
//        handleJSONScriptAndHtmlResult(o);
//    });
//}

function atbConstructInitialUrl(productId, productVariantId) {
    var sUrl = '/baction/atb.aspx?';
    if (productVariantId == '0')
        sUrl += 'pid=' + productId;
    else
        sUrl += 'vid=' + productVariantId;

    if (window.locationExtId) {
        sUrl += "&locId=" + window.locationExtId;
    }
    return sUrl;
}

function atbAddDeliveryDataToUrl(sUrl, cas, codeClientId, countryClientId) {
    if (cas != '') {
        var oCas = document.getElementById(cas);
        if (oCas != null) {
            sUrl += '&cas=' + oCas.checked;
        }
    }

    if (codeClientId != '') {
        var oCode = document.getElementById(codeClientId);
        if (oCode != null) {
            sUrl += '&code=' + oCode.value;
        }
    }

    if (countryClientId != '') {
        var oCountry = document.getElementById(countryClientId);
        if (oCountry != null) {
            sUrl += '&country=' + oCountry.value;
        }
    }

    return sUrl;
}

function atbAjaxInvoke(sUrl) {
    if (eSellerShopElements != null && eSellerIsAjaxA2BEnabled == true) {
        sUrl += '&requestType=ajax';
        sUrl += '&eSellerShopElements=' + encodeURIComponent(eSellerShopElements);

        jQuery.getJSON(sUrl,
            function (o, t, xhr) {
                handleJSONScriptAndHtmlResult(o);
            }
        );

    } else {
        document.location.href = sUrl + '&rurl=' + encodeURIComponent(document.location.href);
    }
}

// Add to basket using AJAX

function atbAjax(productId, productVariantId, quantityTextboxClientId, strAdditionalParameters) {
    var sUrl = atbConstructInitialUrl(productId, productVariantId);
    
    if (quantityTextboxClientId == '') {
        sUrl += '&qty=1';
    } else {
        var oqty = document.getElementById(quantityTextboxClientId);
        if (oqty != null)
            sUrl += '&qty=' + oqty.value;
        else
            sUrl += '&qty=1';
    }
   
    sUrl += strAdditionalParameters; // you may want to specify "showMsg"="false" in additional parameter (of BasketButton.AdditionalParameters property)

    atbAjaxInvoke(sUrl);
}

function atbAjaxNoQty(productId, productVariantId, quantity, strAdditionalParameters, codeClientId, countryClientId, cas) {
    var sUrl = atbConstructInitialUrl(productId, productVariantId);

    sUrl += '&qty=' + quantity;
    sUrl = atbAddDeliveryDataToUrl(sUrl, cas, codeClientId, countryClientId);
    sUrl += strAdditionalParameters; // you may want to specify "showMsg"="false" in additional parameter (of BasketButton.AdditionalParameters property)

    atbAjaxInvoke(sUrl);
}

function atbNoQty(pid, vid, qty, ap, code, country, collectAtStore, returnUrlEncoded) {
    var surl = atbConstructInitialUrl(pid, vid);

    surl += '&qty=' + qty + '&rurl=' + returnUrlEncoded;
    surl = atbAddDeliveryDataToUrl(surl, collectAtStore, code, country);
    
    if (ap + '' != '') {
        surl += ap;
    }

    document.location.href = surl;
}

function atb(pid, vid, qty, ap, returnUrlEncoded) {
    var oqty = document.getElementById(qty);
    if (oqty != null) {

        var surl = atbConstructInitialUrl(pid, vid);
        surl += '&qty=' + oqty.value + '&rurl=' + returnUrlEncoded;

        if (ap + '' != '') {
            surl += ap;
        }
        document.location.href = surl;
    }
}

function atbcr(event, btn) {
    if (!event) {
        event = window.event;
    }

    var charr = event.keyCode || event.keyChar;
    if (charr == 13) {
        event.returnValue = false;
        event.cancel = true;
        event.preventDefault();
        document.getElementById(btn).click();
    }
}

function atbP(fa, formClientId) {
    var frm = document.getElementById(formClientId);
    frm.action = fa;
    frm.submit();
}

function clickButton(e, buttonid) {
    var evt = e ? e : window.event;
    var bt = document.getElementById(buttonid);
    if (bt) {
        if (evt.keyCode == 13) {
            bt.click();
            return false;
        }
    }
    return true;
}

function ChangeProductSorting(elem) {

    if (elem && elem.nodeName == "SELECT") {
        var val = elem.options[elem.selectedIndex].value;
        var query = updateQueryStringParameter(document.location.href, elem.getAttribute("data-queryParam"), val);
        document.location.href = query;

        return true;
    }
    return false;
}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)", "i");
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        var hash = '';
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.indexOf('#') !== -1) {
            hash = uri.replace(/.*#/, '#');
            uri = uri.replace(/#.*/, '');
        }
        return uri + separator + key + "=" + value + hash;
    }
}

function getUrlParts(url) {
    if (!url) {
        url = window.location.href;
    }

    // url contains your data.
    var qs = url.indexOf("?");
    if (qs == -1) return [];
    var fr = url.indexOf("#");
    var q = "";
    q = (fr == -1) ? url.substr(qs + 1) : url.substr(qs + 1, fr - qs - 1);
    var parts = q.split("&");
    var vars = {};
    for (var i = 0; i < parts.length; i++) {
        var p = parts[i].split("=");
        if (p[1]) {
            vars[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
        } else {
            vars[decodeURIComponent(p[0])] = "";
        }
    }
    // vars contain all the variables in an array.
    return vars;
}

function getSelectedCheckboxes(parentSelector) {
    var selected = new Array();
    $j(parentSelector + ' input:checked').each(function () {
        selected.push($j(this).val());
    });

    return selected;
}

/*///////////////////////////////////////////////
eSellerBasket
Version: 1.0
Author: AGR
Copyright ScanCommerce 2013
All code is provided as is
//////////////////////////////////////////////*/


/*//////////////////////////////////////////////
Constructor
/////////////////////////////////////////////*/
function eSellerBasket() {
    //Target URL for adding products
    this.basketAddProductsTargetURL = "/baction/atb.aspx";
}

/*//////////////////////////////////////////////
function addProductRedirect
adds a product to the basket with redirect
Either ProductId or VariantId _must_ be set. If variant id is set, it is used to identify product 
Param productId is the eSeller Product id
Param variantId is the eSeller Variant id
Param quantity is the amount of products to add to basket
Param returnUrl is the url to redirect to after product has been added
/////////////////////////////////////////////*/
eSellerBasket.prototype.addProductRedirect = function (productId, variantId, quantity, returnUrl) {
    //Check that parameters are valid
    if ((productId == "" || productId == null) && (variantId == "" || variantId == null)) {
        throw new RangeError("Invalid argument: Productid or variantid must be set");
    }
    if (isNaN(parseFloat(quantity)) && !isFinite(quantity)) {
        throw new RangeError("Invalid argument: quantity must be a valid integer");
    }

    //If returnUrl is empty we use current URL
    if (returnUrl == "" || returnUrl == null) {
        try {
            console.log("Returnurl is empty in eSellerBasket, using current URL");
        } catch (e) {
            //Logger does not exist, - do nothing
        }
        returnUrl = window.location.pathname.toString() + window.location.search.toString() + window.location.hash.toString();
    }

    //Build url
    var targetUrl = this.basketAddProductsTargetURL;
    if (variantId == "" || variantId == null) {
        targetUrl += "?pid=" + productId;
    } else {
        //VariantId is and is used to identify the product instead of product id
        targetUrl += "?vid=" + variantId;
    }
    targetUrl += "&qty=" + quantity;
    targetUrl += "&locId=" + locationExtId;
    targetUrl += "&rurl=" + encodeURI(returnUrl);

    document.location.href = targetUrl;
};


var clicks = new Array();
function OneTimeClick(sender) {
    if (clicks.indexOf(sender.id) >= 0) {
        return false;
    } else {
        clicks.push(sender.id);
        __doPostBack(sender.id, '');
        return true;
    }
}

var urlHashValue = window.location.hash;
$j(document).ready(function () {

    $j(window).bind('hashchange', function () {
        var newHashValue = window.location.hash;
        var elementsToChange = $j('.hashListenerCls');
        for (var i = 0; i < elementsToChange.length; i++) {
            var element = elementsToChange[i];
            var aElement = $j(element).find('a');
            if (onClickValue != undefined){
                if (aElement != undefined) {
                    var url = aElement.attr('href');
                    if (urlHashValue == undefined) {
                        aElement.attr('href', url + newHashValue);
                    }
                    else {
                        aElement.attr('href', url.replace(urlHashValue, newHashValue));
                    }
                }
            }
            var imgElement = $j(element).find('img');
            if (imgElement != undefined) {
                var onClickValue = imgElement.attr('onclick');
                if (onClickValue != undefined)
                    if (urlHashValue == undefined) {
                        imgElement.attr('onclick', onClickValue.replace('.aspx', '.aspx' + newHashValue));
                    }
                    else {
                        imgElement.attr('onclick', onClickValue.replace(urlHashValue, newHashValue));
                    }
            }
        }
        urlHashValue = newHashValue;
    });


    if (urlHashValue === undefined) {
        return;
    }
    var elementsToChange = $j('.hashListenerCls');
    for (var i = 0; i < elementsToChange.length; i++) {
        var element = elementsToChange[i];
        var aElement = $j(element).find('a');
        if (aElement != undefined) {
            var url = aElement.attr('href');
            aElement.attr('href', url + urlHashValue);
        }
        var imgElement = $j(element).find('img');
        if (imgElement != undefined) {
            var onClickValue = imgElement.attr('onclick');
            if (onClickValue != undefined)
                imgElement.attr('onclick', onClickValue.replace('.aspx', '.aspx' + urlHashValue));
        }
    }
});