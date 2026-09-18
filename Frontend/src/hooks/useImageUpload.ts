import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

// 1. Define the exact shape of the data returning from GraphQL
interface PresignedUrlData {
    getPresignedUploadUrl: {
        uploadUrl: string;
        fileUrl: string;
    };
}

// 2. Define the variables we are sending
interface PresignedUrlVars {
    fileName: string;
    folder?: string;
}

const GET_PRESIGNED_URL = gql`
  mutation GetPresignedUploadUrl($fileName: String!, $folder: String) {
    getPresignedUploadUrl(fileName: $fileName, folder: $folder) {
      uploadUrl
      fileUrl
    }
  }
`;

export const useImageUpload = () => {
    // 3. Pass the types into the mutation hook
    const [getPresignedUrl] = useMutation<PresignedUrlData, PresignedUrlVars>(GET_PRESIGNED_URL);
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (file: File, folder: string = 'workspaces'): Promise<string> => {
        setIsUploading(true);

        try {
            const { data } = await getPresignedUrl({
                variables: { fileName: file.name, folder }
            });

            // 4. TS check: ensure data actually exists before destructuring
            if (!data) {
                throw new Error('Failed to get upload URL from server.');
            }

            // Now TypeScript knows getPresignedUploadUrl exists!
            const { uploadUrl, fileUrl } = data.getPresignedUploadUrl;

            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error('Storage rejected the upload.');
            }

            return fileUrl;

        } catch (error) {
            console.error('Upload process failed:', error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadImage, isUploading };
};