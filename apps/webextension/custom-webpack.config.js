const { merge } = require("webpack-merge");

module.exports = (config, context) => {
	return merge(config, {
		entry: { "background": "apps/webextension/src/background.ts", "content-script": "apps/webextension/src/content-script.ts" },
		optimization: {
			runtimeChunk: false,
		},
	});
};