const getStats = async (req, res) => {
  res.json({
    data: {
      quantity: {
        parts: 300,
        tires: 150
      },
      cost: {
        parts: 300,
        tires: 50
      },
      value: {
        parts: 300,
        tires: 50
      }
    }
  });
};
module.exports = {
  getStats
};
