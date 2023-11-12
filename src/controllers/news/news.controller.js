const createHttpError = require("http-errors");
const News = require("../../models/news.model");
const { IMAGE_SIZE, PDF_SIZE } = require("../../secret");
const { successResponse } = require("../response/response.controller");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { findWithId } = require("../../utils/findItem.util");

/* 
  create news controller
*/
exports.createNews = async (req, res, next) => {
  try {
    const { title, type, eventDate, desc, priority } = req.validateBody;

    const uploadableData = {
      title,
      type,
    };

    if (priority) {
      uploadableData.priority = priority;
    }
    if (desc) {
      uploadableData.desc = desc;
    }
    if (eventDate) {
      uploadableData.eventDate = eventDate;
    }

    if (req.files) {
      if (req.files["image"] && req.files["image"][0]) {
        if (req.files["image"][0].size > IMAGE_SIZE) {
          throw new Error("Image file size needed less than 3 MB");
        }
        const image = req.files["image"][0].path;

        const imageResult = await cloudinary.uploader.upload(image, {
          folder: "newsImage",
        });

        uploadableData.image = {
          url: imageResult.secure_url,
          public_id: imageResult.public_id,
        };

        fs.unlinkSync(image);
      }

      if (req.files["pdf"] && req.files["pdf"][0]) {
        if (req.files["pdf"][0].size > PDF_SIZE) {
          throw new Error("PDF file size needed less than 50 MB");
        }
        const pdf = req.files["pdf"][0].path;

        const pdfResult = await cloudinary.uploader.upload(pdf, {
          folder: "newsPdf",
        });

        uploadableData.pdf = {
          url: pdfResult.secure_url,
          public_id: pdfResult.public_id,
        };

        fs.unlinkSync(pdf);
      }
    }

    // upload data to database

    const news = await News.create(uploadableData);

    return successResponse(res, {
      payload: news,
    });
  } catch (error) {
    next(error);
  }
};

/* 
  update news information controller
*/
exports.newsUpdateInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.validateBody;

    // Use findOneAndUpdate to find and update the news by ID
    const updateNews = await News.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updateNews) {
      throw createHttpError(404, "News not found");
    }

    return successResponse(res, {
      message: "News updated successfully",
      payload: updateNews,
    });
  } catch (error) {
    next(error);
  }
};

/* 
  update news file
*/
exports.updateFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the existing news file
    const existingNews = await News.findById(id);

    if (!existingNews) {
      throw createHttpError(404, "News not found");
    }

    // check if image is already uploaded
    if (req.fileType === "image" && req.files["image"]) {
      if (req.files["image"][0]) {
        if (req.files["image"][0].size > IMAGE_SIZE) {
          throw new Error("Image file size needed less then 3 MB");
        }

        if (existingNews?.image.public_id) {
          // destroy the existing image
          await cloudinary.uploader.destroy(existingNews.image.public_id);
        }

        const image = req.files["image"][0].path;

        // upload the image to the cloudinary
        const imageResult = await cloudinary.uploader.upload(image, {
          folder: "newsImage",
        });

        existingNews.image = {
          url: imageResult.secure_url,
          public_id: imageResult.public_id,
        };

        fs.unlinkSync(image);
      }
    }

    // check if pdf is  uploaded
    if (req.fileType === "pdf" && req.files["pdf"]) {
      if (req.files["pdf"][0]) {
        if (req.files["pdf"][0].size > PDF_SIZE) {
          throw new Error("Pdf file size needed less then 50 MB");
        }

        if (existingNews?.pdf.public_id) {
          // destroy the existing image
          await cloudinary.uploader.destroy(existingNews.pdf.public_id);
        }

        const pdf = req.files["pdf"][0].path;

        // upload the image to the cloudinary
        const pdfResult = await cloudinary.uploader.upload(pdf, {
          folder: "newsPdf",
        });

        existingNews.pdf = {
          url: pdfResult.secure_url,
          public_id: pdfResult.public_id,
        };

        fs.unlinkSync(pdf);
      }
    }
    // Save the updated news
    const updatedNews = await existingNews.save();

    return successResponse(res, {
      message: "Successfully updated file",
      payload: updatedNews,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* 
  delete news controller
*/
exports.deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      throw createHttpError(404, "News not found");
    }

    // delete image and pdf
    if (news.image.public_id) {
      await cloudinary.uploader.destroy(news.image.public_id);
    }
    if (news.pdf.public_id) {
      await cloudinary.uploader.destroy(news.pdf.public_id);
    }

    await News.findByIdAndDelete(id);

    return successResponse(res, {
      message: "Successfully deleted news",
    });
  } catch (error) {
    next(error);
  }
};

/* Delete files */
exports.deleteFile = async (req, res, next) => {
  try {
    const { id, type } = req.params;

    if (!id && !type) {
      throw createHttpError(404, "Id or type not provided");
    }

    // Fetch the document from  database based on the provided _id
    const document = await News.findById(id);

    if (!document) {
      throw createHttpError(404, "Document not found");
    }

    // Check if the provided type is 'image' or 'pdf'
    if (type !== "image" && type !== "pdf") {
      throw createHttpError(
        404,
        "Invalid type parameter. Use 'image' or 'pdf'."
      );
    }

    if (!document[type]) {
      throw createHttpError(404, "No file there");
    }
    // Delete from Cloudinary
    try {
      const publicId = document[type]?.public_id;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cloudinaryError) {
      throw cloudinaryError;
    }

    if (document[type]) {
      document[type] = null;
    }

    await document.save();

    return successResponse(res, {
      message: "Successfully deleted file",
    });
  } catch (error) {
    next(error);
  }
};

/* 
  get single news cotroller
*/
exports.getSingleNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await findWithId(News, id);

    if (!news) {
      throw createHttpError(404, "News not found");
    }

    return successResponse(res, {
      message: "News found successfully",
      payload: news,
    });
  } catch (error) {
    next(error);
  }
};

/* 
  get all news controller
*/
exports.getAllNews = async (req, res, next) => {
  try {
    const { page, limit, searchQuery, type, priority } = req.validatedQuery;

    let pageInt = parseInt(page) || 1;
    let limitInt = parseInt(limit) || 10;

    const skip = (pageInt - 1) * limitInt;

    const query = {};

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query.$or = [
        { title: { $regex: searchRegex } },
        { type: { $regex: searchRegex } },
      ];
    }

    if (type) {
      query.type = type;
    }
    if (priority) {
      query.priority = priority;
    }

    const news = await News.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalDocuments = await News.countDocuments(query);

    return successResponse(res, {
      message: "Data returned successfully",
      payload: {
        news,
        currentPage: pageInt,
        totalPages: Math.ceil(totalDocuments / limitInt),
        totalNews: totalDocuments,
        hasNext: pageInt < Math.ceil(totalDocuments / limitInt) ? true : false,
      },
    });
  } catch (error) {
    next(error);
  }
};
