// EduAI boshlang'ich ma'lumotlari (uz/ru/en). Seed skripti shundan foydalanadi.
// Har bir fan: slug, name, description, icon (lucide), color (daisyUI), level.
// Darslar va testlar subject slug orqali bog'lanadi.

export const subjects = [
  {
    slug: 'math',
    icon: 'Calculator',
    color: 'primary',
    level: 'beginner',
    name: { uz: 'Matematika', ru: 'Математика', en: 'Mathematics' },
    description: {
      uz: 'Sonlar, amallar, algebra va geometriya asoslari.',
      ru: 'Числа, операции, основы алгебры и геометрии.',
      en: 'Numbers, operations, and the basics of algebra and geometry.',
    },
  },
  {
    slug: 'informatics',
    icon: 'Cpu',
    color: 'secondary',
    level: 'beginner',
    name: { uz: 'Informatika', ru: 'Информатика', en: 'Computer Science' },
    description: {
      uz: 'Algoritmlar, dasturlash va kompyuter asoslari.',
      ru: 'Алгоритмы, программирование и основы компьютеров.',
      en: 'Algorithms, programming, and computer fundamentals.',
    },
  },
  {
    slug: 'english',
    icon: 'Languages',
    color: 'accent',
    level: 'beginner',
    name: { uz: 'Ingliz tili', ru: 'Английский язык', en: 'English' },
    description: {
      uz: 'Grammatika, so\'z boyligi va muloqot ko\'nikmalari.',
      ru: 'Грамматика, словарный запас и навыки общения.',
      en: 'Grammar, vocabulary, and communication skills.',
    },
  },
  {
    slug: 'physics',
    icon: 'Atom',
    color: 'info',
    level: 'intermediate',
    name: { uz: 'Fizika', ru: 'Физика', en: 'Physics' },
    description: {
      uz: 'Harakat, kuch, energiya va tabiat qonunlari.',
      ru: 'Движение, сила, энергия и законы природы.',
      en: 'Motion, force, energy, and the laws of nature.',
    },
  },
  {
    slug: 'chemistry',
    icon: 'FlaskConical',
    color: 'success',
    level: 'intermediate',
    name: { uz: 'Kimyo', ru: 'Химия', en: 'Chemistry' },
    description: {
      uz: 'Moddalar, reaksiyalar va kimyoviy elementlar.',
      ru: 'Вещества, реакции и химические элементы.',
      en: 'Substances, reactions, and chemical elements.',
    },
  },
  {
    slug: 'biology',
    icon: 'Leaf',
    color: 'warning',
    level: 'beginner',
    name: { uz: 'Biologiya', ru: 'Биология', en: 'Biology' },
    description: {
      uz: 'Tirik organizmlar, hujayra va tabiat.',
      ru: 'Живые организмы, клетка и природа.',
      en: 'Living organisms, the cell, and nature.',
    },
  },
  {
    slug: 'history',
    icon: 'Landmark',
    color: 'error',
    level: 'beginner',
    name: { uz: 'Tarix', ru: 'История', en: 'History' },
    description: {
      uz: 'Jahon va O\'zbekiston tarixi muhim voqealari.',
      ru: 'Важные события мировой и узбекской истории.',
      en: 'Key events in world and Uzbek history.',
    },
  },
  {
    slug: 'native-language',
    icon: 'BookOpen',
    color: 'primary',
    level: 'beginner',
    name: { uz: 'Ona tili va adabiyot', ru: 'Родной язык и литература', en: 'Native Language & Literature' },
    description: {
      uz: 'Til qoidalari, imlo va adabiy asarlar.',
      ru: 'Правила языка, орфография и литература.',
      en: 'Language rules, spelling, and literary works.',
    },
  },
];

