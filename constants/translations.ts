import { Language } from '../store/languageStore';

type TranslationKeys =
  // Navigation & Tabs
  | 'home'
  | 'lists'
  | 'learn'
  | 'progress'
  | 'settings'
  | 'learner'

  // Auth
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'displayName'
  | 'createAccount'
  | 'alreadyHaveAccount'
  | 'dontHaveAccount'
  | 'resetPassword'
  | 'sendResetLink'

  // Home
  | 'welcome'
  | 'readyToLearn'
  | 'todaysProgress'
  | 'wordsLearned'
  | 'wordsReviewed'
  | 'quizAccuracy'
  | 'quickActions'
  | 'practice'
  | 'startLearningSession'
  | 'createList'
  | 'createNewList'
  | 'recentLists'
  | 'seeAll'

  // Lists
  | 'myLists'
  | 'searchLists'
  | 'noListsYet'
  | 'createYourFirstList'
  | 'listDetails'
  | 'words'
  | 'addWord'
  | 'editList'
  | 'deleteList'
  | 'confirmDeleteList'
  | 'listDeleted'
  | 'term'
  | 'definition'
  | 'example'
  | 'addExample'
  | 'optional'
  | 'save'
  | 'cancel'
  | 'delete'
  | 'edit'
  | 'noWordsYet'
  | 'addYourFirstWord'
  | 'searchWords'
  | 'listTitle'
  | 'listDescription'
  | 'targetLanguage'

  // Learn
  | 'learningModes'
  | 'chooseLearningMode'
  | 'selectHowToPractice'
  | 'flashcards'
  | 'reviewWordsWithFlashcards'
  | 'multipleChoice'
  | 'testKnowledgeWithMultipleChoice'
  | 'fillInTheBlanks'
  | 'completeSentencesWithWords'
  | 'quickQuiz'
  | 'takeQuickQuiz'
  | 'yourLists'
  | 'specialFeatures'
  | 'geoVocab'
  | 'learnBasedOnLocation'
  | 'emojiMood'
  | 'learnEmotionVocabulary'
  | 'listStats'
  | 'mastered'
  | 'learning'
  | 'new'
  | 'backToList'

  // Flashcards
  | 'card'
  | 'of'
  | 'tapToFlip'
  | 'iDontKnow'
  | 'iKnowThis'
  | 'greatJob'
  | 'reviewedAllWords'
  | 'wordsYouKnew'
  | 'practiceAgain'

  // Quiz
  | 'question'
  | 'whatIsDefinitionOf'
  | 'checkAnswer'
  | 'nextQuestion'
  | 'quizComplete'
  | 'yourScore'
  | 'tryAgain'
  | 'excellentWork'
  | 'goodJob'
  | 'keepPracticing'
  | 'fillInBlank'
  | 'typeAnswerHere'
  | 'correct'
  | 'incorrect'
  | 'correctAnswerIs'
  | 'exerciseComplete'

  // Progress
  | 'yourProgress'
  | 'streak'
  | 'quizzesTaken'
  | 'dailyActivity'
  | 'overallProgress'
  | 'days'
  | 'learned'
  | 'reviewed'

  // Settings
  | 'appSettings'
  | 'account'
  | 'appearance'
  | 'notifications'
  | 'language'
  | 'about'
  | 'signOut'
  | 'theme'
  | 'darkMode'
  | 'lightMode'
  | 'systemDefault'
  | 'english'
  | 'turkish'
  | 'version'
  | 'privacyPolicy'
  | 'termsOfService'
  | 'contactUs'

  // Common
  | 'loading'
  | 'error'
  | 'retry'
  | 'goBack'
  | 'continue'
  | 'done'
  | 'search'
  | 'noResults'
  | 'noResultsFound'
  | 'tryDifferentSearch';

type Translations = {
  [key in Language]: {
    [key in TranslationKeys]: string;
  };
};

