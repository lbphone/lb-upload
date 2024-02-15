fx_version "cerulean"
game "gta5"

author "Loaf Scripts"

server_scripts {
	"@oxmysql/lib/MySQL.lua",
	"config.lua",
	"server/server.lua",
	"server/backend/dist/index.js"
}

dependency "oxmysql"

version "2.0.0"
