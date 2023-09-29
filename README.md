# lb-upload
A FiveM script that allows you to upload videos, images, and audio files directly to the server. It also allows you to access the files.

## Installation
1. Download the script and rename it from `lb-upload-master` to `lb-upload`
2. Place it in your resources folder
3. Add `ensure lb-upload` to your server.cfg
4. Make sure you have [Node.js](https://nodejs.org/en/download) installed
5. Open lb-upload in your CMD and run `npm i`
6. Configure the script (see below)

## Configuration
Open the `options.js` file and configure it to your liking. Make sure to set a port and change the IP address to your server's IP address. Also, make sure to change the IP address in the URL.

### Security
The script comes with a few security options to prevent bad actors from uploading files. You can set an API key, require the user to be connected to your FiveM server, and require origin. requireOrigin restricts the uploads to a single script, and can, for example, be set to: `https://cfx-nui-lb-phone`. This will prevent anyone from uploading files from other sources, however, it can be bypassed by bad actors. requireConnected and apiKey is recommended. Make sure to change the API key to something else than the default one.

### Use on servers
When using this on a local server where only you will upload files, you can use the localhost IP (127.0.0.1), but if it is going to be used by other people as well, you have to set up a domain and use HTTPS. Cloudflare is recommended. You will also have to use port 80 if you do this, you can set up nginx to use another port internally.  

## Use with [LB Phone](https://store.lbphone.com/)
1. Go to lb-phone/config/config.lua and change the following:
    ```lua
    Config.UploadMethod.Video = "Custom"
    Config.UploadMethod.Image = "Custom"
    Config.UploadMethod.Audio = "Custom"
    ```
2. Go to lb-phone/server/apiKeys.lua and set your API_KEYS.
3. Go to lb-phone/shared/upload.lua and add the following to the top of the file: `local localUploadUrl = "http://127.0.0.1:30121/upload"` (line 6). Make sure to replace `127.0.0.1` with your server ip, and `30121` with your port defined in options.js.
4. Go to lb-phone/shared/upload.lua and change `Custom` (lines 70-116) to the following: 
    ```lua
    Custom = {
        Video = {
            url = localUploadUrl,
            field = "file",
            headers = {
                ["Authorization"] = "API_KEY"
            },
            error = {
                path = "success",
                value = false
            },
            success = {
                path = "files.0"
            },
        },
        Image = {
            url = localUploadUrl,
            field = "file",
            headers = {
                ["Authorization"] = "API_KEY"
            },
            error = {
                path = "success",
                value = false
            },
            success = {
                path = "files.0"
            },
        },
        Audio = {
            url = localUploadUrl,
            field = "file",
            headers = {
                ["Authorization"] = "API_KEY"
            },
            error = {
                path = "success",
                value = false
            },
            success = {
                path = "files.0"
            },
        },
    },
    ```
