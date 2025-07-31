// utils/cropImage.js
// Utility to crop image using canvas for react-easy-crop

export default async function getCroppedImg(imageSrc, pixelCrop) {
    const createImage = (url) => {
        return new Promise((resolve, reject) => {
            const image = new window.Image();
            image.setAttribute("crossOrigin", "anonymous");
            image.onload = () => resolve(image);
            image.onerror = (error) => reject(error);
            image.src = url;
        });
    };

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg");
    });
}
