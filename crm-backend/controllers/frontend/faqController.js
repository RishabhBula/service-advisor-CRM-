const FaqModel = require("../../models/faq");

const getFaqList = async (req, res) => {
   try {
      const { query } = req;
      const { limit, page, search, status, faqId, sort } = query;

      let condition = {
         $and: []
      };
      if (faqId) {
         condition.$and.push({
            isDeleted: false,
            _id: faqId
         });
      } else {
         condition.$and.push({
            isDeleted: false,
         });
      }
      if (search) {
         condition.$and.push({
            $or: [
               {
                  question: {
                     $regex: new RegExp(search.trim(), "i")
                  }
               },
               {
                  answer: {
                     $regex: new RegExp(search.trim(), "i")
                  }
               }
            ]
         });
      }
      // check for sort option
      let sortOption = {};
      switch (sort) {
         case "orderasc":
            sortOption = {
               order: 1
            };
            break;
         case "orderdesc":
            sortOption = {
               order: -1
            };
            break;
         default:
            sortOption = {
               order: 1
            };
            break;
      }
      if (typeof status !== "undefined") {
         condition.$and.push({
            status: status == "1" ? true : false
         });
      }
      const faqData = await FaqModel.find(condition).limit(parseInt(limit) || 10)
         .skip(((page || 1) - 1) * (limit || 10)).sort(sortOption);

      const faqDataCount = await FaqModel.countDocuments(condition)
      return res.status(200).json({
         data: faqData,
         totalFaq: faqDataCount,
         success: true
      })
   } catch (error) {
      res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
module.exports = {
   getFaqList
};
