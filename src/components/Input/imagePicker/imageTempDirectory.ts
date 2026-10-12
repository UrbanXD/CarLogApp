import { Directory, Paths } from "expo-file-system";

export const INPUT_IMAGE_TEMP_DIR = `${ Paths.document.uri }/temp`;

export function cleanupInputImageTempDirectory() {
    const directory = new Directory(INPUT_IMAGE_TEMP_DIR);
    if(directory.exists) directory.delete();
}
