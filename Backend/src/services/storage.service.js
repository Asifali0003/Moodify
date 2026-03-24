const ImageKit = require("@imagekit/nodejs");
const {Readable} = require("stream");

const client = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY, 
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


async function uploadFile({buffer,filename,folder = ""}){

    const stream = Readable.from(buffer);
    const file = await client.files.upload({
        file:stream,
        fileName:filename,
        folder
    });

    return file
}

module.exports = {
    uploadFile
}
