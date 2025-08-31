const hideContents = () => {
	document.querySelector('.wrapper article div')?.remove();
	let element = document.getElementsByTagName("table");
	if(element?.[0]){
		element[0].style.display = 'none';
	}
};
const fetchPage = (elem) => {
	hideContents();
	document.getElementById("loading").style.display='block';
};
const initializeMenu = () => {
	let menuHtml = '';
	for(const [k, v] of Object.entries(menu)) {
		const target = k.toLowerCase() === 'home' ? 'index' : k.toLowerCase();
		if(typeof v === 'object') {
			menuHtml += `<li><a class='pages' href='/${target}.html' onclick='fetchPage(this);'>${k}</a>`;
			menuHtml += `<ul style="display:none" class='submenu'>`;
			for(const [subMenuItem, { status }] of Object.entries(v)) {
				if(status === 'active'){
					menuHtml += `<li><a class='' href="/${k.toLowerCase()}/${subMenuItem.toLowerCase()}" onclick='fetchPage(this);'>${subMenuItem}</a></li>`;
				} else {
					menuHtml += `<li><a class='' href="javascript:void(0)"><strike>${subMenuItem}</strike></a></li>`;
				}
			}
			menuHtml += `</ul>`;
		} else {
			menuHtml += `<li><a class='pages' href='/${target}' onclick='fetchPage(this);'>${k}</a>`;
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
		// menuItem.addEventListener('click', function(){
		// 	hideContents();
		// 	document.getElementById("loading").style.display='block';
		// });
	});
	// document.querySelectorAll('.submenu')?.forEach( submenu => {
	// 	submenu.querySelectorAll('li a')?.forEach( el => {
	// 		el.addEventListener('click', function(){
	// 			hideContents();
	// 			document.getElementById("loading").style.display='block';
	// 		});
	// 	});
	// });
};
const showSubMenuIfPresent = menuElement => {
	const subMenu = menuElement?.nextElementSibling;
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
};
const setActiveLinks = () => {
	document.querySelectorAll(`a.pages, .submenu a`)?.forEach(el => el?.classList.remove('active'));
	const path = location.href.split(location.host)[1];
	if(path){
		const menuElement = document.querySelector(`a[href='${path}']`);
		menuElement?.classList.add('active');
		const parts = path.split('/').filter(p => p);
		// check if the menu has a submneu, and display it.
		if(parts.length === 1) {
			const menuElement = document.querySelector(`a[href='/${parts[0]}']`);
			showSubMenuIfPresent(menuElement);
		}
		parts.pop();
		if(parts.length >= 1) {
			parts.forEach(part => {
				const menuElement = document.querySelector(`a[href='/${part}.html']`);
				if(menuElement){
					menuElement?.classList.add('active');
					// unhide this element's submenu
					showSubMenuIfPresent(menuElement);
				}
			});
		}
	} else {
		document.querySelector(`a[href="/index"]`)?.classList?.add('active');
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
