// Data o autorech a příspěvcích
const authorsData = [
    {
        id: "jan-novak",
        name: "Jan Novák",
        image: "image5.png",
        genre: "Próza, román",
        bio: "Jan Novák je uznávaný autor prózy, který se věnuje především románům s tématikou mezilidských vztahů a historických událostí. Jeho díla se vyznačují bohatým jazykem a propracovanou psychologií postav. V současnosti pracuje na nové trilogii, která mapuje osudy jedné rodiny napříč 20. stoletím.",
        works: [
            {
                year: "2025",
                title: "Cesta domů",
                description: "Román o hledání identity a návratu ke kořenům."
            },
            {
                year: "2022",
                title: "Stíny minulosti",
                description: "Psychologický román odehrávající se v poválečném Československu."
            },
            {
                year: "2019",
                title: "Pod hladinou",
                description: "Sbírka povídek inspirovaná skutečnými událostmi."
            }
        ],
        social: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    },
    {
        id: "petra-svobodova",
        name: "Petra Svobodová",
        image: "image3.png",
        genre: "Poezie, překlad",
        bio: "Petra Svobodová je básnířka a překladatelka, která se specializuje na překlady současné francouzské poezie. Její vlastní tvorba je charakteristická experimentováním s formou a jazykem. Je držitelkou několika literárních ocenění a pravidelně publikuje v literárních časopisech.",
        works: [
            {
                year: "2024",
                title: "Tiché rozhovory",
                description: "Sbírka intimní lyriky inspirovaná každodenními momenty."
            },
            {
                year: "2022",
                title: "Překlady z ticha",
                description: "Překlady současné francouzské poezie."
            },
            {
                year: "2020",
                title: "Mezi řádky",
                description: "Experimentální básnická sbírka kombinující text a vizuální prvky."
            }
        ],
        social: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    },
    {
        id: "tomas-cerny",
        name: "Tomáš Černý",
        image: "Image2.png",
        genre: "Scenáristika, drama",
        bio: "Tomáš Černý je dramatik a scenárista, který se specializuje na společenská témata a politickou satiru. Jeho hry byly uvedeny na předních českých scénách a některé byly přeloženy do angličtiny a němčiny. Vedle psaní pro divadlo se věnuje také rozhlasovým hrám a televizním scénářům.",
        works: [
            {
                year: "2025",
                title: "Poslední jednání",
                description: "Drama o morálních dilematech v současné politice."
            },
            {
                year: "2023",
                title: "Neviditelní",
                description: "Rozhlasová hra o marginalizovaných skupinách ve společnosti."
            },
            {
                year: "2021",
                title: "Kruh",
                description: "Divadelní hra o korupci a mocenských vztazích."
            }
        ],
        social: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    },
    {
        id: "lucie-kralova",
        name: "Lucie Králová",
        image: "image6.png",
        genre: "Literatura pro děti",
        bio: "Lucie Králová je autorka knih pro děti a mládež. Její příběhy kombinují dobrodružství s edukativními prvky, často se zaměřením na ekologii a vztah k přírodě. Vedle psaní se věnuje také ilustraci a vede tvůrčí dílny pro děti.",
        works: [
            {
                year: "2025",
                title: "Dobrodružství v Zeleném údolí",
                description: "Příběh o dětech, které objevují tajemství přírody a učí se ji chránit."
            },
            {
                year: "2023",
                title: "Kouzelný les",
                description: "Ilustrovaná kniha pro nejmenší o přátelství a respektu k přírodě."
            },
            {
                year: "2021",
                title: "Malí ochránci",
                description: "Série příběhů o dětech, které pomáhají zachraňovat ohrožené druhy."
            }
        ],
        social: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    },
    {
        id: "karel-maly",
        name: "Karel Malý",
        image: "image7.png",
        genre: "Eseje, kritika",
        bio: "Karel Malý je literární kritik a esejista, který se zaměřuje na analýzu současné české literatury v kontextu evropských trendů. Pravidelně publikuje v odborných časopisech a je autorem několika monografií o významných českých autorech. Vedle kritické činnosti vyučuje literární teorii na univerzitě.",
        works: [
            {
                year: "2024",
                title: "Česká literatura v evropském kontextu",
                description: "Studie o postavení současné české literatury v Evropě."
            },
            {
                year: "2022",
                title: "Na hraně slova",
                description: "Sbírka esejů o experimentální literatuře."
            },
            {
                year: "2020",
                title: "Kritické reflexe",
                description: "Výbor z literárních kritik a recenzí."
            }
        ],
        social: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    },
    {
        id: "monika-vesela",
        name: "Monika Veselá",
        image: "image4.png",
        genre: "Fantasy, sci-fi",
        bio: "Monika Veselá je autorka fantasy a sci-fi literatury. Její díla se vyznačují propracovanými světy a originálními zápletkami, často s přesahem do společenských témat. Je jednou z nejúspěšnějších českých autorek žánrové literatury a její knihy byly přeloženy do několika jazyků.",
        works: [
            {
                year: "2025",
                title: "Poslední hranice",
                description: "Sci-fi román o objevování vzdálených planet a jejich tajemství."
            },
            {
                year: "2023",
                title: "Země stínů",
                description: "Dystopická vize budoucnosti ovládané umělou inteligencí."
            },
            {
                year: "2021",
                title: "Brány času",
                description: "Fantasy trilogie o cestování mezi světy a časovými liniemi."
            }
        ],
        social: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    }
    // Zde můžete přidávat další autory
];

