// data.js — normalizovaný jednotný objekt
// --------------------------------------------------
// Nepoužíváme už authorsData / postsData, ale window.DATA
// Každý post má: id, slug, title, date (ISO), authorId (shodný s author.id),
// categories (pole), image, alt, excerpt, content.

window.DATA = {
  authors: [
    {
      id: "jan-novak",
      name: "Jan Novák",
      image: "image5.png",
      genre: "Próza, román",
      bio: "Jan Novák je uznávaný autor prózy, který se věnuje především románům s tématikou mezilidských vztahů a historických událostí. Jeho díla se vyznačují bohatým jazykem a propracovanou psychologií postav. V současnosti pracuje na nové trilogii, která mapuje osudy jedné rodiny napříč 20. stoletím.",
      works: [
        { year: "2025", title: "Cesta domů", description: "Román o hledání identity a návratu ke kořenům." },
        { year: "2022", title: "Stíny minulosti", description: "Psychologický román odehrávající se v poválečném Československu." },
        { year: "2019", title: "Pod hladinou", description: "Sbírka povídek inspirovaná skutečnými událostmi." }
      ],
      social: { facebook: "#", twitter: "#", instagram: "#" }
    },
    {
      id: "petra-svobodova",
      name: "Petra Svobodová",
      image: "image3.png",
      genre: "Poezie, překlad",
      bio: "Petra Svobodová je básnířka a překladatelka, která se specializuje na překlady současné francouzské poezie. Její vlastní tvorba je charakteristická experimentováním s formou a jazykem. Je držitelkou několika literárních ocenění a pravidelně publikuje v literárních časopisech.",
      works: [
        { year: "2024", title: "Tiché rozhovory", description: "Sbírka intimní lyriky inspirovaná každodenními momenty." },
        { year: "2022", title: "Překlady z ticha", description: "Překlady současné francouzské poezie." },
        { year: "2020", title: "Mezi řádky", description: "Experimentální básnická sbírka kombinující text a vizuální prvky." }
      ],
      social: { facebook: "#", twitter: "#", instagram: "#" }
    },
    {
      id: "tomas-cerny",
      name: "Tomáš Černý",
      image: "Image2.png",
      genre: "Scenáristika, drama",
      bio: "Tomáš Černý je dramatik a scenárista, který se specializuje na společenská témata a politickou satiru. Jeho hry byly uvedeny na předních českých scénách a některé byly přeloženy do angličtiny a němčiny. Vedle psaní pro divadlo se věnuje také rozhlasovým hrám a televizním scénářům.",
      works: [
        { year: "2025", title: "Poslední jednání", description: "Drama o morálních dilematech v současné politice." },
        { year: "2023", title: "Neviditelní", description: "Rozhlasová hra o marginalizovaných skupinách ve společnosti." },
        { year: "2021", title: "Kruh", description: "Divadelní hra o korupci a mocenských vztazích." }
      ],
      social: { facebook: "#", twitter: "#", instagram: "#" }
    },
    {
      id: "lucie-kralova",
      name: "Lucie Králová",
      image: "image6.png",
      genre: "Literatura pro děti",
      bio: "Lucie Králová je autorka knih pro děti a mládež. Její příběhy kombinují dobrodružství s edukativními prvky, často se zaměřením na ekologii a vztah k přírodě. Vedle psaní se věnuje také ilustraci a vede tvůrčí dílny pro děti.",
      works: [
        { year: "2025", title: "Dobrodružství v Zeleném údolí", description: "Příběh o dětech, které objevují tajemství přírody a učí se ji chránit." },
        { year: "2023", title: "Kouzelný les", description: "Ilustrovaná kniha pro nejmenší o přátelství a respektu k přírodě." },
        { year: "2021", title: "Malí ochránci", description: "Série příběhů o dětech, které pomáhají zachraňovat ohrožené druhy." }
      ],
      social: { facebook: "#", twitter: "#", instagram: "#" }
    },
    {
      id: "karel-maly",
      name: "Karel Malý",
      image: "image7.png",
      genre: "Eseje, kritika",
      bio: "Karel Malý je literární kritik a esejista...",
      works: [
        { year: "2024", title: "Česká literatura v evropském kontextu", description: "Studie o postavení současné české literatury v Evropě." },
        { year: "2022", title: "Na hraně slova", description: "Sbírka esejů o experimentální literatuře." },
        { year: "2020", title: "Kritické reflexe", description: "Výbor z literárních kritik a recenzí." }
      ],
      social: { facebook: "#", twitter: "#", instagram: "#" }
    },
    {
      id: "monika-vesela",
      name: "Monika Veselá",
      image: "image4.png",
      genre: "Fantasy, sci-fi",
      bio: "Monika Veselá je autorka fantasy a sci-fi literatury...",
      works: [
        { year: "2025", title: "Poslední hranice", description: "Sci-fi román o objevování vzdálených planet..." },
        { year: "2023", title: "Země stínů", description: "Dystopická vize budoucnosti..." },
        { year: "2021", title: "Brány času", description: "Fantasy trilogie..." }
      ],
      social: { facebook: "#", twitter: "#", instagram: "#" }
    },
    {
      id: "novaaa-autorkaaaa",
      name: "Nová Autorka testovací",
      image: "image8.png",
      genre: "Sci-fi, povídky",
      bio: "Nová Autorka je nadaná spisovatelka...",
      works: [
        { year: "2025", title: "Planeta bez slunce", description: "Povídka o cestě na okraj galaxie..." }
      ],
      social: { facebook: "#", twitter: "#", instagram: "#" }
    }
  ],

  posts: [
    {
      id: 1,
      slug: "vzpominky-na-detstvi-proza-pana-zadka",
      title: "Vzpomínky na dětství: Próza pana zadka",
      date: "2024-03-23",
      authorId: "jan-novak",
      categories: ["Povídka"],
      image: "book4.png",
      alt: "Obálka knihy Vzpomínky na dětství",
      excerpt: "asdasdasdasdddsdsdasdasxcyxasdca.",
      content: "Lorem isdsdsdsdpsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 2,
      slug: "koncepce-nove-basnicke-sbirky",
      title: "Koncepce nové básnické sbírky",
      date: "2023-03-22",
      authorId: "petra-svobodova",
      categories: ["Poezie"],
      image: "book3.png",
      alt: "Ilustrace k básnické sbírce",
      excerpt: "Petra Svobodová přemýšlí o struktuře své připravované básnické sbírky...",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 3,
      slug: "prvni-draft-scenare-dokonceno",
      title: "První draft scénáře dokončen",
      date: "2025-03-21",
      authorId: "tomas-cerny",
      categories: ["Scénář"],
      image: "book2.png",
      alt: "Scénáristické poznámky na stole",
      excerpt: "Tomáš Černý dokončil první draft scénáře k novému filmu...",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 4,
      slug: "nova-detska-kniha-na-ceste",
      title: "Nová dětská kniha na cestě",
      date: "2025-03-20",
      authorId: "lucie-kralova",
      categories: ["Knihy pro děti"],
      image: "book1.png",
      alt: "Ilustrace dětské knihy",
      excerpt: "Lucie Králová představuje koncept své nové knihy pro děti...",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 5,
      slug: "kriticka-recenze-soucasne-ceske-literatury",
      title: "Kritická recenze současné české literatury",
      date: "2025-02-15",
      authorId: "karel-maly",
      categories: ["Esej"],
      image: "book5.png",
      alt: "Kniha s poznámkami",
      excerpt: "Karel Malý nabízí rozsáhlou kritickou analýzu trendů...",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 6,
      slug: "nova-fantasy-saga",
      title: "Nová fantasy sága",
      date: "2025-01-10",
      authorId: "monika-vesela",
      categories: ["Fantasy"],
      image: "book6.png",
      alt: "Fantasy ilustrace",
      excerpt: "Monika Veselá představuje svůj nový fantasy projekt...",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 7,
      slug: "rozhovor-s-literarnim-agentem",
      title: "Rozhovor s literárním agentem",
      date: "2024-12-05",
      authorId: "jan-novak",
      categories: ["Rozhovor"],
      image: "book7.png",
      alt: "Mikrofon a kniha",
      excerpt: "Jan Novák vede rozhovor se známým literárním agentem...",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 8,
      slug: "prekladatelske-vyzvy-soucasne-poezie",
      title: "Překladatelské výzvy současné poezie",
      date: "2024-11-12",
      authorId: "petra-svobodova",
      categories: ["Esej"],
      image: "book8.png",
      alt: "Otevřená kniha poezie",
      excerpt: "Petra Svobodová se zamýšlí nad obtížemi překladu moderní poezie...",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
    },
    {
      id: 9,
      slug: "tajemstvi-stare-knihovny-blabla",
      title: "Tajemství staré knihovny blabla",
      date: "2025-09-08",
      authorId: "novaaa-autorkaaaa",
      categories: ["Povídka"],
      image: "book9.png",
      alt: "Stará knihovna",
      excerpt: "V této povídce odhaluje Nová Autorka záhadu...",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ... [Zde vložte celý text díla]."
    }
  ]
};
