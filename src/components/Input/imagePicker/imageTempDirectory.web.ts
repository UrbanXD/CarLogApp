// Browser-picked images use blob URLs and do not need a native temporary directory.
export const INPUT_IMAGE_TEMP_DIR = "";

export function cleanupInputImageTempDirectory() {
    // There is no Expo FileSystem document directory on web.
}
