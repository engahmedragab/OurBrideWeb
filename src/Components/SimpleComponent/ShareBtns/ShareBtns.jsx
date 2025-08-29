import React from "react";

const ShareBtns = ({ url, title, description }) => {
    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(url)}&hashtags=OurBride,عروستنا`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(description + ' ' + url)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="share-buttons">
            {/* Facebook Share */}
            <div className="fb-share-button m-3">
                <button
                    className="btn btn-outline-light"
                    style={{ padding: '5px 8px', fontSize: '11px', margin: '0px !important' }}
                    onClick={handleFacebookShare}
                >
                    <i className="fab fa-facebook me-1"></i>
                    Share
                </button>
            </div>

            {/* Twitter Share */}
            <a
                className="twitter-share-button btn btn-outline-light"
                style={{ padding: '5px 8px', fontSize: '11px', margin: '0px !important', textDecoration: 'none' }}
                onClick={handleTwitterShare}
                href="#"
            >
                <i className="fab fa-twitter me-1"></i>
                Tweet
            </a>

            {/* WhatsApp Share */}
            <a
                href={handleWhatsAppShare}
                className="btn btn-common m-3"
                style={{
                    padding: '5px 8px',
                    fontSize: '11px',
                    backgroundColor: '#25D366',
                    border: 'none',
                    textDecoration: 'none'
                }}
                onClick={(e) => {
                    e.preventDefault();
                    handleWhatsAppShare();
                }}
            >
                <b>
                    <img src="/fonts/whatsapp.svg" style={{ height: '17px', marginRight: '5px' }} alt="WhatsApp" />
                    Share
                </b>
            </a>
        </div>
    );
};

export default ShareBtns;
