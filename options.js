const PATH = GetResourcePath(GetCurrentResourceName()); // Get the path to the current resource
const MB = 1024 * 1024;

module.exports = {
    security: {
        requireConnected: true, // require ip address (player) to be connected to server in order to upload? If testing on own machine, connect to your server via 'connect localhost'
        apiKey: 'UNIQUE_KEY', // API key for uploading files. Set to false to disable.
        requireOrigin: false, // Require the request to come from a specific origin. Set to false to disable.
    },
    
    url: 'http://127.0.0.1:PORT', // The url where the files can be accessed from. Replace 127.0.0.1 with your server ip. PORT will automatically be replaced with the port below.
    port: 30121, // The port that the server will run on. Remember to port forward.
    host: '0.0.0.0', // 0.0.0.0 allows connections from any IP address
    uploadPath: PATH + '/uploads', // The path where the files will be saved

    fileSizeLimit: MB * 50, // The maximum file size in bytes. Default: 50 MB
    allowedMimes: [ // Allowed file types. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        // Audio
        'audio/mpeg',
        'audio/ogg',
        'audio/opus',
        'audio/webm',

        // Video
        'video/mp4',
        'video/webm',
        'video/mpeg',
        'video/ogg',

        // Images
        'image/jpeg',
        'image/png',
        'image/webp'
    ]
}