// Data o příspěvcích
const postsData = [
    {
        id: 1,
        title: "Vzpomínky na dětství: Próza pana zadka",
        author: "Jan Novák",
        date: "2024-03-23", // Standard ISO formát (YYYY-MM-DD)
        displayDate: "23. března 2024", // Pro zobrazení
        category: "Povídka",
        excerpt: "Jan Novák v této ukázce z připravované knihy kombinuje autobiografické prvky s fikcí. Přemýšlí, jak citlivě pracovat s reálnými zážitky, aniž by narušil soukromí skutečných osob.",
        image: "book4.png",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus quis tincidunt lobortis. Integer condimentum eros id metus bibendum, vel tempor odio faucibus. Praesent malesuada, nibh eget tincidunt ullamcorper, dolor elit feugiat neque, sed efficitur nulla nunc vel metus. Etiam sit amet est vel nisl interdum iaculis. Nulla facilisi. Aenean a justo justo. Donec at vestibulum nibh, vel ornare nisl. Donec euismod, justo vel elementum iaculis, nisl ipsum feugiat odio, non pulvinar est lectus at ligula. Morbi cursus orci ut elementum maximus. Fusce id vehicula neque."
    },
    {
        id: 2,
        title: "Koncepce nové básnické sbírky",
        author: "Petra Svobodová",
        date: "2023-03-22",
        displayDate: "22. března 2023",
        category: "Poezie",
        excerpt: "Petra Svobodová přemýšlí o struktuře své připravované básnické sbírky inspirované ročními obdobími a proměnami přírody.",
        image: "book3.png",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus quis tincidunt lobortis. Integer condimentum eros id metus bibendum, vel tempor odio faucibus. Praesent malesuada, nibh eget tincidunt ullamcorper, dolor elit feugiat neque, sed efficitur nulla nunc vel metus. Etiam sit amet est vel nisl interdum iaculis. Nulla facilisi. Aenean a justo justo. Donec at vestibulum nibh, vel ornare nisl. Donec euismod, justo vel elementum iaculis, nisl ipsum feugiat odio, non pulvinar est lectus at ligula. Morbi cursus orci ut elementum maximus. Fusce id vehicula neque."
    },
    {
        id: 3,
        title: "První draft scénáře dokončen",
        author: "Tomáš Černý",
        date: "2025-03-21",
        displayDate: "21. března 2025",
        category: "Scénář",
        excerpt: "Tomáš Černý dokončil první draft scénáře k novému filmu o vztahu otce a syna v době klimatické krize. Sdílí své úvahy o propojení osobního příběhu s globálními tématy.",
        image: "book2.png",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus quis tincidunt lobortis. Integer condimentum eros id metus bibendum, vel tempor odio faucibus. Praesent malesuada, nibh eget tincidunt ullamcorper, dolor elit feugiat neque, sed efficitur nulla nunc vel metus. Etiam sit amet est vel nisl interdum iaculis. Nulla facilisi. Aenean a justo justo. Donec at vestibulum nibh, vel ornare nisl. Donec euismod, justo vel elementum iaculis, nisl ipsum feugiat odio, non pulvinar est lectus at ligula. Morbi cursus orci ut elementum maximus. Fusce id vehicula neque."
    },
    {
        id: 4,
        title: "Nová dětská kniha na cestě",
        author: "Lucie Králová",
        date: "2025-03-20",
        displayDate: "20. března 2025",
        category: "Knihy pro děti",
        excerpt: "Lucie Králová představuje koncept své nové knihy pro děti s ekologickou tematikou a krásnými ilustracemi. Kniha bude obsahovat interaktivní prvky a praktické aktivity pro děti.",
        image: "book1.png",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus quis tincidunt lobortis. Integer condimentum eros id metus bibendum, vel tempor odio faucibus. Praesent malesuada, nibh eget tincidunt ullamcorper, dolor elit feugiat neque, sed efficitur nulla nunc vel metus. Etiam sit amet est vel nisl interdum iaculis. Nulla facilisi. Aenean a justo justo. Donec at vestibulum nibh, vel ornare nisl. Donec euismod, justo vel elementum iaculis, nisl ipsum feugiat odio, non pulvinar est lectus at ligula. Morbi cursus orci ut elementum maximus. Fusce id vehicula neque."
    },
    {
        id: 5,
        title: "Kritická recenze současné české literatury",
        author: "Karel Malý",
        date: "2025-02-15",
        displayDate: "15. února 2025",
        category: "Esej",
        excerpt: "Karel Malý nabízí rozsáhlou kritickou analýzu trendů v současné české literatuře a srovnává je s vývojem v okolních evropských zemích.",
        image: "book5.png",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus quis tincidunt lobortis. Integer condimentum eros id metus bibendum, vel tempor odio faucibus. Praesent malesuada, nibh eget tincidunt ullamcorper, dolor elit feugiat neque, sed efficitur nulla nunc vel metus. Etiam sit amet est vel nisl interdum iaculis. Nulla facilisi. Aenean a justo justo. Donec at vestibulum nibh, vel ornare nisl. Donec euismod, justo vel elementum iaculis, nisl ipsum feugiat odio, non pulvinar est lectus at ligula. Morbi cursus orci ut elementum maximus. Fusce id vehicula neque."
    },
    {
        id: 6,
        title: "Nová fantasy sága",
        author: "Monika Veselá",
        date: "2025-01-10",
        displayDate: "10. ledna 2025",
        category: "Fantasy",
        excerpt: "Monika Veselá představuje svůj nový fantasy projekt, který propojuje mytologii různých kultur do jedinečného světa. Sdílí proces tvorby a inspirační zdroje.",
        image: "book6.png",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus quis tincidunt lobortis. Integer condimentum eros id metus bibendum, vel tempor odio faucibus. Praesent malesuada, nibh eget tincidunt ullamcorper, dolor elit feugiat neque, sed efficitur nulla nunc vel metus. Etiam sit amet est vel nisl interdum iaculis. Nulla facilisi. Aenean a justo justo. Donec at vestibulum nibh, vel ornare nisl. Donec euismod, justo vel elementum iaculis, nisl ipsum feugiat odio, non pulvinar est lectus at ligula. Morbi cursus orci ut elementum maximus. Fusce id vehicula neque."
    },
    {
        id: 7,
        title: "Rozhovor s literárním agentem",
        author: "Jan Novák",
        date: "2024-12-05",
        displayDate: "5. prosince 2024",
        category: "Rozhovor",
        excerpt: "Jan Novák vede rozhovor se známým literárním agentem o současném knižním trhu, trendech v nakladatelství a možnostech pro začínající autory.",
        image: "book7.png",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus quis tincidunt lobortis. Integer condimentum eros id metus bibendum, vel tempor odio faucibus. Praesent malesuada, nibh eget tincidunt ullamcorper, dolor elit feugiat neque, sed efficitur nulla nunc vel metus. Etiam sit amet est vel nisl interdum iaculis. Nulla facilisi. Aenean a justo justo. Donec at vestibulum nibh, vel ornare nisl. Donec euismod, justo vel elementum iaculis, nisl ipsum feugiat odio, non pulvinar est lectus at ligula. Morbi cursus orci ut elementum maximus. Fusce id vehicula neque."
    },
    {
        id: 8,
        title: "Překladatelské výzvy současné poezie",
        author: "Petra Svobodová",
        date: "2024-11-12",
        displayDate: "12. listopadu 2024",
        category: "Esej",
        excerpt: "Petra Svobodová se zamýšlí nad specifickými obtížemi při překladu moderní francouzské poezie a sdílí své zkušenosti a metody, které jí pomáhají zachovat ducha originálu.",
        image: "book8.png",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus quis tincidunt lobortis. Integer condimentum eros id metus bibendum, vel tempor odio faucibus. Praesent malesuada, nibh eget tincidunt ullamcorper, dolor elit feugiat neque, sed efficitur nulla nunc vel metus. Etiam sit amet est vel nisl interdum iaculis. Nulla facilisi. Aenean a justo justo. Donec at vestibulum nibh, vel ornare nisl. Donec euismod, justo vel elementum iaculis, nisl ipsum feugiat odio, non pulvinar est lectus at ligula. Morbi cursus orci ut elementum maximus. Fusce id vehicula neque."
    }
    // Zde můžete přidávat další příspěvky
];
