var footer = 'Yasin İsa YILDIRIM'
const hakkinda = function(req, res, next) {
  res.render('hakkinda', 
    { 
      title: 'Hakkında',
      footer : footer
    }
  );
}

module.exports = {
  hakkinda
}