// Darslar: subject = fan slug'i.
export const lessons = [
  {
    subject: 'math',
    slug: 'natural-numbers',
    order: 1,
    level: 'beginner',
    title: { uz: 'Natural sonlar', ru: 'Натуральные числа', en: 'Natural Numbers' },
    content: {
      uz: 'Natural sonlar — sanashda ishlatiladigan 1, 2, 3, ... sonlardir. Ular musbat butun sonlardan iborat.',
      ru: 'Натуральные числа — это числа 1, 2, 3, ..., используемые при счёте. Это целые положительные числа.',
      en: 'Natural numbers are the numbers 1, 2, 3, ... used for counting. They are positive whole numbers.',
    },
    examples: {
      uz: 'Masalan: 5 ta olma, 12 ta kitob. 0 natural son emas.',
      ru: 'Например: 5 яблок, 12 книг. 0 не является натуральным числом.',
      en: 'For example: 5 apples, 12 books. 0 is not a natural number.',
    },
    keyPoints: {
      uz: 'Eng kichik natural son — 1. Eng kattasi yo\'q.',
      ru: 'Наименьшее натуральное число — 1. Наибольшего нет.',
      en: 'The smallest natural number is 1. There is no largest.',
    },
  },
  {
    subject: 'math',
    slug: 'fractions',
    order: 2,
    level: 'beginner',
    title: { uz: 'Oddiy kasrlar', ru: 'Обыкновенные дроби', en: 'Fractions' },
    content: {
      uz: 'Kasr butunning bir qismini ifodalaydi. Surat (yuqori son) va maxraj (pastki son)dan iborat.',
      ru: 'Дробь выражает часть целого. Состоит из числителя (вверху) и знаменателя (внизу).',
      en: 'A fraction represents a part of a whole. It has a numerator (top) and a denominator (bottom).',
    },
    examples: {
      uz: '1/2 — yarim, 3/4 — to\'rtdan uch.',
      ru: '1/2 — половина, 3/4 — три четверти.',
      en: '1/2 is one half, 3/4 is three quarters.',
    },
    keyPoints: {
      uz: 'Maxraj hech qachon 0 bo\'lmaydi.',
      ru: 'Знаменатель никогда не равен 0.',
      en: 'The denominator is never 0.',
    },
  },
  {
    subject: 'informatics',
    slug: 'what-is-algorithm',
    order: 1,
    level: 'beginner',
    title: { uz: 'Algoritm nima?', ru: 'Что такое алгоритм?', en: 'What is an Algorithm?' },
    content: {
      uz: 'Algoritm — muammoni yechish uchun aniq, bosqichma-bosqich ketma-ketlik.',
      ru: 'Алгоритм — это чёткая пошаговая последовательность действий для решения задачи.',
      en: 'An algorithm is a clear, step-by-step sequence of actions to solve a problem.',
    },
    examples: {
      uz: 'Masalan: choy tayyorlash retsepti ham algoritm.',
      ru: 'Например: рецепт приготовления чая — тоже алгоритм.',
      en: 'For example: a recipe for making tea is also an algorithm.',
    },
    keyPoints: {
      uz: 'Algoritm aniq, chekli va bajarilishi mumkin bo\'lishi kerak.',
      ru: 'Алгоритм должен быть точным, конечным и выполнимым.',
      en: 'An algorithm must be precise, finite, and executable.',
    },
  },
  {
    subject: 'english',
    slug: 'present-simple',
    order: 1,
    level: 'beginner',
    title: { uz: 'Present Simple', ru: 'Present Simple', en: 'Present Simple' },
    content: {
      uz: 'Present Simple odatiy, takrorlanuvchi harakatlar uchun ishlatiladi.',
      ru: 'Present Simple используется для обычных, повторяющихся действий.',
      en: 'The Present Simple is used for habitual, repeated actions.',
    },
    examples: {
      uz: 'I work. She works. They play.',
      ru: 'I work. She works. They play.',
      en: 'I work. She works. They play.',
    },
    keyPoints: {
      uz: 'He/She/It bilan fe\'lga -s qo\'shiladi.',
      ru: 'С he/she/it к глаголу добавляется -s.',
      en: 'Add -s to the verb with he/she/it.',
    },
  },
  {
    subject: 'physics',
    slug: 'newton-first-law',
    order: 1,
    level: 'intermediate',
    title: { uz: 'Nyutonning birinchi qonuni', ru: 'Первый закон Ньютона', en: "Newton's First Law" },
    content: {
      uz: 'Tashqi kuch ta\'sir qilmasa, jism tinch holatda yoki to\'g\'ri chiziqli tekis harakatda qoladi.',
      ru: 'Если на тело не действует внешняя сила, оно остаётся в покое или движется равномерно и прямолинейно.',
      en: 'Without an external force, an object stays at rest or moves in a straight line at constant speed.',
    },
    examples: {
      uz: 'Avtobus to\'satdan tormozlasa, yo\'lovchi oldinga intiladi.',
      ru: 'При резком торможении автобуса пассажир наклоняется вперёд.',
      en: 'When a bus brakes suddenly, a passenger lurches forward.',
    },
    keyPoints: {
      uz: 'Bu qonun inersiya qonuni deb ham ataladi.',
      ru: 'Этот закон также называют законом инерции.',
      en: 'This law is also called the law of inertia.',
    },
  },
  {
    subject: 'chemistry',
    slug: 'atom-structure',
    order: 1,
    level: 'intermediate',
    title: { uz: 'Atom tuzilishi', ru: 'Строение атома', en: 'Atomic Structure' },
    content: {
      uz: 'Atom yadro (proton va neytron) va uning atrofidagi elektronlardan iborat.',
      ru: 'Атом состоит из ядра (протоны и нейтроны) и электронов вокруг него.',
      en: 'An atom consists of a nucleus (protons and neutrons) and electrons around it.',
    },
    examples: {
      uz: 'Vodorod atomida 1 proton va 1 elektron bor.',
      ru: 'В атоме водорода 1 протон и 1 электрон.',
      en: 'A hydrogen atom has 1 proton and 1 electron.',
    },
    keyPoints: {
      uz: 'Proton musbat, elektron manfiy zaryadli.',
      ru: 'Протон заряжен положительно, электрон — отрицательно.',
      en: 'Protons are positive, electrons are negative.',
    },
  },
  {
    subject: 'biology',
    slug: 'the-cell',
    order: 1,
    level: 'beginner',
    title: { uz: 'Hujayra', ru: 'Клетка', en: 'The Cell' },
    content: {
      uz: 'Hujayra — barcha tirik organizmlarning eng kichik tuzilish va funksional birligi.',
      ru: 'Клетка — наименьшая структурная и функциональная единица всех живых организмов.',
      en: 'The cell is the smallest structural and functional unit of all living organisms.',
    },
    examples: {
      uz: 'Odam tanasida trillionlab hujayra bor.',
      ru: 'В теле человека триллионы клеток.',
      en: 'The human body has trillions of cells.',
    },
    keyPoints: {
      uz: 'Hujayra membrana, sitoplazma va yadrodan iborat.',
      ru: 'Клетка состоит из мембраны, цитоплазмы и ядра.',
      en: 'A cell has a membrane, cytoplasm, and a nucleus.',
    },
  },
  {
    subject: 'history',
    slug: 'amir-temur',
    order: 1,
    level: 'beginner',
    title: { uz: 'Amir Temur davri', ru: 'Эпоха Амира Темура', en: 'The Era of Amir Temur' },
    content: {
      uz: 'Amir Temur (1336–1405) buyuk sarkarda bo\'lib, Samarqandni poytaxt qilgan davlat qurgan.',
      ru: 'Амир Темур (1336–1405) — великий полководец, основавший государство со столицей в Самарканде.',
      en: 'Amir Temur (1336–1405) was a great commander who built a state with Samarkand as its capital.',
    },
    examples: {
      uz: 'Samarqanddagi Registon maydoni shu davr merosi.',
      ru: 'Площадь Регистан в Самарканде — наследие той эпохи.',
      en: 'The Registan Square in Samarkand is a legacy of that era.',
    },
    keyPoints: {
      uz: 'Temuriylar davri ilm-fan va san\'at gullagan davr edi.',
      ru: 'Эпоха Темуридов — время расцвета науки и искусства.',
      en: 'The Timurid era was a time of flourishing science and art.',
    },
  },
  {
    subject: 'native-language',
    slug: 'parts-of-speech',
    order: 1,
    level: 'beginner',
    title: { uz: 'So\'z turkumlari', ru: 'Части речи', en: 'Parts of Speech' },
    content: {
      uz: 'So\'zlar ma\'nosi va vazifasiga ko\'ra turkumlarga bo\'linadi: ot, sifat, fe\'l va boshqalar.',
      ru: 'Слова делятся на части речи по значению и роли: существительное, прилагательное, глагол и др.',
      en: 'Words are grouped into parts of speech by meaning and role: noun, adjective, verb, and others.',
    },
    examples: {
      uz: 'Kitob (ot), chiroyli (sifat), o\'qidi (fe\'l).',
      ru: 'Книга (сущ.), красивый (прил.), читал (глагол).',
      en: 'Book (noun), beautiful (adjective), read (verb).',
    },
    keyPoints: {
      uz: 'Ot — predmet nomini bildiradi.',
      ru: 'Существительное обозначает название предмета.',
      en: 'A noun names a thing.',
    },
  },
];

