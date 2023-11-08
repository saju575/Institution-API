const Layout = require("../../models/layout.model");
const { successResponse } = require("../response/response.controller");

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
      const { about } = req.body;

      const about_institution = {
        about,
      };

      await Layout.create({ type, about_institution });
    }

    if (type === "institution_objective") {
      const { objectives } = req.body;
      const institution_objective = {
        objectives,
      };

      await Layout.create({ type, institution_objective });
    }

    if (type === "principal_message") {
      const { message } = req.body;
      const principal_message = {
        message,
      };
      await Layout.create({ type, principal_message });
    }

    if (type === "president_message") {
      const { message } = req.body;
      const president_message = {
        message,
      };
      await Layout.create({ type, president_message });
    }

    if (type === "institution_info") {
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
      } = req.body;

      const institution_info = {};
      if (phone) {
        institution_info.phone = phone;
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

      await Layout.create({ type, institution_info });
    }

    if (type === "boys_and_girls_scout_guide") {
      const { desc } = req.body;

      const boys_and_girls_scout_guide = { desc };
      await Layout.create({ type, boys_and_girls_scout_guide });
    }

    if (type === "debates_compitition") {
      const { desc } = req.body;
      const debates_compitition = { desc };

      await Layout.create({ type, debates_compitition });
    }
    if (type === "sports") {
      const { desc } = req.body;
      const sports = { desc };
      await Layout.create({ type, sports });
    }

    return successResponse(res, {
      message: "SuccessFully created",
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

      const sportsData = await Layout.findOne({ type });
      const sports = { desc };
      sportsData.sports = sports;
      await sportsData.save();
    }

    if (type === "debates_compitition") {
      const { desc } = req.body;

      const debatesData = await Layout.findOne({ type });
      const debates_compitition = { desc };

      debatesData.debates_compitition = debates_compitition;
      await debatesData.save();
    }

    if (type === "boys_and_girls_scout_guide") {
      const { desc } = req.body;

      const scoutData = await Layout.findOne({ type });

      const boys_and_girls_scout_guide = { desc };

      scoutData.boys_and_girls_scout_guide = boys_and_girls_scout_guide;
      await scoutData.save();
    }

    if (type === "institution_info") {
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
      } = req.body;

      const institution_info = {};
      if (phone) {
        institution_info.phone = phone;
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

      const institutionData = await Layout.findOne({ type });

      institutionData.institution_info = institution_info;

      await institutionData.save();
    }

    if (type === "president_message") {
      const { message } = req.body;
      const president_message = {
        message,
      };
      const messageData = await Layout.findOne({ type });
      messageData.president_message = president_message;
      await messageData.save();
    }

    if (type === "principal_message") {
      const { message } = req.body;
      const principal_message = {
        message,
      };
      const messageData = await Layout.findOne({ type });
      messageData.principal_message = principal_message;

      await messageData.save();
    }

    if (type === "about_institution") {
      const { about } = req.body;

      const about_institution = {
        about,
      };

      const aboutData = await Layout.findOne({ type });
      aboutData.about_institution = about_institution;
      await aboutData.save();
    }

    if (type === "institution_objective") {
      const { objectives } = req.body;
      const institution_objective = {
        objectives,
      };
      const objectivesData = await Layout.findOne({ type });

      objectivesData.institution_objective = institution_objective;

      await objectivesData.save();
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
