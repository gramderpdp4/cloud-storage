export const fileType = (ext) => {

    if (ext) {
        ext = ext.toLowerCase()

        if (ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "webp" || ext == "gif") {
            return { type: 'image', icon: 'imagesmode' }
        } else if (
            ext == 'pdf' || ext == "rar" || ext == "zip" || ext == "txt" ||
            ext == "csv" || ext == "docx" || ext == "js" || ext == "php" ||
            ext == "css") {
            return { type: 'document', icon: 'file_copy' }
        } else if (ext == 'mp4' || ext == 'mkv' || ext == 'mov' || ext == 'avi' || ext == 'wmv' || ext == 'webm') {
            return { type: 'movie', icon: 'movie' }
        } else if (ext == 'mp3' || ext == 'wav' || ext == 'aac' || ext == 'ogg' || ext == "flac" || ext == "waptt") {
            return { type: 'audio', icon: 'mic' }
        } else {
            return { type: 'not', icon: 'do_not_disturb_on' }
        }
    }

    return undefined
}