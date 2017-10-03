var forms = new Array();
var formWidths = new Array();
var formIds = new Array();
var fx = 0;

function in_array(needle, haystack) {
	for (i in haystack) {
		if (needle == haystack[i]) {
			// Found it!
			return true;
		}
	}
	return false;
}

function checkBoxes(e) {
	var target = (e && e.target) || (event && event.srcElement);
	
	// Determine if click occured inside of selectbox.
	var tempTarget = target;
	var parentId=target.parentNode.id;
	while ((tempTarget.parentNode.id == "") || (tempTarget.nodeName == "BODY")) {
		parentId=tempTarget.parentNode.parentNode.id;
		tempTarget = tempTarget.parentNode;
	}
	if ((in_array(parentId, formIds)) && (parentId != "undefined")) {
		return;
	}
	//alert(target.parentNode.id);
	//Hide all boxes
	var form;
	for (h in forms) {
		if (forms[h] != "undefined") {
			node = forms[h];
			if (node.childNodes != "undefined") {
				for (i in node.childNodes) {
					if (node.childNodes[i] != "undefined") {
						if (node.childNodes[i].nodeName == "DIV") {
							if (node.childNodes[i].className == "selectH") {
								node.childNodes[i].className = "select";
							}
						}
					}
				}
			}
		}
	}
}
function selectBox(node) {var ie = 0;
	if (navigator.appName=="Microsoft Internet Explorer") {
		ie=1;
	}

	if (node.className == 'select') {
		node.className = 'selectH';
	}
	else {
		node.className = 'select';
	}
	for (i in node.childNodes) {
		if (node.childNodes[i] != undefined) {
			if (node.childNodes[i].nodeName == "DIV") {
				for (j in node.childNodes[i].childNodes) {
					if (node.childNodes[i].childNodes[j] != undefined) {
						if (node.childNodes[i].childNodes[j].nodeName == "DIV") {
							html=node.childNodes[i].childNodes[j].innerHTML;
							html=html.replace(/(<([^>]+)>)/ig,"");
							if (ie) {
								node.childNodes[i].childNodes[j].innerHTML="<div class=\"ieselectoption\" onclick=\"selectDrop('"+node.id+"', '"+html+"')\">"+node.childNodes[i].childNodes[j].innerHTML+"</div>";
								//node.removeChild(node.childNodes[i]);
							}
							else {
								node.childNodes[i].childNodes[j].setAttribute('onclick', "selectDrop('"+node.id+"', '"+html+"')");
							}
						}
					}
				}
			}
		}
	}
}
function hideThisBox(id) {
	hideBox(document.getElementById(id));
}
function hideBox(node) {
	node.className = "select";
}
function selectDrop(objId, selectName) {
	// Create Form Element if it doesnt exist
	if (document.getElementById(objId+'input') == null) {
		document.getElementById(objId).innerHTML=document.getElementById(objId).innerHTML+"<input type='hidden' id='"+objId+"input' name='"+objId+"' onBlur=\"hideThisBox('"+objId+"');\" value='"+selectName+"'>";
	}
	else {
		document.getElementById(objId+'input').value = selectName;
	}
	var parent = document.getElementById(objId);
	if (selectName!="") {
		for (i in parent.childNodes) {
			if (parent.childNodes[i] != undefined) {
				if (parent.childNodes[i].nodeName == "SPAN") {
					selectName = selectName.replace(/(<([^>]+)>)/ig,"");
					parent.childNodes[i].innerHTML = "<span class='selectButton'></span>"+selectName;
				}
			}
		}
	}
}

function findForms() {
	var node = document.body;
	
	for (i in node.childNodes) {
		if (node.childNodes[i] != undefined) {
			findFormInNode(node.childNodes[i]);
		}
	}
	
}

function findFormInNode(node) {
	if (node.nodeName == "FORM") {
		forms[fx] = node;
		fx++;
	}
	else {
		for (i in node.childNodes) {
			if (node.childNodes[i] != undefined) {
				findFormInNode(node.childNodes[i]);
			}
		}
	}
}

function addSelects() {
	findForms();
	var html = "Select";
	
	for (i in forms) {
		for (j in forms[i].childNodes) {
			if (typeof(forms[i]) != "undefined") {
				if (typeof(forms[i].childNodes[j]) != "undefined") {
					if (forms[i].childNodes[j].nodeName == "DIV") {
						if (forms[i].childNodes[j].className == "select") {
							// Look for selected option
							for (k in forms[i].childNodes[j].childNodes) {
								if (typeof(forms[i].childNodes[j] != "undefined")) {
									if (forms[i].childNodes[j].childNodes[k] != "undefined") {
										if (forms[i].childNodes[j].childNodes[k].nodeName == "DIV") {
											if (forms[i].childNodes[j].childNodes[k].getAttribute('selected') != null) {
												html=forms[i].childNodes[j].childNodes[k].innerHTML;
											}
										}
									}
								}
							}
							formIds[i] = forms[i].childNodes[j].id;
							forms[i].childNodes[j].onclick = function(){selectBox(this);};
							prepSelect(forms[i].childNodes[j], forms[i].childNodes[j].style.width);
							
							html=html.replace(/(<([^>]+)>)/ig,"");
							selectDrop(forms[i].childNodes[j].id, html);
							
						}
					}
				}
			}
		}
	}
}
function prepSelect(node, width) {
	node.innerHTML="<span class='selectTitle' style='width: "+width+";'>Select<span class='selectButton'></span></span><div class='selectBox'>"+node.innerHTML+"</div>";
}

window.onload=addSelects;
document.onclick=checkBoxes;
 $('html').click(function() {
	checkBoxes
 });