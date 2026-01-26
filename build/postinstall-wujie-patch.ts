/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import path = require('path');
import fs = require('fs');

export function patchGetShadowRootForWujie() {
	console.log(`Patching getShadowRoot for Wujie support...`);
	const domJsPath = path.join(
		__dirname,
		'../node_modules/monaco-editor-core/esm/vs/base/browser/dom.js'
	);

	if (!fs.existsSync(domJsPath)) {
		console.log(`dom.js not found at ${domJsPath}, skipping patch`);
		return;
	}

	let content = fs.readFileSync(domJsPath, 'utf8');
	const wujieCheck = 'if(window?.__POWERED_BY_WUJIE__) return window.__WUJIE.shadowRoot;';
	const functionStart = 'export function getShadowRoot(domNode) {';

	if (content.includes(wujieCheck)) {
		console.log(`getShadowRoot already patched, skipping`);
		return;
	}

	const patchedContent = content.replace(functionStart, `${functionStart}\n    ${wujieCheck}`);

	if (patchedContent === content) {
		console.log(`Failed to patch getShadowRoot, function not found`);
		return;
	}

	fs.writeFileSync(domJsPath, patchedContent, 'utf8');
	console.log(`Successfully patched getShadowRoot for Wujie support`);
}

patchGetShadowRootForWujie();
