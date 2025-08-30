const hideContents = () => {
	document.querySelector('.wrapper article div')?.remove();
	let element = document.getElementsByTagName("table");
	if(element?.[0]){
		element[0].style.display = 'none';
	}
};
const isJsonString = function(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};
const setUrl = (pageName) => {
	const newUrl = window.location.pathname.replace(/[^/]+$/, pageName.toLowerCase());
	history.replaceState(null, "", newUrl);
}
const setHTMLTitle = pageName => {
	document.title = pageName + " - rahulspatil.in";
	document.getElementById("heading").innerHTML = pageName;
	setUrl(pageName);
};
function fetchPage(elem){
	const elemParent = elem.parentElement?.parentElement?.parentElement;
	setHTMLTitle(elem.innerText);
	document.getElementById("loading").style.display='block';
	hideContents();
	const menuEl = elemParent?.parentElement;
	if(menuEl){
		menuEl.querySelectorAll('a')?.forEach(el => el?.classList.remove('active'));
		elem.classList.add('active');
		elemParent.querySelector('a.pages')?.classList.add('active');
		elemParent.style.display = 'block';
		if (elemParent?._mouseLeaveHandler) {
			elemParent?.removeEventListener('mouseleave', elemParent._mouseLeaveHandler);
			delete elemParent._mouseLeaveHandler;
		}
	}
	const path = elem.getAttribute('x-href');
	const newDiv = document.createElement('div');
	fetch(path).then(resp => resp.text()).then(data => {
		newDiv.innerHTML = data;
	}).catch(error => console.error('Error loading page:', error)).finally(() => {
		document.getElementById("loading").style.display='none';
	});
	document.querySelector('#heading')?.after(newDiv);
}
const initializeMenu = () => {
	let menuHtml = '';
	for(const [k, v] of Object.entries(menu)) {
		const target = k.toLowerCase() === 'home' ? 'index' : k.toLowerCase();
		if(typeof v === 'object') {
			menuHtml += `<li><a class='pages' href='${target}.html'>${k}</a>`;
			menuHtml += `<ul style="display:none" class='submenu'>`;
			for(const [subMenuItem, { status }] of Object.entries(v)) {
				if(status === 'active'){
					menuHtml += `<li><a class='' href='javascript:void(0)' x-href="${k.toLowerCase()}/${subMenuItem.toLowerCase()}" onclick='fetchPage(this);'>${subMenuItem}</a></li>`;
				} else {
					menuHtml += `<li><a class='' href='javascript:void(0)'><strike>${subMenuItem}</strike></a></li>`;
				}
			}
			menuHtml += `</ul>`;
		} else {
			menuHtml += `<li><a class='pages' href='${target}'>${k}</a>`;
		}
		menuHtml += `</li>`;
	}
	document.querySelector('#menu').innerHTML = menuHtml;
	document.querySelectorAll('.pages').forEach(menuItem => {
		const nextEl = menuItem.nextElementSibling; // Submenu
		if(nextEl){
			const mouseEnterHandler = () => {
				nextEl.style.display = 'block';
			};
			const mouseLeaveHandler = () => {
				nextEl.style.display = 'none';
			};
			menuItem.parentElement.addEventListener('mouseenter', mouseEnterHandler);
			menuItem.parentElement.addEventListener('mouseleave', mouseLeaveHandler);
			menuItem.parentElement._mouseEnterHandler = mouseEnterHandler;
    	menuItem.parentElement._mouseLeaveHandler = mouseLeaveHandler;
		}
		menuItem.addEventListener('click', function(){
			setHTMLTitle(this.innerText);
			hideContents();
			document.getElementById("loading").style.display='block';
		});
	});
};
const setActiveLinks = () => {
	document.querySelectorAll(`a.pages, .submenu a`)?.forEach(el => el?.classList.remove('active'));
	const path = window.location.pathname?.split('patil-rahuls.github.io/')?.pop();
	if(path){
		if(path.includes('/')){
			const parentMenuItem = document.querySelector(`a[href='${path.split('/')[0]}']`);
			if(parentMenuItem){
				parentMenuItem.classList.add('active');
			}
		}
		const menuElement = document.querySelector(`a[href='${path}']`);
		if(menuElement){
			menuElement.classList.add('active');
			const subMenu = menuElement.nextElementSibling;
			if(subMenu?.classList.contains('submenu')){
				subMenu.style.display='block';
				if (menuElement.parentElement?._mouseLeaveHandler) {
					menuElement.parentElement?.removeEventListener('mouseleave', menuElement.parentElement._mouseLeaveHandler);
					delete menuElement.parentElement._mouseLeaveHandler;
				}
				if (menuElement.parentElement?._mouseEnterHandler) {
					menuElement.parentElement?.removeEventListener('mouseenter', menuElement.parentElement._mouseEnterHandler);
					delete menuElement.parentElement._mouseEnterHandler;
				}
			}
		}
	} else {
		document.querySelector(`a[href=index]`)?.classList?.add('active');
	}
};
document.addEventListener("DOMContentLoaded", function() {
	initializeMenu();
	setActiveLinks();
});
function openLink(elem){
	const link = elem.getAttribute('x-href');
	window.open(link, '_blank').focus();
}
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
	if(e.keyCode == 123)
		return false;
	if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0))
		return false;
	if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0))
		return false;
	if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0))
		return false;
	if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0))
		return false;
	if(e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 117))
		return false;
	else
		return true;
};
