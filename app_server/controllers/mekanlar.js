
const anaSayfa=function(req, res, next) {
  res.render('mekanlar-liste',
             { 'baslik': 'Anasayfa',
               'sayfaBaslik':{
                   'siteAd': 'Mekan32',
                   'aciklama': 'Isparta civarindaki mekanlari kesfedin'
               },
                    'footer': 'Yasin İsa YILDIRIM',
                    'mekanlar': [
                        {
                            'ad':'Starbucks',
                            'adres':'Centrum Garden AVM',
                            'puan':3,
                            'imkanlar':['Dünya Kahveleri','Kekler','Pastalar'],
                            'mesafe':'10km'
                        },
                        {
                            'ad':'Gloria Jeans',
                            'adres':'SDU Doğu Kampüsü',
                            'puan':2,
                            'imkanlar':['Kahve','Çay','Pasta'],
                            'mesafe':'1km'
                        },

                        {
                            'ad':'Kahve Dünyası',
                            'adres':'İyaş',
                            'puan':4,
                            'imkanlar':['Kahve','Çay'],
                            'mesafe':'8km'
                        },
                        {
                            'ad':'MC Donalds',
                            'adres':'İyaş',
                            'puan':4,
                            'imkanlar':['Kahve','Çay','Pasta','Burger','patates'],
                            'mesafe':'8km'
                        },
                        {
                            'ad':'Burger King',
                            'adres':'İyaş',
                            'puan':3,
                            'imkanlar':['Kahve','Çay','Kola','Burger','Patates'],
                            'mesafe':'8km'
                        },

                    ]

            });
}

const mekanBilgisi=function(req, res, next) {
  res.render('mekan-detay', {
      'baslik': 'Mekan Bilgisi',
      'sayfaBaslik': 'Starbucks',
      'mekanBilgisi':{
          'ad':'Starbucks',
          'adres':'Centrum Garden',
          'puan':3,
          'imkanlar':['Kahve', 'Pasta', 'Kek'],
          'koordinatlar':{
              'enlem':37.78185,
              'boylam':30.566034
           },
           'saatler':[
               {
                    'gunler':'Pazartesi-Cuma',
                    'acilis':'7:00',
                    'kapanis':'23:00',
                    'kapali':false
               },
               {
                    'gunler':'Cumartesi',
                    'acilis':'9:00',
                    'kapanis':'22:30',
                    'kapali':false
               },
               {
                    'gunler':'Pazar',
                    'kapali':true
               }
           ],
           'yorumlar':[
               {
                   'yorumYapan': 'Asım Sinan Yüksel',
                   'puan':3,
                   'tarih': '18 Ekim 2017',
                   'yorumMetni': 'Kahveleri çok güzel, öneririm'
            }
        ]


    }
});
}

const yorumEkle=function(req, res, next) {
  res.render('yorum-ekle', { title: 'Yorum Ekle' });
}

module.exports={
anaSayfa,
mekanBilgisi,
yorumEkle
}
