const createHttpError = require("http-errors");
const Administrator = require("../../models/administrator.model");
const { successResponse } = require("../response/response.controller");
const { findWithId } = require("../../utils/findItem.util");
const DataUri = require("datauri/parser");
const path = require("path");
const dataUri = require("../../helper/imageToDataUri.helper");
const cloudinary = require("cloudinary").v2;
/* 
    get all administrators based on the query parameters
*/
exports.getAllAdministrators = async (req, res, next) => {
  try {
    const { page, limit, searchQuery, role, position, gender } =
      req.validatedQuery;

    let pageInt = parseInt(page) || 1;
    let limitInt = parseInt(limit) || 10;

    const skip = (pageInt - 1) * limitInt;

    const query = {};

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query.$or = [
        { name: { $regex: searchRegex } },
        { institution: { $regex: searchRegex } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (position) {
      query.position = position;
    }

    if (gender) {
      query.gender = gender;
    }

    const administrators = await Administrator.find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalDocuments = await Administrator.countDocuments(query);

    return successResponse(res, {
      message: "Data returned successfully",
      payload: {
        administrators,
        currentPage: pageInt,
        totalPages: Math.ceil(totalDocuments / limitInt),
        totalAdministrators: totalDocuments,
        hasNext: pageInt < Math.ceil(totalDocuments / limitInt) ? true : false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* 
  get single administrator details
*/
exports.getSingleAdministrator = async (req, res, next) => {
  try {
    const administratorId = req.params.id;

    const administrator = await findWithId(Administrator, administratorId);

    if (!administrator) {
      throw createHttpError(404, "Administrator not found");
    }

    return successResponse(res, {
      message: "Administrator found successfully",
      payload: administrator,
    });
  } catch (error) {
    next(error);
  }
};

/* 
  delete single administrator by id
*/
exports.deleteSingleAdministrator = async (req, res, next) => {
  try {
    const administratorId = req.params.id;

    const administrator = await findWithId(Administrator, administratorId);

    if (!administrator) {
      throw createHttpError(404, "Administrator not found");
    }

    if (administrator?.image.public_id) {
      // destroy the existing image
      await cloudinary.uploader.destroy(administrator.image.public_id);
    }
    await Administrator.findByIdAndRemove(administratorId);

    return successResponse(res, {
      message: "Administrator deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* 
  createAdministrator
*/
exports.createAdministrator = async (req, res, next) => {
  try {
    const { name, institution, role, position, image, phone, gender, desc } =
      req.validateBody;

    const administratorData = {
      name,
      institution,
      role,
      position,
    };

    // Include optional fields if they are provided

    if (phone) administratorData.phone = phone;
    if (gender) administratorData.gender = gender;
    if (desc) administratorData.desc = desc;

    if (req.file) {
      const image = dataUri(req.file).content;

      // Upload the image directly to Cloudinary
      const imageUploadResult = await cloudinary.uploader.upload(image, {
        folder: "administrators",
      });
      administratorData.image = {
        url: imageUploadResult.secure_url,
        public_id: imageUploadResult.public_id,
      };
    }

    const administator = await Administrator.create(administratorData);

    return successResponse(res, {
      message: "Successfully creation of administration",
      payload: administator,
    });
  } catch (error) {
    next(error);
  }
};

/* 
  update administration information data
*/
exports.updateAdministratorInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.validateBody;

    // Use findOneAndUpdate to find and update the administrator by ID
    const updatedAdministrator = await Administrator.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedAdministrator) {
      throw createHttpError(404, "Administrator not found");
    }

    return successResponse(res, {
      message: "Information updated successfully",
      payload: updatedAdministrator,
    });
  } catch (error) {
    next(error);
  }
};

/* 
  update the administrator image
*/
exports.updateAdministratorImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the existing administrator by ID
    const existingAdministrator = await Administrator.findById(id);

    if (!existingAdministrator) {
      throw createHttpError(404, "Administrator not found");
    }

    // if image req have
    if (req.file) {
      if (existingAdministrator.image.public_id) {
        // destroy the existing image
        await cloudinary.uploader.destroy(
          existingAdministrator.image.public_id
        );
      }

      const image = dataUri(req.file).content;

      // Upload the image directly to Cloudinary
      const imageUploadResult = await cloudinary.uploader.upload(image, {
        folder: "administrators",
      });

      existingAdministrator.image.public_id = imageUploadResult.public_id;
      existingAdministrator.image.url = imageUploadResult.secure_url;
    }

    // Save the updated administrator
    const updatedAdministrator = await existingAdministrator.save();

    return successResponse(res, {
      message: "Successfully updated image",
      payload: updatedAdministrator,
    });
  } catch (error) {
    next(error);
  }
};
