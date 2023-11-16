const createHttpError = require("http-errors");
const Layout = require("../../models/layout.model");
const { successResponse } = require("../response/response.controller");
const dataUri = require("../../helper/imageToDataUri.helper");
const cloudinary = require("cloudinary").v2;

exports.createLayout = async (req, res, next) => {
  try {
    const { type } = req.body;

    const isTypeExist = await Layout.findOne({ type });

    if (isTypeExist) {
      throw new Error(
        `${type} already exists. Cannot create a new ony.You can edit it.`
      );
    }

    // For creating a new  at once only
    if (type === "about_institution") {
      const { desc } = req.body;

      const about_institution = {
        desc,
      };

      await Layout.create({ type, about_institution });
    } else if (type === "institution_objective") {
      const { desc } = req.body;
      const institution_objective = {
        desc,
      };

      await Layout.create({ type, institution_objective });
    } else if (type === "principal_message") {
      const { desc } = req.body;
      const principal_message = {
        desc,
      };
      await Layout.create({ type, principal_message });
    } else if (type === "president_message") {
      const { desc } = req.body;
      const president_message = {
        desc,
      };
      await Layout.create({ type, president_message });
    } else if (type === "institution_info") {
      const {
        phone,
        email,
        village,
        district,
        postOffice,
        EIIN,
        established,
        institutionCode,
        website,
        institution_name,
        upazila,
        location_name,
        map_link,
      } = req.body;

      // store available information into object
      const institution_info = {};
      if (phone) {
        institution_info.phone = phone;
      }
      if (location_name) {
        institution_info.location_name = location_name;
      }
      if (map_link) {
        institution_info.map_link = map_link;
      }
      if (institution_name) {
        institution_info.institution_name = institution_name;
      }
      if (email) {
        institution_info.email = email;
      }
      if (village) {
        institution_info.village = village;
      }
      if (district) {
        institution_info.district = district;
      }
      if (postOffice) {
        institution_info.postOffice = postOffice;
      }
      if (EIIN) {
        institution_info.EIIN = EIIN;
      }
      if (established) {
        institution_info.established = established;
      }
      if (institutionCode) {
        institution_info.institutionCode = institutionCode;
      }
      if (website) {
        institution_info.website = website;
      }
      if (upazila) {
        institution_info.upazila = upazila;
      }

      if (req.file) {
        const image = dataUri(req.file).content;

        // Upload the image directly to Cloudinary
        const imageUploadResult = await cloudinary.uploader.upload(image, {
          folder: "layout",
        });
        institution_info.logo = {
          url: imageUploadResult.secure_url,
          public_id: imageUploadResult.public_id,
        };
      }
      await Layout.create({ type, institution_info });
    } else if (type === "boys_and_girls_scout_guide") {
      const { desc } = req.body;

      const boys_and_girls_scout_guide = { desc };
      await Layout.create({ type, boys_and_girls_scout_guide });
    } else if (type === "debates_compitition") {
      const { desc } = req.body;
      const debates_compitition = { desc };

      await Layout.create({ type, debates_compitition });
    } else if (type === "sports") {
      const { desc } = req.body;
      const sports = { desc };
      await Layout.create({ type, sports });
    } else {
      throw createHttpError(404, "Can not create layout with this type");
    }
    return successResponse(res, {
      message: "SuccessFully created",
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleLayout = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw createHttpError(404, "Id not found");
    }

    const data = await Layout.findById(id);

    if (!data) {
      throw createHttpError(404, "Layout not found");
    }

    return successResponse(res, {
      payload: data,
    });
  } catch (error) {
    next(error);
  }
};

/* 
    edit layout
*/
exports.editLayoutHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { type } = req.body;

    /* 
    update all type of layout
    */
    if (type === "sports") {
      const { desc } = req.body;

      const sportsData = await Layout.findOne({ _id: id, type });

      if (!sportsData) {
        throw createHttpError(
          404,
          "Not layout found with the given id or type"
        );
      }

      const sports = { desc };
      sportsData.sports = sports;
      await sportsData.save();
    } else if (type === "debates_compitition") {
      const { desc } = req.body;

      const debatesData = await Layout.findOne({ _id: id, type });

      if (!debatesData) {
        throw createHttpError(
          404,
          "Not layout found with the given id or type"
        );
      }

      const debates_compitition = { desc };

      debatesData.debates_compitition = debates_compitition;
      await debatesData.save();
    } else if (type === "boys_and_girls_scout_guide") {
      const { desc } = req.body;

      const scoutData = await Layout.findOne({ _id: id, type });

      if (!scoutData) {
        throw createHttpError(
          404,
          "Not layout found with the given id or type"
        );
      }

      const boys_and_girls_scout_guide = { desc };

      scoutData.boys_and_girls_scout_guide = boys_and_girls_scout_guide;
      await scoutData.save();
    } else if (type === "institution_info") {
      const {
        institution_name,
        phone,
        email,
        village,
        district,
        postOffice,
        EIIN,
        established,
        institutionCode,
        website,
        upazila,
        map_link,
        location_name,
      } = req.body;

      /* find the existing  */
      const institutionData = await Layout.findOne({ _id: id, type });

      if (!institutionData) {
        throw createHttpError(
          404,
          "Not layout found with the given id or type"
        );
      }

      //store the available data into object
      const institution_info = {};
      if (phone) {
        institution_info.phone = phone;
      }
      if (location_name) {
        institution_info.location_name = location_name;
      }
      if (map_link) {
        institution_info.map_link = map_link;
      }
      if (institution_name) {
        institution_info.institution_name = institution_name;
      }
      if (email) {
        institution_info.email = email;
      }
      if (village) {
        institution_info.village = village;
      }
      if (district) {
        institution_info.district = district;
      }
      if (postOffice) {
        institution_info.postOffice = postOffice;
      }
      if (EIIN) {
        institution_info.EIIN = EIIN;
      }
      if (established) {
        institution_info.established = established;
      }
      if (institutionCode) {
        institution_info.institutionCode = institutionCode;
      }
      if (website) {
        institution_info.website = website;
      }
      if (upazila) {
        institution_info.upazila = upazila;
      }

      //check image is given or not
      if (req.file) {
        if (institutionData.institution_info?.logo.public_id) {
          // destroy the existing image
          await cloudinary.uploader.destroy(
            institutionData.institution_info?.logo.public_id
          );
        }

        const image = dataUri(req.file).content;

        // Upload the image directly to Cloudinary
        const imageUploadResult = await cloudinary.uploader.upload(image, {
          folder: "layout",
        });

        institutionData.institution_info.logo.public_id =
          imageUploadResult.public_id;
        institutionData.institution_info.logo.url =
          imageUploadResult.secure_url;
      }
      institutionData.institution_info = institution_info;

      await institutionData.save();
    } else if (type === "president_message") {
      const { desc } = req.body;
      const president_message = {
        desc,
      };
      const messageData = await Layout.findOne({ _id: id, type });

      if (!messageData) {
        throw createHttpError(
          404,
          "Not layout found with the given id or type"
        );
      }

      messageData.president_message = president_message;
      await messageData.save();
    } else if (type === "principal_message") {
      const { desc } = req.body;
      const principal_message = {
        desc,
      };
      const messageData = await Layout.findOne({ _id: id, type });

      if (!messageData) {
        throw createHttpError(
          404,
          "Not layout found with the given id or type"
        );
      }

      messageData.principal_message = principal_message;

      await messageData.save();
    } else if (type === "about_institution") {
      const { desc } = req.body;

      const about_institution = {
        desc,
      };

      const aboutData = await Layout.findOne({ _id: id, type });

      if (!aboutData) {
        throw createHttpError(
          404,
          "Not layout found with the given id or type"
        );
      }

      aboutData.about_institution = about_institution;
      await aboutData.save();
    } else if (type === "institution_objective") {
      const { desc } = req.body;
      const institution_objective = {
        desc,
      };
      const objectivesData = await Layout.findOne({ _id: id, type });

      if (!objectivesData) {
        throw createHttpError(
          404,
          "Not layout found with the given id or type"
        );
      }

      objectivesData.institution_objective = institution_objective;

      await objectivesData.save();
    } else {
      throw createHttpError(404, "Not layout found with the given id or type");
    }
    return successResponse(res, {
      message: "Layout Data updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* 
  get layout by type
*/
exports.getLayoutByType = async (req, res, next) => {
  try {
    const { type } = req.query;

    const layout = await Layout.findOne({ type: type });

    return successResponse(res, {
      payload: layout,
    });
  } catch (error) {
    next(error);
  }
};
