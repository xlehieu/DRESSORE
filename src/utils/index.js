import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { imageDB } from '../config/firebase/index.js';
export const arrToObj = (arr) => {
    return arr.map((item) => item.toObject());
};
export const toObj = (data) => {
    return data ? data.toObject() : data;
};
export const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const uploadAndGetLink = async (req, folderName) => {
    try {
        if (!folderName) {
            return undefined;
        }
        if (!req?.file?.originalname) return undefined;
        const storageRef = ref(imageDB, `${folderName}/${req.file.originalname}`);
        const metadata = {
            contentType: req.file.mimetype,
        };
        const data = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const url = await getDownloadURL(data.ref);
        return url;
    } catch (err) {
        return undefined;
    }
};
