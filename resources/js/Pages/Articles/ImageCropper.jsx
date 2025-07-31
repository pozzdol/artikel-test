import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";

const ImageCropper = ({ image, onCropPreview }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Update preview setiap crop berubah
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    useEffect(() => {
        const doPreview = async () => {
            if (image && croppedAreaPixels && onCropPreview) {
                const blob = await getCroppedImg(image, croppedAreaPixels);
                onCropPreview(blob);
            }
        };
        doPreview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [croppedAreaPixels, image]);

    return (
        <div className="max-w-96 w-[80vw] h-[60vh] relative bg-black rounded-xl overflow-hidden flex items-center justify-center">
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
            />
        </div>
    );
};

export default ImageCropper;
