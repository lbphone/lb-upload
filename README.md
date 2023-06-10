# lb-upload
A FiveM script that allows you to upload videos, image and audio files directly to the server. It also allows you to access the files.

## Installation
1. Download the script and rename it from `lb-upload-master` to `lb-upload`.
2. Place it in your resources folder.
3. Add `ensure lb-upload` to your server.cfg
4. Configure the script (see below).

## Configuration
Open the `options.js` file and configure to your liking. Make sure to set a port and change the IP-address to your server's IP-address. Also make sure to change the IP-address in the url.

### Security
The script comes with a few security options to prevent bad actors from uploading files. You can set an API key, require the user to be connected to your FiveM server and require origin. requireOrigin restricts the uploads to a single script, and can for example be set to: `https://cfx-nui-lb-phone`. This will prevent anyone from uploading files from other sources, however, it can be bypassed by bad actors. requireConnected and apiKey is recommended. Make sure to change the api key to something else than the default one.

## Use with [LB Phone](https://store.lbphone.com/)
1. Go to lb-phone/config/config.lua and change the following:
    ```lua
    Config.UploadMethod.Video = "Custom"
    Config.UploadMethod.Image = "Custom"
    Config.UploadMethod.Audio = "Custom"
    ```
2. Go to lb-phone/server/apiKeys.lua and set your API_KEYS.
3. Go to lb-phone/shared/upload.lua and add the following to the top of the file: `local localUploadUrl = "http://127.0.0.1:30121/upload"` (line 6). Make sure to replace `127.0.0.1` with your server ip, and `30121` with your port defined in options.js.
4. Go to lb-phone/shared/upload.lua and change `Custom` (line 70-116) to the following: 
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