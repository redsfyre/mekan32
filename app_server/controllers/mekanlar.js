var express = require("express");
var request = require("postman-request");
var footer = "Yasin İsa YILDIRIM 2020"
var apiSecenekleri = {
  sunucu: "https://yasinisayildirim1711012007.herokuapp.com",
  apiYolu: "/api/mekanlar/",
};
var mesafeyiFormatla = function(mesafe) {
  var yeniMesafe, birim;
  if (mesafe > 1000) {
    yeniMesafe = parseFloat(mesafe/1000).toFixed(2);
    birim = 'km';
  } else {
    yeniMesafe = parseFloat(mesafe).toFixed(1);
    birim = ' m';
  }
  return yeniMesafe + birim;
}

var anasayfaOlustur = function(req, res, cevap, mekanListesi) {
  var mesaj;
  // gelen mekanlarListesi eğer dizi tipinde değilse hata ver
  if (!(mekanListesi instanceof Array)) {
    mesaj = 'API HATASI: Bir şeyler ters gitti.';
    mekanListesi = [];
  } else { // eğer belirlenen mesafe içinde bulunamadıysa bilgilendir
    if (!mekanListesi.length) {
      mesaj = 'Civarda Herhangi Bir Mekan Bulunamadı!';
    }
  }

  res.render('mekanlar-liste', { 
    baslik : 'Mekan32',
    sayfaBaslik : {
      siteAd : 'Mekan 32',
      aciklama : 'Isparta civarındaki mekanları keşfedin!'
    },
    footer : footer,
    mekanlar: mekanListesi,
    mesaj: mesaj,
    cevap: cevap
  });
}

const anaSayfa = function(req, res, next) {
  istekSecenekleri = {
    url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu, // tam yol
    method : 'GET', // veri çekeceğimiz için GET methodunu kullan
    json : {}, // dönen veri json formatında olacak
    // sorgu parametreleri. URL'de yazılan enlem ve boylamı al
    // localhost:3000/?enlem=37.7&boylam=30.5 gibi
    qs : {
      enlem : req.query.enlem,
      boylam : req.query.boylam
    }
  };
  
  // istekte bulun
  request(istekSecenekleri, 
    // geri dönüş methodu (callback function)
    function(hata, cevap, mekanlar) {
      var i, gelenMekanlar;
      gelenMekanlar = mekanlar;
      // sadece 200 durum kodunda ve mekanlar doluyken işlem yap
      if (!hata && gelenMekanlar.length) {
        for (i = 0; i < gelenMekanlar.length; i++) {
          gelenMekanlar[i].mesafe = mesafeyiFormatla(gelenMekanlar[i].mesafe);
        }
      }
      anasayfaOlustur(req, res, cevap, gelenMekanlar);
    }
  );
}

var detaySayfasiOlustur = function(req, res, mekanDetaylari) {
  res.render('mekan-detay', { 
    baslik : mekanDetaylari.ad,
    sayfaBaslik : mekanDetaylari.ad,
    mekanBilgisi : mekanDetaylari,
    footer: footer
  });
}

var hataGoster = function(req, res, durum) {
  var baslik, icerik
  if (durum == 404) {
    baslik = '404, Sayfa Bulunamadı!';
    icerik = 'Aradığınız sayfayı bulamadık!';
  } else {
    baslik = durum + ' Bir şeyler ters gitti!';
    icerik = 'Ters giden bir şey var!';
  }

  res.status(durum);
  res.render('hata', {
    baslik: baslik,
    icerik: icerik,
    footer: footer
  });
}

var mekanBilgisi = function(req, res, callback) {
  istekSecenekleri = {
    url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu + req.params.mekanid,
    method : 'GET',
    json : {}
  };

  request(istekSecenekleri, function (hata, cevap, mekanDetaylari) {
    var gelenMekan = mekanDetaylari;
    if (cevap.statusCode == 200) {
      gelenMekan.koordinatlar = {
        enlem: mekanDetaylari.koordinatlar[0],
        boylam: mekanDetaylari.koordinatlar[1],
      };
      detaySayfasiOlustur(req, res, gelenMekan);
    } else {
      hataGoster(req, res, cevap.statusCode);
    }
  });
};

const mekanBilgisi = function(req, res, callback) {
  mekanBilgisiGetir(req, res, function(req, res, cevap){
    detaySayfasiOlustur(req, res, cevap);
  });
}

var yorumSayfasiOlustur = function(req, res, mekanBilgisi) {
  res.render('yorum-ekle', { 
    baslik : mekanBilgisi.ad + ' Mekanına Yorum Ekle',
    sayfaBaslik : mekanBilgisi.ad + ' Mekanına Yorum Ekle',
    hata : req.query.hata,
    footer : footer
  });
}

const yorumEkle = function(req, res) {
  mekanBilgisiGetir(req, res, function(req, res, cevap){
    yorumSayfasiOlustur(req, res, cevap);
  });
}

const yorumumuEkle = function(req, res) {
  var gonderilenYorum, mekanid;
  mekanid = req.params.mekanid;
  gonderilenYorum = {
    yorumYapan: req.body.name,
    puan: parseInt(req.body.rating, 10),
    yorumMetni : req.body.review
  };
  istekSecenekleri = {
    url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu + mekanid + '/yorumlar',
    method : 'POST',
    json : gonderilenYorum
  };
  if(!gonderilenYorum.yorumYapan || !gonderilenYorum.puan || !gonderilenYorum.yorumMetni) {
    res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet');
  } else {
    request(istekSecenekleri, function(hata, cevap, body){
      if (cevap.statusCode === 201) {
        res.redirect('/mekan/' + mekanid);
      } else if(cevap.statusCode === 400 && body.name && body.name === 'ValidationError') {
        res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet');
      } else {
        hataGoster(req, res, cevap.statusCode);
      }
    });
  }
}

module.exports = {
  anaSayfa,
  mekanBilgisi, 
  yorumEkle,
  yorumumuEkle
}
