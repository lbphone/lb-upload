const express = require('express');
const multer  = require('multer');
const uuid = require('uuid').v4;
const options = require("./options.js");

const app = express();
const port = options.port || 30121;
const uploadPath = options.uploadPath || GetResourcePath(GetCurrentResourceName()) + '/uploads';
const allowedMimes = options.allowedMimes || [ 'audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/webm', 'video/mp4', 'video/webm', 'video/mpeg', 'video/ogg', 'image/jpeg', 'image/png', 'image/webp' ];
const baseUrl = options.url.replace('PORT', port) || `http://localhost:${port}`;
const security = options.security || { requireConnected: false, apiKey: false, requireOrigin: false };

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // The path where the files will be saved
    },
    filename: (req, file, cb) => {
        const ext = '.' + file.mimetype.split('/')[1];
        let filename = uuid() + ext;
        cb(null, filename); // The file name
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: options.fileSizeLimit || 1024 * 1024 * 10 },
    fileFilter: (req, file, cb) => {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = new Error('Invalid file type. Only image, audio, and video files are allowed.');
            error.code = 'INVALID_FILE_TYPE';
            cb(error);
        }
    }
});

app.post('*', (req, res, next) => {
    if (security.apiKey && req.headers.authorization !== security.apiKey) {
        console.log(`${req.ip} tried to upload a file with an invalid API key: ${req.headers.authorization}`);
        return res.status(403).json({
            success: false,
            error: 'Invalid API key'
        });
    }

    if (security.requireOrigin && req.headers.origin !== security.requireOrigin) {
        console.log(`${req.ip} tried to upload a file from an invalid origin: ${req.headers.origin}`);
        return res.status(403).json({
            success: false,
            error: 'Invalid origin'
        });
    }

    if (security.requireConnected) {
        for (let i = 0; i < GetNumPlayerIndices(); i++) {
            const player = GetPlayerFromIndex(i);
            const playerIp = GetPlayerEndpoint(player);

            if (playerIp === req.ip) 
                return next();
        }

        console.log(`${req.ip} tried to upload a file without being connected to the server.`);
        return res.status(403).json({
            success: false,
            error: 'You must be connected to the server in order to upload files.'
        });
    }

    next();
});

app.post('/upload', upload.array('file'), (req, res) => {
    const fileLocations = req.files.map(file => `${baseUrl}/${file.filename}`);

    res.status(200).json(({
        success: true,
        files: fileLocations
    }));
}, (error, req, res, next) => {
    switch (error.code) {
        case 'LIMIT_FILE_SIZE':
            return res.status(413).json({ success: false, error: 'File too large' });
        case 'INVALID_FILE_TYPE':
            return res.status(400).json({ success: false, error: 'Invalid file type' });
        default:
            break;
    }
    
    console.error(error);
    res.status(500).json({
        success: false,
        error: error.message
    });
});

app.use('/', express.static(uploadPath));

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
});
