const hakkinda=function(req, res, next) {
  res.render('hakkinda', { title: 'Hakkında', footer:'Yasin İsa YILDIRIM' });
}

module.exports={

	hakkinda
}