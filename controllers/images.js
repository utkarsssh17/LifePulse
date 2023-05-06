import { upload as multerUpload } from "../config/multer.js";
import * as s3 from "../config/s3.js";
import * as helperFn from "./helpers.js";
import User from "../models/user.js";
import path from "path";

// Upload image to S3
const uploadImageToS3 = async (file) => {

    // Randomize file name
    const fileExtension = path.extname(file.originalname);
    const fileName = helperFn.randomizeFileName(fileExtension);
    file.fileName = fileName;

    // Upload image
    const response = await s3.upload(file);
    response.fileName = fileName;

    return response;
};

const uploadProfilePicture = async (req, res, next) => {
    multerUpload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            const result = await uploadImageToS3(req.file);

            const user = await User.findById(req.user._id);
            user.profilePicture = result.fileName;
            await user.save();

            return res.status(200).json({ imageUrl: result.fileName });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
};

// Get signed URL of profile picture
const getSignedProfilePictureUrl = async (fileName) => {
    if (!fileName) {
        return null;
    }
    try {
        const signedUrl = await s3.getPresignedUrl(fileName);
        return signedUrl;
    } catch (error) {
        throw new Error(error.message);
    }
};

export { uploadProfilePicture, getSignedProfilePictureUrl };
