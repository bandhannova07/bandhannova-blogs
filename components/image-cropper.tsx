"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
    aspectRatio?: number;
}

export function ImageCropper({
    image,
    onCropComplete,
    onCancel,
    aspectRatio = 16 / 9 // Default 16:9 for blog thumbnails
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (location: { x: number; y: number }) => {
        setCrop(location);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropAreaComplete = useCallback(
        (croppedArea: any, croppedAreaPixels: any) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const createCroppedImage = async () => {
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onCancel}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Crop Thumbnail Image 📸</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Cropper Area */}
                    <div className="relative h-96 bg-black rounded-lg overflow-hidden">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={onCropAreaComplete}
                        />
                    </div>

                    {/* Zoom Slider */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Zoom</label>
                        <Slider
                            value={[zoom]}
                            onValueChange={(value) => setZoom(value[0])}
                            min={1}
                            max={3}
                            step={0.1}
                            className="w-full"
                        />
                    </div>

                    {/* Info */}
                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <p>📏 Aspect Ratio: {aspectRatio === 16 / 9 ? "16:9 (Recommended for blog thumbnails)" : `${aspectRatio}:1`}</p>
                        <p>✂️ Drag to reposition, use slider to zoom</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={createCroppedImage} disabled={loading}>
                        {loading ? "Cropping..." : "Crop & Use Image ✨"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Helper function to create cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Could not get canvas context");
    }

    // Set canvas size to cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw cropped image
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

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error("Canvas is empty"));
            }
        }, "image/jpeg", 0.95);
    });
}

// Helper to create image element
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });
}
