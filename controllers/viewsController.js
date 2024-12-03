exports.getOverview = async (req, res) => {
  try {
    res.status(200).render('overview', {
      title: 'Log into your account',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
