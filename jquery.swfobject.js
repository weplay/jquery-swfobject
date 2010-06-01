/*
  The jQuery SWFObject plugin uses a dual MIT/GPL license.

  MIT License
  Copyright (c) 2009 Jonathan Neal
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  GPL License
  Copyright (C) 2009 Jonathan Neal
  This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
  SWFObject uses a MIT license.

  MIT License
  Copyright (c) 2009 Geoff Stearns, Michael Williams, and Bobby van der Sluis
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function ($, flash) {
	var createAttrs = function (obj) {
		var aEach,
		aArray = [];

		for (aEach in obj) {
			if (/string|number/.test(typeof obj[aEach]) && obj[aEach] !== '') {
				aArray.push(aEach + '="' + obj[aEach] + '"');
			}
		}

		return aArray[j]('');
	},
	createParams = function (obj) {
		var aEach,
		bEach,
		aArray = [],
		bArray;
    debugger;
    
		if (typeof obj == 'object') {
			for (aEach in obj) {
				if (typeof obj[aEach] == 'object') {
					bArray = [];
					for (bEach in obj[aEach]) {
						bArray.push([bEach, '=', encodeURIComponent(obj[aEach][bEach])][j](''));
					}
					obj[aEach] = bArray[j]('&amp;');
				}
				if (obj[aEach]) {
					aArray.push(['<param name="', aEach, '" value="', obj[aEach], '" />'][j](''));
				}
			}
			obj = aArray[j]('');
		}
		return obj;
	},
	expressInstallIsActive = false,
	j = 'join';

	$[flash] = (function () {
		try {
			var flashVersion = '0,0,0',
			Plugin = navigator.plugins['Shockwave Flash'] || ActiveXObject;

			flashVersion = Plugin.description || (function () {
				try {
					return (new Plugin('ShockwaveFlash.ShockwaveFlash')).GetVariable('$version');
				}
				catch (eIE) {}
			}());
		}
		catch(e) {}

		flashVersion = flashVersion.match(/^[A-Za-z\s]*?(\d+)[\.|,](\d+)(?:\s+[d|r]|,)(\d+)/);

		return {
			available: flashVersion[1] > 0,

			activeX: Plugin && !Plugin.name,

			version: {
				major: flashVersion[1] * 1,
				minor: flashVersion[2] * 1, 
				release: flashVersion[3] * 1
			},

			hasVersion: function (version) {
				var versionCompare = this.version,
				major = 'major',
				minor = 'minor',
				release = 'release';

				version = (/string|number/.test(typeof version)) ? version.toString().split('.') : version || [0, 0, 0];

				version = [
					version[major] || version[0] || versionCompare[major],
					version[minor] || version[1] || versionCompare[minor],
					version[release] || version[2] || versionCompare[release]
				];

				return (version[0] < versionCompare[major]) || (version[0] == versionCompare[major] && version[1] < versionCompare[minor]) || (version[0] == versionCompare[major] && version[1] == versionCompare[minor] && version[2] <= versionCompare[release]);
			},

			expressInstall: 'expressInstall.swf',

			create: function (obj) {
				if (!$[flash].available || expressInstallIsActive || !typeof obj == 'object' || !obj.swf) {
					return false;
				}

				if (obj.hasVersion && !$[flash].hasVersion(obj.hasVersion)) {
					obj = {
						swf: obj.expressInstall || $[flash].expressInstall,
						attrs: {
							id: obj.id || 'SWFObjectExprInst',
							name: obj.name,
							height: Math.max(obj.height || 137),
							width: Math.max(obj.width || 214)
						},
						params: {
							flashvars: {
								MMredirectURL: location.href,
								MMplayerType: ($[flash].activeX) ? 'ActiveX': 'PlugIn',
								MMdoctitle: document.title.slice(0, 47) + ' - Flash Player Installation'
							}
						}
					};

					expressInstallIsActive = true;
				}
				else {
					obj = $.extend(
						true,
						{
							attrs: {
								id: obj.id,
								name: obj.name,
								height: obj.height || 180,
								width: obj.width || 320
							},
							params: {
								wmode: obj.wmode || 'opaque',
								flashvars: obj.flashvars
							}
						},
						obj
					);
				}

				if ($[flash].activeX) {
					obj.attrs.classid = obj.attrs.classid || 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
					obj.params.movie = obj.params.movie || obj.swf;
				}
				else {
					obj.attrs.type = obj.attrs.classid || 'application/x-shockwave-flash';
					obj.attrs.data = obj.attrs.data || obj.swf;
				}

				return ['<object ', createAttrs(obj.attrs), '>', createParams(obj.params), '</object>'][j]('');
			}
		};
	}());

	$.fn[flash] = function (args) {
		if (typeof args == 'object') { 
			this.each(
				function () {
					var test = document.createElement(flash);

					var newFlash = $[flash].create(args);
					if (newFlash) {
						test.innerHTML = newFlash;
						if (test.childNodes[0]) {
							this.appendChild(test.childNodes[0]);
						}
					};
				}
			);
		}
		else if (typeof args == 'function') {
			this.find('object').andSelf().filter('object').each(
				function () {
					var elem = this,
					jsInteractionTimeoutMs = 'jsInteractionTimeoutMs';

					elem[jsInteractionTimeoutMs] = elem[jsInteractionTimeoutMs] || 0;

					if (elem[jsInteractionTimeoutMs] < 660) {
						if (elem.clientWidth || elem.clientHeight) {
							args.call(this);
						}
						else {
							setTimeout(
								function () {
									$(elem)[flash](args);
								},
								elem[jsInteractionTimeoutMs] + 66
							);
						}
					}
				}
			);
		}

		return this;
	};
}(jQuery, 'flash'));