// Testlar: subject = fan slug'i, lesson = dars slug'i (ixtiyoriy).
export const quizzes = [
  {
    subject: 'math',
    lesson: 'natural-numbers',
    level: 'beginner',
    title: { uz: 'Natural sonlar testi', ru: 'Тест: натуральные числа', en: 'Natural Numbers Quiz' },
    questions: [
      {
        prompt: { uz: 'Eng kichik natural son qaysi?', ru: 'Какое наименьшее натуральное число?', en: 'What is the smallest natural number?' },
        options: [
          { uz: '0', ru: '0', en: '0' },
          { uz: '1', ru: '1', en: '1' },
          { uz: '-1', ru: '-1', en: '-1' },
          { uz: '10', ru: '10', en: '10' },
        ],
        correctIndex: 1,
        explanation: { uz: 'Natural sonlar 1 dan boshlanadi.', ru: 'Натуральные числа начинаются с 1.', en: 'Natural numbers start from 1.' },
      },
      {
        prompt: { uz: '7 + 5 nechaga teng?', ru: 'Сколько будет 7 + 5?', en: 'What is 7 + 5?' },
        options: [
          { uz: '11', ru: '11', en: '11' },
          { uz: '12', ru: '12', en: '12' },
          { uz: '13', ru: '13', en: '13' },
          { uz: '10', ru: '10', en: '10' },
        ],
        correctIndex: 1,
        explanation: { uz: '7 ga 5 qo\'shsak 12 bo\'ladi.', ru: '7 плюс 5 равно 12.', en: '7 plus 5 equals 12.' },
      },
      {
        prompt: { uz: '0 natural sonmi?', ru: 'Является ли 0 натуральным числом?', en: 'Is 0 a natural number?' },
        options: [
          { uz: 'Ha', ru: 'Да', en: 'Yes' },
          { uz: 'Yo\'q', ru: 'Нет', en: 'No' },
        ],
        correctIndex: 1,
        explanation: { uz: '0 natural son hisoblanmaydi.', ru: '0 не считается натуральным числом.', en: '0 is not considered a natural number.' },
      },
    ],
  },
  {
    subject: 'informatics',
    lesson: 'what-is-algorithm',
    level: 'beginner',
    title: { uz: 'Algoritm testi', ru: 'Тест: алгоритм', en: 'Algorithm Quiz' },
    questions: [
      {
        prompt: { uz: 'Algoritm nima?', ru: 'Что такое алгоритм?', en: 'What is an algorithm?' },
        options: [
          { uz: 'Tasodifiy harakatlar', ru: 'Случайные действия', en: 'Random actions' },
          { uz: 'Aniq bosqichma-bosqich ketma-ketlik', ru: 'Чёткая пошаговая последовательность', en: 'A clear step-by-step sequence' },
          { uz: 'Faqat raqamlar', ru: 'Только числа', en: 'Only numbers' },
        ],
        correctIndex: 1,
        explanation: { uz: 'Algoritm — aniq bosqichlar ketma-ketligi.', ru: 'Алгоритм — последовательность чётких шагов.', en: 'An algorithm is a sequence of clear steps.' },
      },
      {
        prompt: { uz: 'Quyidagilardan qaysi biri algoritmga misol?', ru: 'Что из этого пример алгоритма?', en: 'Which of these is an example of an algorithm?' },
        options: [
          { uz: 'Ovqat retsepti', ru: 'Рецепт блюда', en: 'A cooking recipe' },
          { uz: 'Rangli rasm', ru: 'Цветная картинка', en: 'A colorful picture' },
          { uz: 'Bo\'sh varaq', ru: 'Пустой лист', en: 'A blank page' },
        ],
        correctIndex: 0,
        explanation: { uz: 'Retsept — bosqichma-bosqich ko\'rsatma, ya\'ni algoritm.', ru: 'Рецепт — пошаговая инструкция, то есть алгоритм.', en: 'A recipe is step-by-step instructions, i.e. an algorithm.' },
      },
    ],
  },
  {
    subject: 'english',
    lesson: 'present-simple',
    level: 'beginner',
    title: { uz: 'Present Simple testi', ru: 'Тест: Present Simple', en: 'Present Simple Quiz' },
    questions: [
      {
        prompt: { uz: 'To\'g\'ri variantni tanlang: She ___ to school.', ru: 'Выберите верный вариант: She ___ to school.', en: 'Choose the correct option: She ___ to school.' },
        options: [
          { uz: 'go', ru: 'go', en: 'go' },
          { uz: 'goes', ru: 'goes', en: 'goes' },
          { uz: 'going', ru: 'going', en: 'going' },
        ],
        correctIndex: 1,
        explanation: { uz: 'She bilan fe\'lga -es qo\'shiladi: goes.', ru: 'С she к глаголу добавляется -es: goes.', en: 'With she, add -es: goes.' },
      },
    ],
  },
];
