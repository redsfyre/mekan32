var express = require("express");
var request = require("postman-request");
var footer = "Yasin İsa YILDIRIM 2020"
var apiSecenekleri = {
  sunucu: "https://yasinisayildirim1711012007.herokuapp.com",
  apiYolu: "/api/mekanlar/",
};

var mesafeyiFormatla = function (mesafe) {
  var yeniMesafe, birim;
  if (mesafe > 1000) {
    yeniMesafe = parseFloat(mesafe / 1000).toFixed(2);
    birim = " km";
  } else {
    yeniMesafe = parseFloat(mesafe).toFixed(1);
    birim = " m";
  }
  return yeniMesafe + birim;
};

var anasayfayiOlustur = function (req, res, cevap, mekanListesi) {
  var mesaj;
  if (!(mekanListesi instanceof Array)) {
    mesaj = "API HATASI: Birşeyler Ters Gitti";
    mekanListesi = [];
  } else {
    if (!mekanListesi.length) {
      mesaj = "Civarda Herhangi Bir Mekan Bulunamadı!";
    }
  }

  res.render("mekanlar-liste", {
    baslik: "Mekan32",
    sayfaBaslik: {
      siteAd: "Mekan32",
      aciklama: "Isparta civarındaki mekanları keşfedin!",
    },
    mekanlar: mekanListesi,
    mesaj: mesaj,
    cevap: cevap,
    footer: footer
  });
};

const anaSayfa = function (req, res) {
  var istekSecenekleri = {
    url: apiSecenekleri.sunucu + apiSecenekleri.apiYolu,
    method: "GET",
    json: {},
    qs: {
      enlem: req.query.enlem,
      boylam: req.query.boylam,
    },
  };
  request(istekSecenekleri, function (hata, cevap, mekanlar) {
    var i, gelenMekanlar;
    gelenMekanlar = mekanlar;
    if (!hata && gelenMekanlar.length) {
      for (i = 0; i < gelenMekanlar.length; i++) {
        gelenMekanlar[i].mesafe = mesafeyiFormatla(gelenMekanlar[i].mesafe);
      }
    }
    anasayfayiOlustur(req, res, cevap, gelenMekanlar);
  });
};

var detaySayfasiOlustur = function (req, res, mekanDetaylari) {
  res.render("mekan-detay", {
    baslik: mekanDetaylari.ad,
    sayfaBaslik: mekanDetaylari.ad,
    mekanBilgisi: mekanDetaylari,
    footer: footer
  });
};

var hataGoster = function (req, res, durum) {
  var baslik, icerik;
  if (durum == 404) {
    baslik = "404, Sayfa Bulunamadı!";
    icerik = "Sanırım kaybolduk!";
  } else {
    baslik = durum + ", Bir şeyler Ters Gitti!";
    icerik = "Üzgünüm ama bir şeyler fena halde bozuldu";
  }
  res.status(durum);
  res.render("hata", {
    baslik: baslik,
    icerik: icerik,
    footer: footer
  });
};

var mekanBilgisiGetir = function (req, res, callback) {
  var istekSecenekleri = {
    url: apiSecenekleri.sunucu + apiSecenekleri.apiYolu + req.params.mekanid,
    method: "GET",
    json: {},
  };
  request(istekSecenekleri, function(hata, cevap, mekanDetaylari) {
    var gelenMekan = mekanDetaylari;
    if (cevap.statusCode != 200) {
      hataGoster(req, res, cevap.statusCode);
    } else {
      gelenMekan.koordinatlar = {
        enlem: mekanDetaylari.koordinatlar[0],
        boylam: mekanDetaylari.koordinatlar[1]
      };
      callback(req, res, gelenMekan);
    }
  });
}

const mekanBilgisi = function (req, res, callback) {
  mekanBilgisiGetir(req, res, function (req, res, cevap) {
    detaySayfasiOlustur(req, res, cevap);
  });
};

var yorumSayfasiOlustur = function (req, res, mekanBilgisi) {
  res.render("yorum-ekle", {
    baslik: mekanBilgisi.ad + " Mekanına Yorum Ekle",
    sayfaBaslik: mekanBilgisi.ad + " Mekanına Yorum Ekle",
    hata: req.query.hata,
  });
};

const yorumEkle = function (req, res) {
  mekanBilgisiGetir(req, res, function (req, res, cevap) {
    yorumSayfasiOlustur(req, res, cevap);
  });
};

const yorumumuEkle = function (req, res) {
  var istekSecenekleri, gonderilenYorum, mekanid;
  mekanid = req.params.mekanid;
  gonderilenYorum = {
    yorumYapan: req.body.name,
    puan: parseInt(req.body.rating, 10),
    yorumMetni: req.body.review,
  };
  istekSecenekleri = {
    url: apiSecenekleri.sunucu + apiSecenekleri.apiYolu + mekanid + "/yorumlar",
    method: "POST",
    json: gonderilenYorum,
  };
  if (
    !gonderilenYorum.yorumYapan ||
    !gonderilenYorum.puan ||
    !gonderilenYorum.yorumMetni
  ) {
    res.redirect("/mekan/" + mekanid + "/yorum/yeni?hata=evet");
  } else {
    request(istekSecenekleri, function (hata, cevap, body) {
      if (cevap.statusCode === 201) {
        res.redirect("/mekan/" + mekanid);
      } else if (
        cevap.statusCode === 400 &&
        body.name &&
        body.name === "ValidationError"
      ) {
        res.redirect("/mekan/" + mekanid + "/yorum/yeni?hata=evet");
      } else {
        hataGoster(req, res, cevap.statusCode);
      }
    });
  }
};

module.exports = {
  anaSayfa,
  mekanBilgisi,
  yorumEkle,
  yorumumuEkle,
};
