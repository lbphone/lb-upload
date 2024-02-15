# lb-upload

A FiveM script that allows you to upload media files directly to the server. It also allows you to access the files.

## Installation

1. Download the script and rename it from `lb-upload-master` to `lb-upload`
2. Place it in your resources folder
3. Add `ensure lb-upload` to your server.cfg
4. Configure the script (see below)

It is strongly recommended to change the default api key. You can do that in the config.lua file.

## Use with [lb-phone](https://store.lbphone.com/)

This script was primarily developed to be used with [lb-phone](https://store.lbphone.com/). Follow these steps to set it up with lb-phone:

1. Change all `Config.UploadMethod` to `LBUpload` in the lb-phone config.lua file.
2. Set your api key in `lb-phone/server/apiKeys.lua` to the same key you set in the lb-upload config file.

### NOTE:

This requires lb-phone v1.5.3 or later

## Development

Make sure you have node.js and pnpm installed

1. Clone the repository
2. cd into lb-upload-v2/server/backend
3. Run `pnpm install`
4. Open `node_modules/@koa/multer/index.js` and change

```js
let originalMulter = require("fix-esm").require("multer")
```

to

```js
let originalMulter = require("multer")
```

5. Run `pnpm watch` to start the server. Make sure to restart the script in FiveM after making changes.
