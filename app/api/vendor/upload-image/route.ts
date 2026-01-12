import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using CLOUDINARY_URL
if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL
    });
}

export async function POST(req: NextRequest) {
    try {
        // Validate Cloudinary configuration
        if (!process.env.CLOUDINARY_URL) {
            console.error('CLOUDINARY_URL environment variable is missing');
            return NextResponse.json(
                { message: 'Server configuration error: Cloudinary not configured' }, 
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const file = formData.get('image') as File;
        
        if (!file) {
            return NextResponse.json(
                { message: 'No image is provided' }, 
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { message: 'File must be an image' }, 
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { message: 'Image size must be less than 5MB' }, 
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { 
                    resource_type: 'image', 
                    folder: 'car-rental/vehicles',
                    transformation: [
                        { width: 1200, height: 800, crop: 'limit' },
                        { quality: 'auto:good' }
                    ]
                }, 
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    if (!result) {
                        return reject(new Error('Upload failed - no result'));
                    }
                    resolve(result as { secure_url: string });
                }
            ).end(buffer);
        });

        return NextResponse.json(
            { 
                message: 'Image uploaded successfully!', 
                data: uploadResult.secure_url 
            }, 
            { status: 201 }
        );

    } catch (error) {
        console.error('Upload route error:', error);
        return NextResponse.json(
            { 
                message: 'An error occurred while uploading the image',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, 
            { status: 500 }
        );
    }
}