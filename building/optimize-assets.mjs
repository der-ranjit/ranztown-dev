import { writeFileSync } from 'fs';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

async function optimizeAssets() {
    const files = await imagemin(['src/assets/**/*.{jpg,png}'], {
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.9, 1.0]
            })
        ]
    });
    for(let file of files) {
        writeFileSync(file.sourcePath, file.data);
    }
}

optimizeAssets();
