/*
 * ***** BEGIN LICENSE BLOCK *****
 * Version: ZPL 1.1
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.1 ("License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.zimbra.com/license
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 * 
 * The Original Code is: Zimbra Collaboration Suite Web Client
 * 
 * The Initial Developer of the Original Code is Zimbra, Inc.
 * Portions created by Zimbra are Copyright (C) 2005 Zimbra, Inc.
 * All Rights Reserved.
 * 
 * Contributor(s):
 * 
 * ***** END LICENSE BLOCK *****
 */

//////////////////////////////////////////////////////////////
//  Amazon Zimlet.  Provides hovers for ISBN numbers.       //
//  @author Kevin Henrikson                                 //
//////////////////////////////////////////////////////////////

function Com_Zimbra_Amzn() {
}

Com_Zimbra_Amzn.prototype.init =
function() {
	// Pre-load placeholder image
	(new Image()).src = this.getResource('blank_pixel.gif');
};

Com_Zimbra_Amzn.prototype = new ZmZimletBase();
Com_Zimbra_Amzn.prototype.constructor = Com_Zimbra_Amzn;

// AMZN Service URL
Com_Zimbra_Amzn.URL = "http://webservices.amazon.com/onca/xml?Service=AWSECommerceService&AWSAccessKeyId=1582H242YD2K3JEANR82&Operation=ItemSearch&SearchIndex=Books&ResponseGroup=Medium&Keywords=";

Com_Zimbra_Amzn.CACHE = new Array();

Com_Zimbra_Amzn.prototype.toolTipPoppedUp =
function(spanElement, obj, context, canvas) {
	canvas.innerHTML = '<img width="110" height="170" id="' + ZmZimletBase.encodeId(obj + "_AIMG") + '" src="'+this.getResource('blank_pixel.gif')+'"/><div style="width:110px;" id="'+ZmZimletBase.encodeId(obj+"_ATXT")+'"> <br/> </div>';
	if (Com_Zimbra_Amzn.CACHE[obj]) {
		Com_Zimbra_Amzn._displayBook(Com_Zimbra_Amzn.CACHE[obj].Image, Com_Zimbra_Amzn.CACHE[obj].Book, obj);
	} else {
		var url = ZmZimletBase.PROXY + AjxStringUtil.urlEncode(Com_Zimbra_Amzn.URL + obj.replace(/[-A-Z ]/ig,''));
		DBG.println(AjxDebug.DBG2, "Com_Zimbra_Amzn url " + url);
		AjxRpc.invoke(null, url, null, new AjxCallback(this, Com_Zimbra_Amzn._callback, obj), true);
	}	
};

// XXX need support for regex's on sub-var's
Com_Zimbra_Amzn.prototype._getHtmlContent = 
function(html, idx, obj, context) {
	var contentObj = this.xmlObj().getVal('contentObject');
	html[idx++] = '<a target="_blank" href="';
	html[idx++] = (contentObj.onClick.actionUrl.target).replace('${objectContent}', AjxStringUtil.htmlEncode(obj.replace(/[-A-Z ]/ig,'')));
	html[idx++] = '">'+AjxStringUtil.htmlEncode(obj)+'</a>';
	return idx;
};

Com_Zimbra_Amzn._displayBook = 
function(imageInfo, bookInfo, obj) {
	var imgEl = document.getElementById(ZmZimletBase.encodeId(obj + "_AIMG"));
	var txtEl = document.getElementById(ZmZimletBase.encodeId(obj + "_ATXT"));
	if(!imageInfo || !bookInfo) {
		txtEl.innerHTML = "<b><center>Error!</center></b>";
		return;
	}
	imgEl.style.width = imageInfo.Width;
	imgEl.style.height = imageInfo.Height;
	imgEl.style.backgroundImage = "url("+imageInfo.URL+")";
	txtEl.style.width = imageInfo.Width;
	txtEl.innerHTML = bookInfo.title +" by "+ bookInfo.author +" "+ bookInfo.price;
    if(!Com_Zimbra_Amzn.CACHE[obj]) {
    	Com_Zimbra_Amzn.CACHE[obj] = new Object();
		Com_Zimbra_Amzn.CACHE[obj].Image = imageInfo;
		Com_Zimbra_Amzn.CACHE[obj].Book = bookInfo;
	}
};

Com_Zimbra_Amzn._callback = 
function(obj, result) {
	var result = AjxXmlDoc.createFromXml(result.text).toJSObject(true, false);
	var bookInfo = new Object();
	if(result.Items.Item.ImageSets && result.Items.Item.ItemAttributes) {
		bookInfo.title = result.Items.Item.ItemAttributes.Title;
		bookInfo.author = result.Items.Item.ItemAttributes.Author;
		bookInfo.price = result.Items.Item.ItemAttributes.ListPrice.FormattedPrice;
		Com_Zimbra_Amzn._displayBook(result.Items.Item.ImageSets.ImageSet.MediumImage, bookInfo, obj);
	} else {
		Com_Zimbra_Amzn._displayBook(null, null, obj);
	}
};
