import { EducationArticle } from '../types';

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'skabies-asrama',
    title: 'Pencegahan & Pengendalian Skabies (Kudis/Gudik) di Kamar Asrama',
    category: 'Kesehatan Kulit',
    readTime: '4 menit baca',
    badge: 'Sering di Asrama',
    summary: 'Skabies adalah infeksi tungau Sarcoptes scabiei yang sangat cepat menular di lingkungan padat seperti asrama sekolah bila kebersihan bersama tidak terjaga.',
    content: [
      'Skabies disebabkan oleh tungau mikroskopis yang membuat terowongan di bawah lapisan kulit luar. Gejala khasnya adalah rasa gatal hebat yang memuncak pada malam hari saat suhu tubuh hangat di tempat tidur.',
      'Lokasi lesi paling sering muncul di sela-sela jari tangan, pergelangan tangan, siku, ketiak, sekitar pusar, dan lipatan paha.',
      'Kunci utama pemutusan rantai penularan di asrama bukan hanya mengobati satu orang, melainkan pengobatan SERENTAK seluruh penghuni satu kamar asrama yang mengalami kontak erat, disertai dekontaminasi barang-barang pribadi.'
    ],
    dosAndDonts: {
      dos: [
        'Segera lapor ke petugas UKS jika mendapati bintik berair gatal di sela jari.',
        'Cuci semua sprei, sarung bantal, selimut, dan pakaian dengan air panas minimal 60°C atau rebus sebelum dicuci.',
        'Jemur kasur dan bantal secara berkala di bawah terik sinar matahari langsung.',
        'Gunakan lotion permethrin sesuai anjuran tenaga medis UKS dari leher hingga ujung kaki dan biarkan selama 8-12 jam sebelum dibilas.'
      ],
      donts: [
        'Jangan saling meminjam handuk, sarung, pakaian, atau sajadah dengan teman sekamar.',
        'Jangan tidur di kasur teman yang sedang mengalami keluhan gatal bintik.',
        'Jangan menggaruk terlalu keras dengan kuku kotor karena berisiko infeksi bakteri sekunder (nanah).'
      ]
    },
    redFlags: [
      'Bintik kulit bernanah, bengkak, merah luas, dan terasa panas (infeksi sekunder).',
      'Disertai demam tinggi atau pembengkakan kelenjar getah bening.',
      'Gatal meluas tidak membaik setelah siklus pengobatan pertama UKS.'
    ],
    source: 'Kementerian Kesehatan RI & WHO Guidelines for Scabies Management in Institutions'
  },
  {
    id: 'ispa-etika-batuk',
    title: 'Etika Batuk & Mencegah Penularan ISPA / Flu di Asrama',
    category: 'Penyakit Menular Asrama',
    readTime: '3 menit baca',
    badge: 'Protokol Asrama',
    summary: 'Kamar asrama ber-AC atau dengan ventilasi minim sangat rentan menjadi sarang penularan droplet virus flu dan infeksi saluran pernapasan akut.',
    content: [
      'Infeksi Saluran Pernapasan Akut (ISPA) seperti selesma (common cold), faringitis, dan influenza menular melalui percikan droplet saat batuk, bersin, atau menyentuh gagang pintu kamar yang terkontaminasi.',
      'Di lingkungan asrama dengan 4–10 siswa per kamar, sirkulasi udara alami sangat menentukan kecepatan penularan.'
    ],
    dosAndDonts: {
      dos: [
        'Buka jendela kamar asrama setiap pagi agar udara segar masuk dan sinar UV membunuh kuman.',
        'Gunakan masker medis jika kamu mulai batuk atau pilek untuk melindungi teman sekamar.',
        'Terapkan etika batuk: tutup mulut dengan lengan atas bagian dalam atau tisu, lalu buang tisu ke tempat sampah tertutup.',
        'Banyak minum air putih hangat (minimal 2–2,5 liter sehari) dan istirahat tidur cukup.'
      ],
      donts: [
        'Jangan berbagi botol minum, gelas, atau sendok makan bersama.',
        'Jangan batuk ke telapak tangan tanpa langsung mencuci tangan dengan sabun/hand sanitizer.',
        'Jangan memaksakan diri ikut apel atau olahraga berat saat badan meriang dan demam.'
      ]
    },
    redFlags: [
      'Napas terasa sesak, cepat, atau berbunyi ngik-ngik (mengi).',
      'Nyeri dada tajam saat menarik napas dalam.',
      'Bibir atau kuku tampak kebiruan, atau demam tinggi >39°C lebih dari 3 hari.'
    ],
    source: 'Pedoman Pencegahan & Pengendalian ISPA Kemenkes RI'
  },
  {
    id: 'demam-dengue-dbd',
    title: 'Waspada Fase Kritis Demam Berdarah Dengue (DBD) di Lingkungan Sekolah',
    category: 'Penyakit Menular Asrama',
    readTime: '4 menit baca',
    badge: 'Sangat Penting',
    summary: 'Dengue memiliki fase kritis pada hari ke-3 hingga ke-5, di mana suhu tubuh sering turun namun risiko kebocoran plasma dan syok justru paling tinggi.',
    content: [
      'Demam dengue ditularkan melalui gigitan nyamuk Aedes aegypti yang aktif menggigit di pagi hari (pukul 08.00–10.00) dan sore hari (pukul 15.00–17.00).',
      'Fase pertama adalah Demam Tinggi Mendadak (1–3 hari) disertai sakit kepala di belakang mata, nyeri sendi, dan lemas.',
      'Fase kedua (Fase Kritis, hari ke-3–5): Suhu tubuh seringkali turun normal (~37°C), namun inilah momen paling berbahaya karena dapat terjadi kebocoran pembuluh darah tanpa disadari.'
    ],
    dosAndDonts: {
      dos: [
        'Lakukan pemantauan asupan cairan secara ketat (air putih, oralit, jus, kuah sup).',
        'Lapor segera ke UKS untuk pemeriksaan darah lengkap (trombosit & hematokrit) jika demam sudah hari ke-2 atau ke-3.',
        'Gunakan obat penurun panas lini pertama yang aman (Paracetamol) sesuai anjuran UKS.',
        'Ikuti kegiatan bersih asrama (PSN 3M Plus): kuras bak mandi asrama, tutup penampungan air, kubur/daur ulang wadah penampung air.'
      ],
      donts: [
        'JANGAN minum obat pereda nyeri golongan NSAID seperti Aspirin atau Ibuprofen tanpa petunjuk dokter karena meningkatkan risiko perdarahan lambung!',
        'Jangan mengira sembuh hanya karena demam mendadak turun di hari ke-4 jika badan masih sangat lemas.'
      ]
    },
    redFlags: [
      'Nyeri perut hebat atau muntah terus-menerus (tidak bisa minum sama sekali).',
      'Pendarahan spontan: mimisan, gusi berdarah, bintik merah tidak hilang saat ditekan, atau BAB hitam cair.',
      'Ujung tangan dan kaki teraba dingin, pucat, dan siswa tampak sangat mengantuk/gelisah.'
    ],
    source: 'WHO Dengue Guidelines & Buku Saku Tatalaksana Dengue Kemenkes RI'
  },
  {
    id: 'dispepsia-maag-asrama',
    title: 'Menangani Maag, Asam Lambung & Perut Melilit bagi Siswa Asrama',
    category: 'Pencernaan & Nutrisi',
    readTime: '3 menit baca',
    badge: 'Keluhan Harian',
    summary: 'Jadwal belajar padat, makan telat di kantin, dan kebiasaan minum kopi sachet saat belajar malam adalah pemicu tersering sakit perut pada siswa boarding school.',
    content: [
      'Dispepsia fungsional dan gastritis adalah peradangan atau ketidaknyamanan pada lambung. Gejalanya meliputi rasa perih ulu hati, mual, perut kembung begah, dan rasa cepat kenyang.',
      'Seringkali diperparah oleh stres menjelang ujian semester atau adaptasi dengan menu makanan katering asrama.'
    ],
    dosAndDonts: {
      dos: [
        'Makan tepat waktu sesuai jadwal katering asrama, jangan menunda makan hingga larut.',
        'Bila jam makan utama terlewat, sediakan biskuit gandum atau pisang di loker asrama sebagai pengganjal.',
        'Minum air hangat perlahan saat perut mulai terasa perih.',
        'Minta antasida cair atau tablet kunyah di ruang UKS jika perut sangat perih sebelum makan.'
      ],
      donts: [
        'Hindari konsumsi mie instan super pedas dan minuman energi/kopi berlebih saat perut kosong.',
        'Jangan langsung berbaring tidur setelah makan kenyang (beri jeda minimal 2 jam untuk cegah refluks asam/GERD).'
      ]
    },
    redFlags: [
      'Muntah darah berwarna merah segar atau berwarna seperti ampas kopi hitam.',
      'Buang air besar berwarna hitam pekat seperti aspal disertai lemas.',
      'Nyeri perut kanan bawah yang sangat hebat hingga tidak bisa berjalan tegak (waspada usus buntu / apendisitis).'
    ],
    source: 'Perhimpunan Dokter Spesialis Penyakit Dalam Indonesia (PAPDI)'
  },
  {
    id: 'dismenore-siswi',
    title: 'Panduan Mengatasi Nyeri Haid (Dismenore) & Tablet Tambah Darah',
    category: 'Kesehatan Siswi',
    readTime: '3 menit baca',
    badge: 'Khusus Siswi',
    summary: 'Kram perut bagian bawah saat hari pertama dan kedua menstruasi sering mengganggu konsentrasi belajar siswi asrama.',
    content: [
      'Dismenore primer terjadi akibat pelepasan zat prostaglandin alami tubuh yang memicu kontraksi otot rahim untuk meluruhkan dinding rahim.',
      'Selain itu, siswi asrama rentan mengalami anemia karena kehilangan zat besi saat haid bulanan, sehingga program Kementerian Kesehatan RI menganjurkan konsumsi Tablet Tambah Darah (TTD) 1 tablet seminggu.'
    ],
    dosAndDonts: {
      dos: [
        'Gunakan kompres hangat (botol air hangat dilapisi kain atau heat patch) di perut bagian bawah untuk merilekskan otot rahim.',
        'Minum air putih hangat dan konsumsi makanan kaya zat besi (bayam, telur, daging) dari kantin asrama.',
        'Lakukan peregangan ringan (stretching yoga) untuk melancarkan sirkulasi panggul.',
        'Rutin minum Tablet Tambah Darah (TTD) setiap minggu yang difasilitasi UKS/Puskesmas.'
      ],
      donts: [
        'Jangan membiarkan diri dehidrasi atau mengonsumsi kafein berlebihan yang dapat mempersempit pembuluh darah.',
        'Jangan memaksakan aktivitas fisik keras jika badan terasa pusing berputar dan lemas.'
      ]
    },
    redFlags: [
      'Nyeri haid sangat hebat hingga pingsan atau tidak merespons obat pereda nyeri standar.',
      'Pendarahan sangat banyak (harus ganti pembalut penuh setiap 1 jam selama beberapa jam berturut-turut).',
      'Disertai demam tinggi dan keputihan berbau tidak sedap.'
    ],
    source: 'Program Pencegahan Anemia Remaja Kemenkes RI'
  },
  {
    id: 'p3k-cedera-olahraga',
    title: 'Pertolongan Pertama Cedera Engkel & Otot Saat Olahraga (Metode R.I.C.E)',
    category: 'Pertolongan Pertama',
    readTime: '3 menit baca',
    badge: 'P3K Lapangan',
    summary: 'Terkilir pergelangan kaki (sprain) saat futsal, basket, atau lari sore di asrama memerlukan penanganan awal yang tepat dalam 24-48 jam pertama.',
    content: [
      'Cedera ligamen atau otot terjadi ketika sendi dipaksa bergerak melebihi rentang normalnya. Kesalahan paling fatal di asrama adalah langsung membawa teman ke tukang urut/pijat keras pada fase akut, yang dapat merobek serat otot lebih parah!'
    ],
    dosAndDonts: {
      dos: [
        'R - REST: Hentikan langsung aktivitas olahraga, jangan paksakan berdiri atau berjalan.',
        'I - ICE: Kompres es batu yang dibungkus kain bersih selama 15-20 menit setiap 2-3 jam untuk mengurangi bengkak.',
        'C - COMPRESSION: Balut pergelangan kaki dengan perban elastis (tensocrepe) dari UKS, pastikan tidak terlalu ketat hingga jari membiru.',
        'E - ELEVATION: Sangga kaki yang cedera dengan bantal lebih tinggi dari posisi jantung saat berbaring di asrama.'
      ],
      donts: [
        'JANGAN DIPIJAT ATAU DIURUT KERAS pada 48 jam pertama pasca cedera!',
        'JANGAN diberi kompres panas atau balsem panas langsung pada sendi yang baru bengkak akut.'
      ]
    },
    redFlags: [
      'Sendi tampak berubah bentuk secara nyata (deformitas / dislokasi / dugaan patah tulang).',
      'Terdengar bunyi "pop" keras saat cedera dan sama sekali tidak bisa menumpu berat badan.',
      'Jari kaki terasa mati rasa, baal, atau dingin membiru.'
    ],
    source: 'American Academy of Orthopaedic Surgeons (AAOS) & Kemenkes RI P3K'
  },
  {
    id: 'sleep-hygiene-asrama',
    title: 'Sleep Hygiene & Manajemen Stres Belajar di Kamar Ramai Asrama',
    category: 'Kesehatan Mental & Tidur',
    readTime: '4 menit baca',
    badge: 'Kesejahteraan Siswa',
    summary: 'Tidur cukup 7–8 jam adalah pondasi utama imunitas tubuh siswa/siswi agar tidak mudah terserang penyakit menular di asrama.',
    content: [
      'Tuntutan hafalan, tugas sekolah, apel malam, dan jam belajar mandiri seringkali membuat siswa asrama tidur larut malam (kurang dari 5 jam).',
      'Kurang tidur kronis menurunkan sel darah putih pelindung tubuh, membuat daya ingat menurun, dan memicu kecemasan.'
    ],
    dosAndDonts: {
      dos: [
        'Sepakati jadwal lampu padam kamar (jam malam) bersama teman sekamar dan ketua kamar.',
        'Bila teman masih belajar dengan lampu meja, gunakan penutup mata (eye mask) dan earplug busa yang nyaman.',
        'Matikan smartphone atau simpan gawai minimal 30 menit sebelum jadwal tidur.',
        'Lakukan teknik pernapasan 4-7-8 jika merasa cemas atau sulit tidur memikirkan ujian.'
      ],
      donts: [
        'Jangan mengonsumsi kopi atau minuman bertenaga setelah pukul 16.00 sore.',
        'Jangan belajar di atas kasur tidur jika memungkinkan, gunakan meja belajar agar otak membedakan tempat istirahat dan tempat kerja.'
      ]
    },
    redFlags: [
      'Insomnia berat berlangsung lebih dari 2 minggu disertai penurunan nafsu makan drastis.',
      'Rasa putus asa, sedih berkepanjangan, atau muncul dorongan menyakiti diri sendiri (SEGERA lapor ke konselor/BK sekolah atau pembina asrama).'
    ],
    source: 'WHO Guidelines on Mental Health and Sleep for Adolescents'
  }
];
