import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    structuredData = null
}) => {
    useEffect(() => {
        // Update document title
        document.title = title;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', title);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', description);
        }

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            ogUrl.setAttribute('content', url);
        }

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && image) {
            ogImage.setAttribute('content', image);
        }

        // Update Twitter tags
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', title);
        }

        const twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.setAttribute('content', description);
        }

        const twitterImage = document.querySelector('meta[property="twitter:image"]');
        if (twitterImage && image) {
            twitterImage.setAttribute('content', image);
        }

        // Update canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', url);
        }
    }, [title, description, keywords, image, url]);

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            {image && <meta property="twitter:image" content={image} />}

            {/* Canonical */}
            <link rel="canonical" href={url} />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;