export const translations: Translations = {
  en: {
    // Navigation & Tabs
    home: 'Home',
    lists: 'Lists',
    learn: 'Learn',
    progress: 'Progress',
    settings: 'Settings',
    learner: 'Learner',

    // Auth
    login: 'Log In',
    register: 'Register',
    forgotPassword: 'Forgot Password',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    displayName: 'Display Name',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    resetPassword: 'Reset Password',
    sendResetLink: 'Send Reset Link',

    // Home
    welcome: 'Welcome',
    readyToLearn: 'Ready to learn something new today?',
    todaysProgress: 'Today\'s Progress',
    wordsLearned: 'Words Learned',
    wordsReviewed: 'Words Reviewed',
    quizAccuracy: 'Quiz Accuracy',
    quickActions: 'Quick Actions',
    practice: 'Practice',
    startLearningSession: 'Start a learning session',
    createList: 'Create List',
    createNewList: 'Create a new word list',
    recentLists: 'Recent Lists',
    seeAll: 'See All',

    // Lists
    myLists: 'My Lists',
    searchLists: 'Search lists',
    noListsYet: 'No Lists Yet',
    createYourFirstList: 'Create your first word list',
    listDetails: 'List Details',
    words: 'Words',
    addWord: 'Add Word',
    editList: 'Edit List',
    deleteList: 'Delete List',
    confirmDeleteList: 'Are you sure you want to delete this list?',
    listDeleted: 'List deleted successfully',
    term: 'Term',
    definition: 'Definition',
    example: 'Example',
    addExample: 'Add an example',
    optional: 'Optional',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    noWordsYet: 'No Words Yet',
    addYourFirstWord: 'Add your first word to start learning',
    searchWords: 'Search words',
    listTitle: 'List Title',
    listDescription: 'List Description',
    targetLanguage: 'Target Language',

    // Learn
    learningModes: 'Learning Modes',
    chooseLearningMode: 'Choose Learning Mode',
    selectHowToPractice: 'Select how you want to practice',
    flashcards: 'Flashcards',
    reviewWordsWithFlashcards: 'Review words with interactive flashcards',
    multipleChoice: 'Multiple Choice',
    testKnowledgeWithMultipleChoice: 'Test your knowledge with multiple choice questions',
    fillInTheBlanks: 'Fill in the Blanks',
    completeSentencesWithWords: 'Complete sentences with the correct words',
    quickQuiz: 'Quick Quiz',
    takeQuickQuiz: 'Take a quick 5-question quiz',
    yourLists: 'Your Lists',
    specialFeatures: 'Special Features',
    geoVocab: 'GeoVocab',
    learnBasedOnLocation: 'Learn words based on your location',
    emojiMood: 'Emotion Words',
    learnEmotionVocabulary: 'Learn vocabulary related to emotions',
    listStats: 'List Stats',
    mastered: 'Mastered',
    learning: 'Learning',
    new: 'New',
    backToList: 'Back to List',

    // Flashcards
    card: 'Card',
    of: 'of',
    tapToFlip: 'Tap to flip',
    iDontKnow: 'I Don\'t Know',
    iKnowThis: 'I Know This',
    greatJob: 'Great Job!',
    reviewedAllWords: 'You\'ve reviewed all words',
    wordsYouKnew: 'Words you knew',
    practiceAgain: 'Practice Again',

    // Quiz
    question: 'Question',
    whatIsDefinitionOf: 'What is the definition of:',
    checkAnswer: 'Check Answer',
    nextQuestion: 'Next Question',
    quizComplete: 'Quiz Complete!',
    yourScore: 'Your Score',
    tryAgain: 'Try Again',
    excellentWork: 'Excellent work! You\'re mastering these words.',
    goodJob: 'Good job! Keep practicing to improve.',
    keepPracticing: 'Keep practicing! You\'ll get better with time.',
    fillInBlank: 'Fill in the blank with the correct word:',
    typeAnswerHere: 'Type your answer here',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    correctAnswerIs: 'The correct answer is:',
    exerciseComplete: 'Exercise Complete!',

    // Progress
    yourProgress: 'Your Progress',
    streak: 'Streak',
    quizzesTaken: 'Quizzes Taken',
    dailyActivity: 'Daily Activity',
    overallProgress: 'Overall Progress',
    days: 'days',
    learned: 'learned',
    reviewed: 'reviewed',

    // Settings
    appSettings: 'App Settings',
    account: 'Account',
    appearance: 'Appearance',
    notifications: 'Notifications',
    language: 'Language',
    about: 'About',
    signOut: 'Sign Out',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemDefault: 'System Default',
    english: 'English',
    turkish: 'Turkish',
    version: 'Version',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contactUs: 'Contact Us',

    // Common
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    goBack: 'Go Back',
    continue: 'Continue',
    done: 'Done',
    search: 'Search',
    noResults: 'No Results',
    noResultsFound: 'No results found',
    tryDifferentSearch: 'Try a different search term'
  },

  tr: {
    // Navigation & Tabs
    home: 'Ana Sayfa',
    lists: 'Listeler',
    learn: 'Öğren',
    progress: 'İlerleme',
    settings: 'Ayarlar',
    learner: 'Öğrenci',

    // Auth
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    forgotPassword: 'Şifremi Unuttum',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifreyi Onayla',
    displayName: 'Görünen Ad',
    createAccount: 'Hesap Oluştur',
    alreadyHaveAccount: 'Zaten hesabınız var mı?',
    dontHaveAccount: 'Hesabınız yok mu?',
    resetPassword: 'Şifreyi Sıfırla',
    sendResetLink: 'Sıfırlama Bağlantısı Gönder',

    // Home
    welcome: 'Hoş Geldiniz',
    readyToLearn: 'Bugün yeni bir şey öğrenmeye hazır mısınız?',
    todaysProgress: 'Bugünkü İlerleme',
    wordsLearned: 'Öğrenilen Kelimeler',
    wordsReviewed: 'Gözden Geçirilen Kelimeler',
    quizAccuracy: 'Quiz Doğruluğu',
    quickActions: 'Hızlı İşlemler',
    practice: 'Pratik Yap',
    startLearningSession: 'Öğrenme oturumu başlat',
    createList: 'Liste Oluştur',
    createNewList: 'Yeni kelime listesi oluştur',
    recentLists: 'Son Listeler',
    seeAll: 'Tümünü Gör',

    // Lists
    myLists: 'Listelerim',
    searchLists: 'Listelerde ara',
    noListsYet: 'Henüz Liste Yok',
    createYourFirstList: 'İlk kelime listenizi oluşturun',
    listDetails: 'Liste Detayları',
    words: 'Kelimeler',
    addWord: 'Kelime Ekle',
    editList: 'Listeyi Düzenle',
    deleteList: 'Listeyi Sil',
    confirmDeleteList: 'Bu listeyi silmek istediğinizden emin misiniz?',
    listDeleted: 'Liste başarıyla silindi',
    term: 'Terim',
    definition: 'Tanım',
    example: 'Örnek',
    addExample: 'Örnek ekle',
    optional: 'İsteğe bağlı',
    save: 'Kaydet',
    cancel: 'İptal',
    delete: 'Sil',
    edit: 'Düzenle',
    noWordsYet: 'Henüz Kelime Yok',
    addYourFirstWord: 'Öğrenmeye başlamak için ilk kelimenizi ekleyin',
    searchWords: 'Kelimelerde ara',
    listTitle: 'Liste Başlığı',
    listDescription: 'Liste Açıklaması',
    targetLanguage: 'Hedef Dil',

    // Learn
    learningModes: 'Öğrenme Modları',
    chooseLearningMode: 'Öğrenme Modu Seçin',
    selectHowToPractice: 'Nasıl pratik yapmak istediğinizi seçin',
    flashcards: 'Kartlar',
    reviewWordsWithFlashcards: 'Etkileşimli kartlarla kelimeleri gözden geçirin',
    multipleChoice: 'Çoktan Seçmeli',
    testKnowledgeWithMultipleChoice: 'Çoktan seçmeli sorularla bilginizi test edin',
    fillInTheBlanks: 'Boşluk Doldurma',
    completeSentencesWithWords: 'Cümleleri doğru kelimelerle tamamlayın',
    quickQuiz: 'Hızlı Quiz',
    takeQuickQuiz: '5 soruluk hızlı bir quiz yapın',
    yourLists: 'Listeleriniz',
    specialFeatures: 'Özel Özellikler',
    geoVocab: 'Konum Kelimeleri',
    learnBasedOnLocation: 'Konumunuza göre kelimeler öğrenin',
    emojiMood: 'Emotion Words',
    learnEmotionVocabulary: 'Learn vocabulary related to emotions',
    listStats: 'Liste İstatistikleri',
    mastered: 'Ustalaşılan',
    learning: 'Öğrenilen',
    new: 'Yeni',
    backToList: 'Listeye Dön',

    // Flashcards
    card: 'Kart',
    of: '/',
    tapToFlip: 'Çevirmek için dokun',
    iDontKnow: 'Bilmiyorum',
    iKnowThis: 'Bunu Biliyorum',
    greatJob: 'Harika İş!',
    reviewedAllWords: 'Tüm kelimeleri gözden geçirdiniz',
    wordsYouKnew: 'Bildiğiniz kelimeler',
    practiceAgain: 'Tekrar Pratik Yap',

    // Quiz
    question: 'Soru',
    whatIsDefinitionOf: 'Tanımı nedir:',
    checkAnswer: 'Cevabı Kontrol Et',
    nextQuestion: 'Sonraki Soru',
    quizComplete: 'Quiz Tamamlandı!',
    yourScore: 'Puanınız',
    tryAgain: 'Tekrar Dene',
    excellentWork: 'Mükemmel iş! Bu kelimelerde ustalaşıyorsunuz.',
    goodJob: 'İyi iş! Geliştirmek için pratik yapmaya devam edin.',
    keepPracticing: 'Pratik yapmaya devam edin! Zamanla daha iyi olacaksınız.',
    fillInBlank: 'Boşluğu doğru kelimeyle doldurun:',
    typeAnswerHere: 'Cevabınızı buraya yazın',
    correct: 'Doğru!',
    incorrect: 'Yanlış',
    correctAnswerIs: 'Doğru cevap:',
    exerciseComplete: 'Alıştırma Tamamlandı!',

    // Progress
    yourProgress: 'İlerlemeniz',
    streak: 'Seri',
    quizzesTaken: 'Yapılan Quizler',
    dailyActivity: 'Günlük Aktivite',
    overallProgress: 'Genel İlerleme',
    days: 'gün',
    learned: 'öğrenildi',
    reviewed: 'gözden geçirildi',

    // Settings
    appSettings: 'Uygulama Ayarları',
    account: 'Hesap',
    appearance: 'Görünüm',
    notifications: 'Bildirimler',
    language: 'Dil',
    about: 'Hakkında',
    signOut: 'Çıkış Yap',
    theme: 'Tema',
    darkMode: 'Karanlık Mod',
    lightMode: 'Aydınlık Mod',
    systemDefault: 'Sistem Varsayılanı',
    english: 'İngilizce',
    turkish: 'Türkçe',
    version: 'Sürüm',
    privacyPolicy: 'Gizlilik Politikası',
    termsOfService: 'Kullanım Şartları',
    contactUs: 'Bize Ulaşın',

    // Common
    loading: 'Yükleniyor...',
    error: 'Hata',
    retry: 'Tekrar Dene',
    goBack: 'Geri Dön',
    continue: 'Devam Et',
    done: 'Tamam',
    search: 'Ara',
    noResults: 'Sonuç Yok',
    noResultsFound: 'Sonuç bulunamadı',
    tryDifferentSearch: 'Farklı bir arama terimi deneyin'
  }
};

export const useTranslation = (language: Language) => {
  return (key: TranslationKeys): string => {
    return translations[language][key];
  };
};
