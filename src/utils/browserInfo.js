// Browser and System Information Utility

// Get browser information
export const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let version = '';

    // Detect browser
    if (userAgent.includes('Chrome')) {
        browser = 'Chrome';
        const match = userAgent.match(/Chrome\/(\d+)/);
        version = match ? match[1] : '';
    } else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
        const match = userAgent.match(/Firefox\/(\d+)/);
        version = match ? match[1] : '';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browser = 'Safari';
        const match = userAgent.match(/Version\/(\d+)/);
        version = match ? match[1] : '';
    } else if (userAgent.includes('Edge')) {
        browser = 'Edge';
        const match = userAgent.match(/Edge\/(\d+)/);
        version = match ? match[1] : '';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
        browser = 'Internet Explorer';
        const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
        version = match ? match[1] : '';
    }

    return {
        name: browser,
        version: version,
        userAgent: userAgent
    };
};

// Get operating system information
export const getOSInfo = () => {
    const userAgent = navigator.userAgent;
    let os = 'Unknown';

    if (userAgent.includes('Windows')) {
        os = 'Windows';
    } else if (userAgent.includes('Mac')) {
        os = 'macOS';
    } else if (userAgent.includes('Linux')) {
        os = 'Linux';
    } else if (userAgent.includes('Android')) {
        os = 'Android';
    } else if (userAgent.includes('iOS')) {
        os = 'iOS';
    }

    return os;
};

// Get platform information
export const getPlatformInfo = () => {
    const userAgent = navigator.userAgent;
    let platform = 'Web';

    if (userAgent.includes('Mobile')) {
        platform = 'Mobile Web';
    } else if (userAgent.includes('Tablet')) {
        platform = 'Tablet Web';
    }

    return platform;
};

// Get IP address (requires external service)
export const getIPAddress = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
};

// Get location information (requires external service)
export const getLocationInfo = async () => {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            countryId: data.country_code,
            cityId: data.city,
            area: data.region,
            mapsLink: `https://maps.google.com/?q=${data.latitude},${data.longitude}`
        };
    } catch (error) {
        console.error('Error fetching location info:', error);
        return {
            countryId: null,
            cityId: null,
            area: null,
            mapsLink: null
        };
    }
};

// Get comprehensive system information
export const getSystemInfo = async () => {
    const browserInfo = getBrowserInfo();
    const osInfo = getOSInfo();
    const platformInfo = getPlatformInfo();
    const ipAddress = await getIPAddress();
    const locationInfo = await getLocationInfo();

    return {
        browser: browserInfo.name,
        os: osInfo,
        platform: platformInfo,
        ip: ipAddress,
        ...locationInfo
    };
};

// Create contact data with system information
export const createContactData = async (formData, source = 'Contact Form') => {
    const systemInfo = await getSystemInfo();

    return {
        email: formData.email,
        phone: formData.phone || null,
        name: formData.name,
        message: formData.message,
        source: source,
        countryId: systemInfo.countryId,
        cityId: systemInfo.cityId,
        area: systemInfo.area,
        platform: systemInfo.platform,
        os: systemInfo.os,
        browser: systemInfo.browser,
        ip: systemInfo.ip,
        mapsLink: systemInfo.mapsLink
    };
};

export default {
    getBrowserInfo,
    getOSInfo,
    getPlatformInfo,
    getIPAddress,
    getLocationInfo,
    getSystemInfo,
    createContactData
};
