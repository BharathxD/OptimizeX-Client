import { Data } from "aws-sdk/clients/firehose";
import s3 from "../../../../aws/s3";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";
import { v4 as uuidv4 } from 'uuid';
import prisma from "@/libs/prismadb";

export async function GET(req: NextRequest) {
    try {
        const searchParams = new URLSearchParams(req.url?.split("?")[1]);
        const extension = searchParams.get("fileType")?.replace("image/", "");
        const fileName = searchParams.get("fileName");
        if (!extension || !fileName) {
            return NextResponse.json({ message: "Invalid params" }, { status: StatusCodes.BAD_REQUEST });
        }
        const key = `optimize/picture_${uuidv4()}.${extension}`;
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: StatusCodes.OK });
        }
        const s3Params = {
            Bucket: process.env.NEXT_AWS_S3_SOURCE_BUCKET_NAME,
            Key: key,
            Expires: 60,
            ContentType: `image/${extension}`,
        };
        const s3UploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
        let updatedKey = key.replace("optimize/", "optimized/");
        updatedKey = `https://${process.env.NEXT_AWS_S3_DESTINATION_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${updatedKey}`;
        const oneDay = 24 * 60 * 60 * 1000;
        const currentDate = new Date();
        const expiresAtDate = new Date(currentDate.getTime() + oneDay);

        const createdImage = await prisma.optimizedImage.create({
            data: {
                userId: currentUser.id,
                fileName: fileName,
                extension: extension,
                expiresAt: expiresAtDate,
                url: updatedKey,
            }
        })

        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                optimizedImages: {
                    push: createdImage.id
                },
            },
        });

        const data: Data = { s3UploadUrl, key: updatedKey };
        const responseBody = JSON.stringify(data);

        return NextResponse.json(responseBody, {
            status: StatusCodes.OK,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        console.error(
            `Failed to generate presigned URL: ${(error as Error).message}`
        );
        return NextResponse.json({ message: "Failed to generate the signed URL" }, {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
}