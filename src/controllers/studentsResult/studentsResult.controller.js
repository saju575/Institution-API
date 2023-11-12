const excel = require("exceljs");
const { successResponse } = require("../response/response.controller");
const fs = require("fs");
const Result = require("../../models/studentsResult.model");
const createHttpError = require("http-errors");
/* 
    student results create controller
*/
exports.creatResult = async (req, res, next) => {
  try {
    const { classTitle, session, year, group, examType } = req.body;
    const filePath = req.file.path;
    const workbook = new excel.Workbook();
    const jsonResult = {
      classTitle,
      year: year,
      examType,
      results: [],
    };
    if (session) {
      jsonResult.session = session;
    }
    if (group) {
      jsonResult.group = group;
    }

    try {
      await workbook.xlsx.readFile(filePath);
      const workSheet = workbook.getWorksheet(1);

      workSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          return;
        }

        const rowObject = {
          subjects: {},
        };

        row.eachCell((cell, colNumber) => {
          const headerCell = workSheet.getRow(1).getCell(colNumber);
          const headerText = headerCell.text.toString();

          if (
            headerText === "roll" ||
            headerText === "name" ||
            headerText === "GPA"
          ) {
            rowObject[headerText] = cell.value;
          } else {
            rowObject.subjects[headerText] = cell.value;
          }
        });

        jsonResult.results.push(rowObject);
      });
    } catch (error) {
      if (filePath) {
        fs.unlinkSync(filePath);
      }
      throw new Error(error);
    }

    const resResult = await Result.create(jsonResult);

    fs.unlinkSync(filePath);

    return successResponse(res, {
      payload: resResult,
    });
  } catch (error) {
    next(error);
  }
};

/* 
    get all results 
*/

exports.getAllResults = async (req, res, next) => {
  try {
    const {
      classTitle,
      examType,
      group,
      year,
      searchQuery,
      page,
      limit = 10,
    } = req.query;
    let filter = {};

    if (classTitle) {
      filter.classTitle = new RegExp(classTitle, "i");
    }

    if (examType) {
      filter.examType = new RegExp(examType, "i");
    }

    if (group) {
      filter.group = new RegExp(group, "i");
    }

    if (year) {
      filter.year = parseInt(year);
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      filter.$or = [
        { classTitle: { $regex: searchRegex } },
        { examType: { $regex: searchRegex } },
        { group: { $regex: searchRegex } },
        { year: { $regex: searchRegex } },
      ];
    }

    let totalDocuments = await Result.countDocuments(filter);
    let pageInt = parseInt(page) || 1;
    let offset = (pageInt - 1) * parseInt(limit);

    const results = await Result.find(filter)
      .skip(offset)
      .limit(parseInt(limit));

    return successResponse(res, {
      message: "Data returned successfully",
      payload: {
        results,
        currentPage: pageInt,
        totalPages: Math.ceil(totalDocuments / parseInt(limit)),
        totalResults: totalDocuments,
        hasNext:
          pageInt < Math.ceil(totalDocuments / parseInt(limit)) ? true : false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* 
  get one student results 
*/
exports.getSingleStudentResult = async (req, res, next) => {
  try {
    const { classTitle, year, examType, group, session, roll } = req.body;

    // build filter based on provided data
    const filter = {
      classTitle,
      year,
      examType,
      "results.roll": roll,
    };

    if (group) {
      filter.group = group;
    }

    const studentResult = await Result.findOne(filter, {
      classTitle: 1,
      year: 1,
      examType: 1,
      group: 1,
      "results.$": 1,
    });

    if (!studentResult) {
      throw createHttpError(404, "Student not found");
    }

    return successResponse(res, {
      payload: {
        ...studentResult._doc,
        results: studentResult._doc.results[0],
      },
    });
  } catch (error) {
    next(error);
  }
};
