/**
 * Get /
 * Hompage
 */

exports.homepage = async (req, res) => {
  res.render('index', { title: 'Grocery - Home' });
};
