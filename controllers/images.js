import { upload as multerUpload } from "../config/multer.js";
import * as s3 from "../config/s3.js";
import * as helperFn from "./helpers.js";
import User from "../models/user.js";
import Event from "../models/event.js";
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

// Upload profile picture
const uploadProfilePicture = async (req, res, next) => {
    multerUpload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Please upload a picture." });
            }
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

// Get signed URL of a photo
const getSignedUrl = async (fileName) => {
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

// Upload event photos
const uploadEventPhotos = async (req, res, next) => {
    multerUpload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            if (!req.files['images']) {
                return res.status(400).json({ message: "Please upload atleast one photo." });
            }
            const photos = []
            for (const file of req.files['images']) {
                const result = await uploadImageToS3(file);
                photos.push(result.fileName);
            }
            const event = await Event.findById(req.params.eventId);
            event.photos = photos;
            event.displayPicture = photos[0];
            await event.save();
            return res.status(200).json({ imageUrls: photos });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
};

export { uploadProfilePicture, getSignedUrl, uploadEventPhotos };
