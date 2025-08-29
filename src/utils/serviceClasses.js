// Service Classes Enum - matches Flutter ServiceClass enum
export const ServiceClass = {
    BEAUTYCENTER: 'beautycenter',
    FLOWERBOUQUET: 'flowerbouquet',
    INVITATIONS: 'invitations',
    MAKEUPARTIST: 'makeupartist',
    MAZOONS: 'mazoons',
    PHOTOGRAPHER: 'photographer',
    PHOTOSETION: 'photosetion',
    WEDDINGCAR: 'weddingcar',
    WEDDINGDRESS: 'weddingdress',
    WEDDINGHALL: 'weddinghall',
    WEDDINGPLANNER: 'weddingplanner',
    CATERING: 'catering',
    WEDDINGCAKE: 'weddingcake',
    JEWELRY: 'jewelry',
    TRAVEL: 'travel',
    DJ: 'dj',
    CEREMONYMUSIC: 'ceremonymusic',
    SWAGGERGENERATEDUNKNOWN: 'swaggerGeneratedUnknown'
};

// Service class labels for display
export const ServiceClassLabels = {
    [ServiceClass.BEAUTYCENTER]: 'Beauty Center',
    [ServiceClass.FLOWERBOUQUET]: 'Flower Bouquet',
    [ServiceClass.INVITATIONS]: 'Invitations',
    [ServiceClass.MAKEUPARTIST]: 'Makeup Artist',
    [ServiceClass.MAZOONS]: 'Mazoons',
    [ServiceClass.PHOTOGRAPHER]: 'Photographer',
    [ServiceClass.PHOTOSETION]: 'Photo Session',
    [ServiceClass.WEDDINGCAR]: 'Wedding Car',
    [ServiceClass.WEDDINGDRESS]: 'Wedding Dress',
    [ServiceClass.WEDDINGHALL]: 'Wedding Hall',
    [ServiceClass.WEDDINGPLANNER]: 'Wedding Planner',
    [ServiceClass.CATERING]: 'Catering',
    [ServiceClass.WEDDINGCAKE]: 'Wedding Cake',
    [ServiceClass.JEWELRY]: 'Jewelry',
    [ServiceClass.TRAVEL]: 'Travel',
    [ServiceClass.DJ]: 'DJ',
    [ServiceClass.CEREMONYMUSIC]: 'Ceremony Music'
};

// Service class icons
export const ServiceClassIcons = {
    [ServiceClass.BEAUTYCENTER]: 'fas fa-spa',
    [ServiceClass.FLOWERBOUQUET]: 'fas fa-flower-tulip',
    [ServiceClass.INVITATIONS]: 'fas fa-envelope-open',
    [ServiceClass.MAKEUPARTIST]: 'fas fa-palette',
    [ServiceClass.MAZOONS]: 'fas fa-user-tie',
    [ServiceClass.PHOTOGRAPHER]: 'fas fa-camera',
    [ServiceClass.PHOTOSETION]: 'fas fa-images',
    [ServiceClass.WEDDINGCAR]: 'fas fa-car',
    [ServiceClass.WEDDINGDRESS]: 'fas fa-tshirt',
    [ServiceClass.WEDDINGHALL]: 'fas fa-building',
    [ServiceClass.WEDDINGPLANNER]: 'fas fa-calendar-check',
    [ServiceClass.CATERING]: 'fas fa-utensils',
    [ServiceClass.WEDDINGCAKE]: 'fas fa-birthday-cake',
    [ServiceClass.JEWELRY]: 'fas fa-gem',
    [ServiceClass.TRAVEL]: 'fas fa-plane',
    [ServiceClass.DJ]: 'fas fa-music',
    [ServiceClass.CEREMONYMUSIC]: 'fas fa-microphone'
};

// Service class descriptions
export const ServiceClassDescriptions = {
    [ServiceClass.BEAUTYCENTER]: 'For salons and beauty centers.',
    [ServiceClass.FLOWERBOUQUET]: 'Flower arrangements and bouquets.',
    [ServiceClass.INVITATIONS]: 'Custom wedding invitations.',
    [ServiceClass.MAKEUPARTIST]: 'Professional makeup artists.',
    [ServiceClass.MAZOONS]: 'Wedding officiants.',
    [ServiceClass.PHOTOGRAPHER]: 'Capture your special moments.',
    [ServiceClass.PHOTOSETION]: 'Photo booth services.',
    [ServiceClass.WEDDINGCAR]: 'Luxury cars for your big day.',
    [ServiceClass.WEDDINGDRESS]: 'Stunning wedding dresses.',
    [ServiceClass.WEDDINGHALL]: 'Perfect venues for weddings.',
    [ServiceClass.WEDDINGPLANNER]: 'Expert wedding planning.',
    [ServiceClass.CATERING]: 'Delicious catering services.',
    [ServiceClass.WEDDINGCAKE]: 'Beautiful wedding cakes.',
    [ServiceClass.JEWELRY]: 'Elegant wedding jewelry.',
    [ServiceClass.TRAVEL]: 'Travel services for honeymoon.',
    [ServiceClass.DJ]: 'Music and entertainment DJs.',
    [ServiceClass.CEREMONYMUSIC]: 'Live music for ceremonies.'
};

// Get all service classes except unknown
export const getServiceClasses = () => {
    return Object.values(ServiceClass).filter(
        serviceClass => serviceClass !== ServiceClass.SWAGGERGENERATEDUNKNOWN
    );
};

// Convert service class list to JSON (matches Flutter toJson)
export const serviceClassListToJson = (serviceClasses) => {
    return serviceClasses;
};

// Convert JSON to service class list (matches Flutter fromJson)
export const serviceClassListFromJson = (json) => {
    return json;
};

// Create service class data for display
export const createServiceClassData = () => {
    return getServiceClasses().map(serviceClass => ({
        value: serviceClass,
        label: ServiceClassLabels[serviceClass],
        icon: ServiceClassIcons[serviceClass],
        description: ServiceClassDescriptions[serviceClass]
    }));
};

export default {
    ServiceClass,
    ServiceClassLabels,
    ServiceClassIcons,
    ServiceClassDescriptions,
    getServiceClasses,
    serviceClassListToJson,
    serviceClassListFromJson,
    createServiceClassData
};
