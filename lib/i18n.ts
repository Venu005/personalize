import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Define the supported languages
export const languages = {
  en: { nativeName: "English" },
  hi: { nativeName: "हिन्दी" },
  pt: { nativeName: "Português" },
  es: { nativeName: "Español" },
  fr: { nativeName: "Français" },
};

// Define the resources with translations
const resources = {
  en: {
    translation: {
      // Common
      "app.title": "Personalized Dashboard",
      "app.description":
        "Your personalized content dashboard with news, recommendations, and social feeds",
      "app.name": "PersonalDash",
      "app.name.short": "PD",

      // Navigation
      "nav.home": "Home",
      "nav.news": "News",
      "nav.movies": "Movies",
      "nav.social": "Social",
      "nav.trending": "Trending",
      "nav.favorites": "Favorites",
      "nav.settings": "Settings",
      "nav.profile": "Profile",
      "nav.search": "Search",
      "nav.analytics": "Analytics",

      // Sidebar
      "sidebar.main": "Main",
      "sidebar.content": "Content",
      "sidebar.account": "Account",

      // Settings
      "settings.title": "Settings",
      "settings.description":
        "Customize your content preferences and dashboard settings.",
      "settings.language": "Language",
      "settings.language.description": "Select your preferred language",
      "settings.save": "Save Changes",
      "settings.reset": "Reset to Defaults",
      "settings.unsaved": "You have unsaved changes",

      // Content
      "content.noContent": "No content available",
      "content.loading": "Loading content...",
      "content.refresh": "Refresh",
      "content.customize": "Customize",
      "content.endReached": "You've reached the end",
      "content.loadFresh": "Load Fresh Content",
      "content.noContentFound": "No content found",
      "content.tryAdjusting": "Try adjusting your preferences to see more content in your feed.",
      "content.updatePreferences": "Update Preferences",
      "content.personalizedFeed": "Your Personalized Feed",
      "content.more": "more",

      // Notifications
      "notifications.success": "Settings saved successfully!",
      "notifications.error": "Failed to save preferences. Please try again.",
      "notifications.loading": "Saving preferences...",
      "notifications.reset": "Settings reset to defaults",
      "notifications.title": "Notifications",

      // User Menu
      "user.login": "Login",
      "user.profile": "Profile",
      "user.settings": "Settings",
      "user.logout": "Log out",

      // Welcome Dialog
      "welcome.title": "Welcome to PersonalDash! 🎉",
      "welcome.description": "Get personalized content from news, movies, and social media all in one place.",
      "welcome.customize": "Let's customize your experience by selecting your interests.",
      "welcome.getStarted": "Get Started",
      "welcome.chooseInterests": "Choose Your Interests",
      "welcome.newsCategories": "News Categories",
      "welcome.movieGenres": "Movie Genres",
      "welcome.socialTopics": "Social Topics",
      "welcome.back": "Back",
      "welcome.complete": "Complete Setup",

      // Home Page
      "home.welcomeBack": "Welcome back",
      "home.feedDescription": "Here's what's happening in your personalized feed today.",

      // Trending Section
      "trending.title": "Trending Now",
      "trending.technology": "Technology",
      "trending.movies": "Movies",
      "trending.social": "Social",
      "trending.environment": "Environment",

      // Favorites Section
      "favorites.title": "Favorites",
      "favorites.news": "News",
      "favorites.movies": "Movies",
      "favorites.social": "Social",
      "favorites.noFavorites": "No favorites yet",
      "favorites.startHearting": "Start hearting content you love!",
      "favorites.recentFavorites": "Recent Favorites",

      // Search Dialog
      "search.placeholder": "Search across all content...",
      "search.recentSearches": "Recent Searches",
      "search.clear": "Clear",
      "search.trendingSearches": "Trending Searches",
      "search.searchTips": "Search Tips",
      "search.tip1": "Use quotes for exact phrases: \"artificial intelligence\"",
      "search.tip2": "Search by category: news, movies, or social",
      "search.tip3": "Try different keywords for better results",
      "search.all": "All",
      "search.news": "News",
      "search.movies": "Movies",
      "search.social": "Social",
      "search.searching": "Searching across all content...",
      "search.noResults": "No results found",
      "search.tryDifferent": "Try different keywords or check your spelling",
      "search.resultsFound": "Found {{count}} result(s) for \"{{query}}\"",
      "search.filter": "Filter",

      // Header
      "header.toggleSidebar": "Toggle sidebar",
      "header.searchPlaceholder": "Search news, movies, social posts...",
      "header.popularSearches": "Popular searches:",
      "header.aiTechnology": "AI technology",
      "header.latestMovies": "Latest movies",
      "header.techTrends": "Tech trends",
      "header.breakingNews": "Breaking news",
      "header.notifications": "Notifications",
    },
  },
  hi: {
    translation: {
      // Common
      "app.title": "व्यक्तिगत डैशबोर्ड",
      "app.description":
        "समाचार, अनुशंसाओं और सोशल फीड के साथ आपका व्यक्तिगत सामग्री डैशबोर्ड",
      "app.name": "पर्सनलडैश",
      "app.name.short": "पीडी",

      // Navigation
      "nav.home": "होम",
      "nav.news": "समाचार",
      "nav.movies": "फिल्में",
      "nav.social": "सोशल",
      "nav.trending": "ट्रेंडिंग",
      "nav.favorites": "पसंदीदा",
      "nav.settings": "सेटिंग्स",
      "nav.profile": "प्रोफाइल",
      "nav.search": "खोज",
      "nav.analytics": "विश्लेषिकी",

      // Sidebar
      "sidebar.main": "मुख्य",
      "sidebar.content": "सामग्री",
      "sidebar.account": "खाता",

      // Settings
      "settings.title": "सेटिंग्स",
      "settings.description":
        "अपनी सामग्री प्राथमिकताओं और डैशबोर्ड सेटिंग्स को अनुकूलित करें।",
      "settings.language": "भाषा",
      "settings.language.description": "अपनी पसंदीदा भाषा चुनें",
      "settings.save": "परिवर्तन सहेजें",
      "settings.reset": "डिफ़ॉल्ट पर रीसेट करें",
      "settings.unsaved": "आपके पास असहेजे गए परिवर्तन हैं",

      // Content
      "content.noContent": "कोई सामग्री उपलब्ध नहीं है",
      "content.loading": "सामग्री लोड हो रही है...",
      "content.refresh": "रीफ्रेश",
      "content.customize": "अनुकूलित करें",
      "content.endReached": "आप अंत तक पहुंच गए हैं",
      "content.loadFresh": "ताज़ा सामग्री लोड करें",
      "content.noContentFound": "कोई सामग्री नहीं मिली",
      "content.tryAdjusting": "अपनी फ़ीड में अधिक सामग्री देखने के लिए अपनी प्राथमिकताओं को समायोजित करने का प्रयास करें।",
      "content.updatePreferences": "प्राथमिकताएँ अपडेट करें",
      "content.personalizedFeed": "आपकी व्यक्तिगत फ़ीड",
      "content.more": "अधिक",

      // Notifications
      "notifications.success": "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
      "notifications.error":
        "प्राथमिकताएँ सहेजने में विफल। कृपया पुनः प्रयास करें।",
      "notifications.loading": "प्राथमिकताएँ सहेज रहा है...",
      "notifications.reset": "सेटिंग्स डिफ़ॉल्ट पर रीसेट की गईं",
      "notifications.title": "सूचनाएँ",

      // User Menu
      "user.login": "लॉगिन",
      "user.profile": "प्रोफाइल",
      "user.settings": "सेटिंग्स",
      "user.logout": "लॉग आउट",

      // Welcome Dialog
      "welcome.title": "पर्सनलडैश में आपका स्वागत है! 🎉",
      "welcome.description": "समाचार, फिल्मों और सोशल मीडिया से व्यक्तिगत सामग्री एक ही स्थान पर प्राप्त करें।",
      "welcome.customize": "अपनी रुचियों का चयन करके अपने अनुभव को अनुकूलित करें।",
      "welcome.getStarted": "शुरू करें",
      "welcome.chooseInterests": "अपनी रुचियाँ चुनें",
      "welcome.newsCategories": "समाचार श्रेणियाँ",
      "welcome.movieGenres": "फिल्म शैलियाँ",
      "welcome.socialTopics": "सोशल विषय",
      "welcome.back": "वापस",
      "welcome.complete": "सेटअप पूरा करें",

      // Home Page
      "home.welcomeBack": "वापसी पर स्वागत है",
      "home.feedDescription": "आज आपकी व्यक्तिगत फ़ीड में क्या हो रहा है।",

      // Trending Section
      "trending.title": "अभी ट्रेंडिंग",
      "trending.technology": "प्रौद्योगिकी",
      "trending.movies": "फिल्में",
      "trending.social": "सोशल",
      "trending.environment": "पर्यावरण",

      // Favorites Section
      "favorites.title": "पसंदीदा",
      "favorites.news": "समाचार",
      "favorites.movies": "फिल्में",
      "favorites.social": "सोशल",
      "favorites.noFavorites": "अभी तक कोई पसंदीदा नहीं",
      "favorites.startHearting": "अपनी पसंदीदा सामग्री को हार्ट करना शुरू करें!",
      "favorites.recentFavorites": "हाल के पसंदीदा",

      // Search Dialog
      "search.placeholder": "सभी सामग्री में खोजें...",
      "search.recentSearches": "हाल की खोजें",
      "search.clear": "साफ़ करें",
      "search.trendingSearches": "ट्रेंडिंग खोजें",
      "search.searchTips": "खोज टिप्स",
      "search.tip1": "सटीक वाक्यांशों के लिए उद्धरण का उपयोग करें: \"आर्टिफिशियल इंटेलिजेंस\"",
      "search.tip2": "श्रेणी द्वारा खोजें: समाचार, फिल्में, या सोशल",
      "search.tip3": "बेहतर परिणामों के लिए अलग-अलग कीवर्ड आज़माएँ",
      "search.all": "सभी",
      "search.news": "समाचार",
      "search.movies": "फिल्में",
      "search.social": "सोशल",
      "search.searching": "सभी सामग्री में खोज रहा है...",
      "search.noResults": "कोई परिणाम नहीं मिला",
      "search.tryDifferent": "अलग कीवर्ड आज़माएँ या अपनी वर्तनी जांचें",
      "search.resultsFound": "\"{{query}}\" के लिए {{count}} परिणाम मिले",
      "search.filter": "फ़िल्टर",

      // Header
      "header.toggleSidebar": "साइडबार टॉगल करें",
      "header.searchPlaceholder": "समाचार, फिल्में, सोशल पोस्ट खोजें...",
      "header.popularSearches": "लोकप्रिय खोजें:",
      "header.aiTechnology": "एआई प्रौद्योगिकी",
      "header.latestMovies": "नवीनतम फिल्में",
      "header.techTrends": "टेक ट्रेंड्स",
      "header.breakingNews": "ब्रेकिंग न्यूज़",
      "header.notifications": "सूचनाएँ",
    },
  },
  pt: {
    translation: {
      // Common
      "app.title": "Painel Personalizado",
      "app.description":
        "Seu painel de conteúdo personalizado com notícias, recomendações e feeds sociais",
      "app.name": "PersonalDash",
      "app.name.short": "PD",

      // Navigation
      "nav.home": "Início",
      "nav.news": "Notícias",
      "nav.movies": "Filmes",
      "nav.social": "Social",
      "nav.trending": "Tendências",
      "nav.favorites": "Favoritos",
      "nav.settings": "Configurações",
      "nav.profile": "Perfil",
      "nav.search": "Pesquisar",
      "nav.analytics": "Análises",

      // Sidebar
      "sidebar.main": "Principal",
      "sidebar.content": "Conteúdo",
      "sidebar.account": "Conta",

      // Settings
      "settings.title": "Configurações",
      "settings.description":
        "Personalize suas preferências de conteúdo e configurações do painel.",
      "settings.language": "Idioma",
      "settings.language.description": "Selecione seu idioma preferido",
      "settings.save": "Salvar Alterações",
      "settings.reset": "Restaurar Padrões",
      "settings.unsaved": "Você tem alterações não salvas",

      // Content
      "content.noContent": "Nenhum conteúdo disponível",
      "content.loading": "Carregando conteúdo...",
      "content.refresh": "Atualizar",
      "content.customize": "Personalizar",
      "content.endReached": "Você chegou ao fim",
      "content.loadFresh": "Carregar Conteúdo Novo",
      "content.noContentFound": "Nenhum conteúdo encontrado",
      "content.tryAdjusting": "Tente ajustar suas preferências para ver mais conteúdo em seu feed.",
      "content.updatePreferences": "Atualizar Preferências",
      "content.personalizedFeed": "Seu Feed Personalizado",
      "content.more": "mais",

      // Notifications
      "notifications.success": "Configurações salvas com sucesso!",
      "notifications.error":
        "Falha ao salvar preferências. Por favor, tente novamente.",
      "notifications.loading": "Salvando preferências...",
      "notifications.reset": "Configurações restauradas para os padrões",
      "notifications.title": "Notificações",

      // User Menu
      "user.login": "Entrar",
      "user.profile": "Perfil",
      "user.settings": "Configurações",
      "user.logout": "Sair",

      // Welcome Dialog
      "welcome.title": "Bem-vindo ao PersonalDash! 🎉",
      "welcome.description": "Obtenha conteúdo personalizado de notícias, filmes e mídias sociais em um só lugar.",
      "welcome.customize": "Vamos personalizar sua experiência selecionando seus interesses.",
      "welcome.getStarted": "Começar",
      "welcome.chooseInterests": "Escolha Seus Interesses",
      "welcome.newsCategories": "Categorias de Notícias",
      "welcome.movieGenres": "Gêneros de Filmes",
      "welcome.socialTopics": "Tópicos Sociais",
      "welcome.back": "Voltar",
      "welcome.complete": "Concluir Configuração",

      // Home Page
      "home.welcomeBack": "Bem-vindo de volta",
      "home.feedDescription": "Aqui está o que está acontecendo em seu feed personalizado hoje.",

      // Trending Section
      "trending.title": "Em Alta Agora",
      "trending.technology": "Tecnologia",
      "trending.movies": "Filmes",
      "trending.social": "Social",
      "trending.environment": "Meio Ambiente",

      // Favorites Section
      "favorites.title": "Favoritos",
      "favorites.news": "Notícias",
      "favorites.movies": "Filmes",
      "favorites.social": "Social",
      "favorites.noFavorites": "Nenhum favorito ainda",
      "favorites.startHearting": "Comece a curtir o conteúdo que você ama!",
      "favorites.recentFavorites": "Favoritos Recentes",

      // Search Dialog
      "search.placeholder": "Pesquisar em todo o conteúdo...",
      "search.recentSearches": "Pesquisas Recentes",
      "search.clear": "Limpar",
      "search.trendingSearches": "Pesquisas em Alta",
      "search.searchTips": "Dicas de Pesquisa",
      "search.tip1": "Use aspas para frases exatas: \"inteligência artificial\"",
      "search.tip2": "Pesquise por categoria: notícias, filmes ou social",
      "search.tip3": "Tente palavras-chave diferentes para melhores resultados",
      "search.all": "Todos",
      "search.news": "Notícias",
      "search.movies": "Filmes",
      "search.social": "Social",
      "search.searching": "Pesquisando em todo o conteúdo...",
      "search.noResults": "Nenhum resultado encontrado",
      "search.tryDifferent": "Tente palavras-chave diferentes ou verifique sua ortografia",
      "search.resultsFound": "Encontrado {{count}} resultado(s) para \"{{query}}\"",
      "search.filter": "Filtrar",

      // Header
      "header.toggleSidebar": "Alternar barra lateral",
      "header.searchPlaceholder": "Pesquisar notícias, filmes, posts sociais...",
      "header.popularSearches": "Pesquisas populares:",
      "header.aiTechnology": "Tecnologia IA",
      "header.latestMovies": "Filmes recentes",
      "header.techTrends": "Tendências de tecnologia",
      "header.breakingNews": "Últimas notícias",
      "header.notifications": "Notificações",
    },
  },
  es: {
    translation: {
      // Common
      "app.title": "Panel Personalizado",
      "app.description":
        "Tu panel de contenido personalizado con noticias, recomendaciones y feeds sociales",
      "app.name": "PersonalDash",
      "app.name.short": "PD",

      // Navigation
      "nav.home": "Inicio",
      "nav.news": "Noticias",
      "nav.movies": "Películas",
      "nav.social": "Social",
      "nav.trending": "Tendencias",
      "nav.favorites": "Favoritos",
      "nav.settings": "Configuración",
      "nav.profile": "Perfil",
      "nav.search": "Buscar",
      "nav.analytics": "Análisis",

      // Sidebar
      "sidebar.main": "Principal",
      "sidebar.content": "Contenido",
      "sidebar.account": "Cuenta",

      // Settings
      "settings.title": "Configuración",
      "settings.description":
        "Personaliza tus preferencias de contenido y configuración del panel.",
      "settings.language": "Idioma",
      "settings.language.description": "Selecciona tu idioma preferido",
      "settings.save": "Guardar Cambios",
      "settings.reset": "Restablecer Valores Predeterminados",
      "settings.unsaved": "Tienes cambios sin guardar",

      // Content
      "content.noContent": "No hay contenido disponible",
      "content.loading": "Cargando contenido...",
      "content.refresh": "Actualizar",
      "content.customize": "Personalizar",
      "content.endReached": "Has llegado al final",
      "content.loadFresh": "Cargar Contenido Nuevo",
      "content.noContentFound": "No se encontró contenido",
      "content.tryAdjusting": "Intenta ajustar tus preferencias para ver más contenido en tu feed.",
      "content.updatePreferences": "Actualizar Preferencias",
      "content.personalizedFeed": "Tu Feed Personalizado",
      "content.more": "más",

      // Notifications
      "notifications.success": "¡Configuración guardada con éxito!",
      "notifications.error":
        "Error al guardar preferencias. Por favor, inténtalo de nuevo.",
      "notifications.loading": "Guardando preferencias...",
      "notifications.reset":
        "Configuración restablecida a valores predeterminados",
      "notifications.title": "Notificaciones",

      // User Menu
      "user.login": "Iniciar sesión",
      "user.profile": "Perfil",
      "user.settings": "Configuración",
      "user.logout": "Cerrar sesión",

      // Welcome Dialog
      "welcome.title": "¡Bienvenido a PersonalDash! 🎉",
      "welcome.description": "Obtén contenido personalizado de noticias, películas y redes sociales en un solo lugar.",
      "welcome.customize": "Personalicemos tu experiencia seleccionando tus intereses.",
      "welcome.getStarted": "Comenzar",
      "welcome.chooseInterests": "Elige Tus Intereses",
      "welcome.newsCategories": "Categorías de Noticias",
      "welcome.movieGenres": "Géneros de Películas",
      "welcome.socialTopics": "Temas Sociales",
      "welcome.back": "Atrás",
      "welcome.complete": "Completar Configuración",

      // Home Page
      "home.welcomeBack": "Bienvenido de nuevo",
      "home.feedDescription": "Esto es lo que está sucediendo en tu feed personalizado hoy.",

      // Trending Section
      "trending.title": "Tendencias Ahora",
      "trending.technology": "Tecnología",
      "trending.movies": "Películas",
      "trending.social": "Social",
      "trending.environment": "Medio Ambiente",

      // Favorites Section
      "favorites.title": "Favoritos",
      "favorites.news": "Noticias",
      "favorites.movies": "Películas",
      "favorites.social": "Social",
      "favorites.noFavorites": "Aún no hay favoritos",
      "favorites.startHearting": "¡Comienza a marcar como favorito el contenido que te gusta!",
      "favorites.recentFavorites": "Favoritos Recientes",

      // Search Dialog
      "search.placeholder": "Buscar en todo el contenido...",
      "search.recentSearches": "Búsquedas Recientes",
      "search.clear": "Limpiar",
      "search.trendingSearches": "Búsquedas Tendencia",
      "search.searchTips": "Consejos de Búsqueda",
      "search.tip1": "Usa comillas para frases exactas: \"inteligencia artificial\"",
      "search.tip2": "Busca por categoría: noticias, películas o social",
      "search.tip3": "Prueba diferentes palabras clave para mejores resultados",
      "search.all": "Todo",
      "search.news": "Noticias",
      "search.movies": "Películas",
      "search.social": "Social",
      "search.searching": "Buscando en todo el contenido...",
      "search.noResults": "No se encontraron resultados",
      "search.tryDifferent": "Prueba diferentes palabras clave o revisa tu ortografía",
      "search.resultsFound": "Se encontraron {{count}} resultado(s) para \"{{query}}\"",
      "search.filter": "Filtrar",

      // Header
      "header.toggleSidebar": "Alternar barra lateral",
      "header.searchPlaceholder": "Buscar noticias, películas, publicaciones sociales...",
      "header.popularSearches": "Búsquedas populares:",
      "header.aiTechnology": "Tecnología IA",
      "header.latestMovies": "Últimas películas",
      "header.techTrends": "Tendencias tecnológicas",
      "header.breakingNews": "Noticias de última hora",
      "header.notifications": "Notificaciones",
    },
  },
  fr: {
    translation: {
      // Common
      "app.title": "Tableau de Bord Personnalisé",
      "app.description":
        "Votre tableau de bord de contenu personnalisé avec des actualités, des recommandations et des flux sociaux",
      "app.name": "PersonalDash",
      "app.name.short": "PD",

      // Navigation
      "nav.home": "Accueil",
      "nav.news": "Actualités",
      "nav.movies": "Films",
      "nav.social": "Social",
      "nav.trending": "Tendances",
      "nav.favorites": "Favoris",
      "nav.settings": "Paramètres",
      "nav.profile": "Profil",
      "nav.search": "Rechercher",
      "nav.analytics": "Analyses",

      // Sidebar
      "sidebar.main": "Principal",
      "sidebar.content": "Contenu",
      "sidebar.account": "Compte",

      // Settings
      "settings.title": "Paramètres",
      "settings.description":
        "Personnalisez vos préférences de contenu et les paramètres du tableau de bord.",
      "settings.language": "Langue",
      "settings.language.description": "Sélectionnez votre langue préférée",
      "settings.save": "Enregistrer les Modifications",
      "settings.reset": "Réinitialiser aux Valeurs par Défaut",
      "settings.unsaved": "Vous avez des modifications non enregistrées",

      // Content
      "content.noContent": "Aucun contenu disponible",
      "content.loading": "Chargement du contenu...",
      "content.refresh": "Actualiser",
      "content.customize": "Personnaliser",
      "content.endReached": "Vous avez atteint la fin",
      "content.loadFresh": "Charger du Contenu Frais",
      "content.noContentFound": "Aucun contenu trouvé",
      "content.tryAdjusting": "Essayez d'ajuster vos préférences pour voir plus de contenu dans votre flux.",
      "content.updatePreferences": "Mettre à Jour les Préférences",
      "content.personalizedFeed": "Votre Flux Personnalisé",
      "content.more": "plus",

      // Notifications
      "notifications.success": "Paramètres enregistrés avec succès !",
      "notifications.error":
        "Échec de l'enregistrement des préférences. Veuillez réessayer.",
      "notifications.loading": "Enregistrement des préférences...",
      "notifications.reset": "Paramètres réinitialisés aux valeurs par défaut",
      "notifications.title": "Notifications",

      // User Menu
      "user.login": "Connexion",
      "user.profile": "Profil",
      "user.settings": "Paramètres",
      "user.logout": "Déconnexion",

      // Welcome Dialog
      "welcome.title": "Bienvenue sur PersonalDash ! 🎉",
      "welcome.description": "Obtenez du contenu personnalisé d'actualités, de films et de médias sociaux en un seul endroit.",
      "welcome.customize": "Personnalisons votre expérience en sélectionnant vos centres d'intérêt.",
      "welcome.getStarted": "Commencer",
      "welcome.chooseInterests": "Choisissez Vos Centres d'Intérêt",
      "welcome.newsCategories": "Catégories d'Actualités",
      "welcome.movieGenres": "Genres de Films",
      "welcome.socialTopics": "Sujets Sociaux",
      "welcome.back": "Retour",
      "welcome.complete": "Terminer la Configuration",

      // Home Page
      "home.welcomeBack": "Bon retour",
      "home.feedDescription": "Voici ce qui se passe dans votre flux personnalisé aujourd'hui.",

      // Trending Section
      "trending.title": "Tendances Actuelles",
      "trending.technology": "Technologie",
      "trending.movies": "Films",
      "trending.social": "Social",
      "trending.environment": "Environnement",

      // Favorites Section
      "favorites.title": "Favoris",
      "favorites.news": "Actualités",
      "favorites.movies": "Films",
      "favorites.social": "Social",
      "favorites.noFavorites": "Pas encore de favoris",
      "favorites.startHearting": "Commencez à aimer le contenu que vous appréciez !",
      "favorites.recentFavorites": "Favoris Récents",

      // Search Dialog
      "search.placeholder": "Rechercher dans tout le contenu...",
      "search.recentSearches": "Recherches Récentes",
      "search.clear": "Effacer",
      "search.trendingSearches": "Recherches Tendance",
      "search.searchTips": "Conseils de Recherche",
      "search.tip1": "Utilisez des guillemets pour des phrases exactes : \"intelligence artificielle\"",
      "search.tip2": "Recherchez par catégorie : actualités, films ou social",
      "search.tip3": "Essayez différents mots-clés pour de meilleurs résultats",
      "search.all": "Tout",
      "search.news": "Actualités",
      "search.movies": "Films",
      "search.social": "Social",
      "search.searching": "Recherche dans tout le contenu...",
      "search.noResults": "Aucun résultat trouvé",
      "search.tryDifferent": "Essayez différents mots-clés ou vérifiez votre orthographe",
      "search.resultsFound": "{{count}} résultat(s) trouvé(s) pour \"{{query}}\"",
      "search.filter": "Filtrer",

      // Header
      "header.toggleSidebar": "Basculer la barre latérale",
      "header.searchPlaceholder": "Rechercher actualités, films, posts sociaux...",
      "header.popularSearches": "Recherches populaires :",
      "header.aiTechnology": "Technologie IA",
      "header.latestMovies": "Films récents",
      "header.techTrends": "Tendances tech",
      "header.breakingNews": "Dernières nouvelles",
      "header.notifications": "Notifications",
    },
  },
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;