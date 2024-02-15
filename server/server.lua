exports("GetConfig", function()
	return Config
end)

if not Config.AutoReplace then
	return
end

Wait(5000) -- Wait so that web_baseUrl can be set in convars

local baseUrl = ("https://%s/%s"):format(GetConvar("web_baseUrl", ""), GetCurrentResourceName())
local previousUrl = LoadResourceFile(GetCurrentResourceName(), "server/previousUrl.txt")

if not previousUrl then
	SaveResourceFile(GetCurrentResourceName(), "server/previousUrl.txt", baseUrl, -1)
	return
end

if previousUrl == baseUrl then
	return
end

local readyPromise = promise.new()

MySQL.ready(function()
	readyPromise:resolve()
end)

Citizen.Await(readyPromise)

local database = MySQL.scalar.await("SELECT DATABASE()")

if not database then
	print("^6[LB Upload] ^1[ERROR]^7: Failed to get database name.")
	return
end

local rows = MySQL.query.await("SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND COLUMN_NAME IN (?)", {
	database, Config.AutoReplace.Columns
})

local queries = {}

for i = 1, #rows do
	local row = rows[i]
	local tableName = row.TABLE_NAME
	local columnName = row.COLUMN_NAME
	local query = ("UPDATE `%s` SET `%s` = REPLACE(`%s`, ?, ?)"):format(tableName, columnName, columnName)

	queries[#queries+1] = { query, { previousUrl, baseUrl } }
end

local success = MySQL.transaction.await(queries, {})

if success then
	print("^6[LB Upload] ^4[INFO]^7: Successfully replaced old links.")
	SaveResourceFile(GetCurrentResourceName(), "server/previousUrl.txt", baseUrl, -1)
else
	print("^6[LB Upload] ^1[ERROR]^7: Failed to replace old links.")
end
