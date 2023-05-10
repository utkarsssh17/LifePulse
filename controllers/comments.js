import Event from "../models/event.js";
import User from "../models/user.js";
import * as helperFn from "./helpers.js";

// Add a comment
const addComment = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({ errorMessage: "The event you are trying to add a comment for does not exist." });
        }
        if (!req.user) {
            return res.status(400).send({ errorMessage: "You must be logged in to add a comment." });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ errorMessage: "The user does not exist." });
        }

        const { commentText } = req.body;
        helperFn.validateComment(commentText);

        const comment = {
            userId: user.id,
            commentText: commentText,
        };

        event.comments.push(comment);
        await event.save();

        const commentId = event.comments[event.comments.length - 1].id;
        user.commentIds.push(commentId);
        await user.save();
        return res.status(200).send({ successMessage: "You have successfully added a comment." });
    } catch (error) {
        return res.status(400).send({ errorMessage: error.message });
    }
};

// Edit comment
const editComment = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({ errorMessage: "The event you are trying to edit comment for does not exist." });
        }
        const commentId = req.params.commentId;
        const comment = event.comments.find(comment => comment.id === commentId);
        if (!comment) {
            return res.status(404).send({ errorMessage: "The comment you are trying to edit does not exist." });
        }

        if (!req.user) {
            return res.status(400).send({ errorMessage: "You must be logged in to add a comment." });
        }

        if (comment.userId.toString() !== req.user.id.toString()) {
            return res.status(400).send({ errorMessage: "You can only edit your own comments." });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ errorMessage: "The user does not exist." });
        }

        helperFn.validateComment(req.body.commentText);

        comment.commentText = req.body.commentText;
        comment.updatedAt = Date.now();
        await event.save();
        return res.status(200).send({ successMessage: "You have successfully edited your comment." });
    } catch (error) {
        return res.status(400).send({ errorMessage: error.message });
    }
};

// Delete comment
const deleteComment = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send({ errorMessage: "The event you are trying to delete comment for does not exist." });
        }
        const commentId = req.params.commentId;
        const comment = event.comments.find(comment => comment.id === commentId);
        if (!comment) {
            return res.status(404).send({ errorMessage: "The comment you are trying to delete does not exist." });
        }

        if (!req.user) {
            return res.status(400).send({ errorMessage: "You must be logged in to add a comment." });
        }

        if (comment.userId.toString() !== req.user.id.toString()) {
            return res.status(400).send({ errorMessage: "You can not delete someone else's comment!" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ errorMessage: "The user does not exist." });
        }

        event.comments = event.comments.filter(comment => comment.id !== commentId);
        await event.save();

        user.commentIds = user.commentIds.filter(commentId => commentId !== commentId);
        await user.save();
        return res.status(200).send({ successMessage: "You have successfully deleted your comment." });
    } catch (error) {
        return res.status(400).send({ errorMessage: error.message });
    }
}

export { addComment, editComment, deleteComment };