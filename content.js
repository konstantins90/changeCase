var rClickElm = null;
var cache = {};

if (document.documentElement instanceof HTMLElement) {
	document.addEventListener('contextmenu',
		function(e) {
			rClickElm = e.target;
		}
		, true);
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sendResponse);
		if(!rClickElm) {
			rClickElm = document.activeElement;
		}
		switch (request.type) {
			case "onCaseItCM":
				switch (rClickElm.type) {
					case "text":
					case "textarea":
						var selStart = rClickElm.selectionStart;
						var selEnd = rClickElm.selectionEnd;
						var strValue = replaceText(request.tocase, rClickElm.value.substr(selStart, selEnd-selStart));
						document.execCommand("insertText", false, strValue);
						rClickElm.selectionStart = selStart;
						break;

					default:
						var strValue = window.getSelection().toString();
						if(strValue.length > 0) {
							strValue = replaceText(request.tocase, strValue);
							copyToClipboard(strValue);
						}
						break;
				}
				break;
		}
});

function replaceText(tocase, text) {
	switch (tocase) {
		case "uppercase" :
			var ret = text.toUpperCase();

			return ret;
			break;

		case "lowercase" :
			var ret = text.toLowerCase();

			return ret;
			break;

		case "convert" :
			var ret = convertCase(text);
			return ret;
			break;

		case "slug" :
			var ret = slugify(text);
			return ret;
			break;

		default:
			return text;
			break;
	}
}

function getSelectionParentElement() {
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    return parentEl;
}

function convertCase(text) {
	var converted = '';
	for (i = 0; i < text.length; i++) {
		if(text[i] == text[i].toLowerCase()) {
			converted += text[i].toUpperCase();
		}
		else {
			converted += text[i].toLowerCase();
		}
	}

	return converted;
}

function slugify (text) {
  const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
  const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(p, c =>
        b.charAt(a.indexOf(c)))     // Replace special chars
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
}

function copyToClipboard(text) {
	window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}