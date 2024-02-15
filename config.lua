Config = {}

Config.AutoReplace = {}
Config.AutoReplace.Enabled = true -- Automatically replace uploaded images in the database when the url is changed? (e.g. when changing server license key, resource name etc.)
Config.AutoReplace.Columns = {
	"url",
	"src",
	"link",
	"file_url",

	"thumbnail",
	"avatar",
	"cover",
	"profile_image",
	"profile_header",

	"image",
	"media",
	"attachment",

	"attachments",
	"photos",
}

Config.UploadPath = "RESOURCE_PATH/uploads" -- The path where images are uploaded. RESOURCE_PATH will automatically get replaced with the direct path to the resource. You should not change this.
Config.DiscordWebhook = false -- You can set this to your discord webhook in order to see all uploaded images directly on discord.

Config.Security = {}
Config.Security.RequireConnected = false -- Should only players who are connected to your server be able to upload media?
Config.Security.ApiKey = "CHANGEME" -- set to false to disable
Config.Security.RequireOrigin = false
-- Config.Security.RequireOrigin = {
-- 	"https://cfx-nui-lb-phone",
-- 	"https://cfx-nui-lb-tablet",
-- }

Config.Limits = {}
Config.Limits.FileSize = 50 -- in MB
Config.Limits.Mimes = { -- set to false to allow uploading any file types
	"audio/mpeg",
	"audio/ogg",
	"audio/opus",
	"audio/webm",

	"video/mp4",
	"video/webm",
	"video/mpeg",
	"video/ogg",

	"image/jpeg",
	"image/png",
	"image/webp"
}
