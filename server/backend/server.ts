import { setHttpCallback } from '@citizenfx/http-wrapper'
import { writeFile } from 'fs/promises'
import { v4 as uuid } from 'uuid'
import mime from 'mime'
import fetch, { Headers } from 'node-fetch'
import Koa from 'koa'
import Router from '@koa/router'
import multer from '@koa/multer'
import send from 'koa-send'

const app = new Koa()
const router = new Router()
const upload = multer()

const MB = 1024 * 1024

type Config = {
    UploadPath: string
    DiscordWebhook: string | false
    Security: {
        RequireConnected: boolean
        ApiKey: string | false
        RequireOrigin: string[] | false
    }
    Limits: {
        FileSize: number | false
        Mimes: string[] | false
    }
}

let config = {
    UploadPath: 'RESOURCE_PATH/uploads',
    DiscordWebhook: false,
    Security: {
        RequireConnected: false,
        ApiKey: false,
        RequireOrigin: false
    },
    Limits: {
        FileSize: 50,
        Mimes: [
            'audio/mpeg',
            'audio/ogg',
            'audio/opus',
            'audio/webm',

            'video/mp4',
            'video/webm',
            'video/mpeg',
            'video/ogg',

            'image/jpeg',
            'image/png',
            'image/webp'
        ]
    }
} as Config

setTimeout(() => {
    try {
        config = exports[GetCurrentResourceName()].GetConfig() as Config
    } catch {
        console.log('Failed to load config, using default')
    }
}, 500)

const resourceName = GetCurrentResourceName()
const resourcePath = GetResourcePath(resourceName)
const uploadPath = config.UploadPath.replace('RESOURCE_PATH', resourcePath)
const baseUrl = `https://${GetConvar('web_baseUrl', '')}/${resourceName}`

function isIpConnected(ip: string) {
    for (let i = 0; i < GetNumPlayerIndices(); i++) {
        const source = GetPlayerFromIndex(i)
        const ip = GetPlayerEndpoint(source)

        if (ip === ip) {
            return true
        }
    }

    return false
}

router.post('', upload.single('file'), (ctx) => {
    const { Security, Limits } = config
    const { ApiKey: apiKey, RequireOrigin: requireOrigin, RequireConnected: requireConnected } = Security
    const { Mimes: mimes, FileSize: fileSize } = Limits
    const { mimetype, buffer } = ctx.file

    if (mimes && !mimes.includes(mimetype)) {
        ctx.status = 415
        ctx.body = 'Unallowed mime type'
        return
    }

    if (fileSize && ctx.file.size > fileSize * MB) {
        ctx.status = 413
        ctx.body = 'File is too large'
        return
    }

    const extension = mime.getExtension(mimetype)

    if (!extension || !buffer) {
        ctx.status = 400
        ctx.body = 'Invalid file type'
        return
    }

    if (apiKey && apiKey !== ctx.headers.authorization) {
        ctx.status = 401
        ctx.body = 'Invalid API key'
        return
    }

    if (requireOrigin && !requireOrigin.includes(ctx.headers.origin)) {
        ctx.status = 403
        ctx.body = 'Invalid origin'
        return
    }

    if (requireConnected && ctx.ip !== '127.0.0.1' && !isIpConnected(ctx.ip)) {
        ctx.status = 403
        ctx.body = 'Not connected to FiveM server'
        return
    }

    const filename = `${uuid()}.${extension}`
    const link = `${baseUrl}/uploads/${filename}`

    writeFile(`${uploadPath}/${filename}`, buffer)

    if (config.DiscordWebhook) {
        let metadata = ''

        if (typeof ctx.headers['player-metadata'] == 'string') {
            const { identifier, name } = JSON.parse(ctx.headers['player-metadata'])

            if (identifier && name) {
                metadata = `\nUploaded by: \`${name}\` (${identifier})`
            }
        }

        fetch(config.DiscordWebhook, {
            headers: new Headers({
                ['Content-Type']: 'application/json'
            }),
            method: 'POST',
            body: JSON.stringify({
                username: 'LB Upload',
                avatar_url: 'https://docs.lbphone.com/img/favicon.png',
                content: `Image URL: ${link}${metadata}`
            })
        })
    }

    ctx.status = 200
    ctx.body = { filename, link }
})

router.get('/uploads/:file', async (ctx) => {
    const { file } = ctx.params

    await send(ctx, 'uploads/' + file, {
        root: resourcePath,
        immutable: true,
        maxage: 24 * 60 * 60 * 1000
    })
})

app.use(router.routes())
app.use(router.allowedMethods())

setHttpCallback(app.callback())
