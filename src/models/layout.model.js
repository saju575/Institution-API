const { Schema, model } = require("mongoose");

const bannerImageSchema = new Schema({
  public_id: { type: String },
  url: { type: String },
});

const aboutInstitution = new Schema({
  desc: {
    type: String,
  },
});

const institutionObectives = new Schema({
  desc: { type: String },
});

const principalMessage = new Schema({
  desc: { type: String },
});

const presidentMessage = new Schema({
  desc: { type: String },
});

const institutionInfo = new Schema({
  institution_name: { type: String },
  email: { type: String },
  phone: { type: String },
  village: { type: String },
  district: { type: String },
  postOffice: { type: String },
  EIIN: { type: String },
  established: { type: String },
  institutionCode: { type: String },
  website: { type: String },
  upazila: { type: String },
  location_name: { type: String },
  map_link: { type: String },
  logo: { type: bannerImageSchema },
});

const boysAndGirlsScoutGide = new Schema({
  desc: { type: String },
});

const debatesCompitition = new Schema({ desc: { type: String } });

const sports = new Schema({ desc: { type: String } });
/* 
    making user model schema
*/
const layoutSchema = new Schema(
  {
    type: { type: String },
    banner: {
      type: [bannerImageSchema],
    },
    about_institution: {
      type: aboutInstitution,
    },
    institution_objective: { type: institutionObectives },
    principal_message: { type: principalMessage },
    president_message: { type: presidentMessage },
    institution_info: { type: institutionInfo },
    boys_and_girls_scout_guide: { type: boysAndGirlsScoutGide },
    debates_compitition: { type: debatesCompitition },
    sports: { type: sports },
  },
  { timestamps: true, versionKey: false }
);

/* 
    make a model name "User"
*/
const Layout = model("Layout", layoutSchema);

module.exports = Layout;
