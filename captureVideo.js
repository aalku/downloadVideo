/* Paste this on dev mode console (and press enter) and then make the video load without reloading the page. Maybe you can mark it as favorite and then go to favorites. */
/* A new window will pop up with several links to try to download the video. Choose wisely. https:&//...etc...m3u8?tag=something looks good for me. */

window.__getUrlsWindow = ()=>{
	if (!window.__UrlsWindow || window.__UrlsWindow.closed) {
		// new
		var w = window.open("about:blank", "Video URLs", "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no");
		w.document.title="Video URLs";
		w.innerHTML="<head></head><body><ul id='list'><ul></body>";
		var urls = new Set();
		w.__appendUrl = (url)=>{
			if (!urls.has(url)) {
				var a = document.createElement("a");
				a.innerText=url;
				a.href=url;
				var li = document.createElement("li");
				li.appendChild(a);
				w.document.body.appendChild(li);
			}
		}
		// OK
		window.__UrlsWindow=w;
	}
	return window.__UrlsWindow;
};

window.__interceptAjax = url=>{
	if (/[.]m3u8?([?].*|$)/.test(url)) {
		console.log('Detected m3u8', url);
		try {
			window.__getUrlsWindow().__appendUrl(url);
		} catch (e) {
			console.error(e);
		}
	}
}

(function(origOpen){
    XMLHttpRequest.prototype.open = function(method, url, async=true, username, password) {
	window.__interceptAjax(url);
    return origOpen.call(this, method, url, async, username, password);
};
})(XMLHttpRequest.prototype.open);
