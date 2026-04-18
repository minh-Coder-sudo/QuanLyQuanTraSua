import fs from 'fs';
import path from 'path';

export const saveBase64Image = (base64String) => {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);

    if (!matches) return null;

    const ext = matches[1].split('/')[1]; // jpeg/png
    const data = matches[2];

    const fileName = `${Date.now()}.${ext}`;
    const filePath = path.join('uploads', fileName);

    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));

    return `/uploads/${fileName}`;
};

