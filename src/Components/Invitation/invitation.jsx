import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invitationService } from "../../services/apiService";
import { useCountdown } from "../../Hooks/useCountDown";
import ShareBtns from "../SimpleComponent/ShareBtns/ShareBtns";

export default function Invitation() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(null);

  // Countdown hook
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    invitation?.weddingDate
  );

  useEffect(() => {
    // Store invitation slug in localStorage
    localStorage.setItem("InvitaionSlug", slug);

    // Load invitation data
    loadInvitation();

    // Setup audio
    setupAudio();
  }, [slug]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      const data = await invitationService.getBySlug(slug);
      setInvitation(data);
    } catch (error) {
      console.error("Error loading invitation:", error);
      setError("Invitation not found or has expired");
    } finally {
      setLoading(false);
    }
  };

  const setupAudio = () => {
    const audioElement = new Audio("/music/twisterium-eternal-love.mp3");
    audioElement.loop = true;
    setAudio(audioElement);
  };

  const handlePlayAudio = () => {
    if (audio) {
      audio.play().catch(error => {
      });
    }
  };

  const copyLink = () => {
    const invitationUrl = `https://www.our-bride.com/Invitations/Invitation?slug=${slug}`;
    navigator.clipboard.writeText(invitationUrl);
    alert(`Copied the Invitation Link: ${invitationUrl}`);
  };

  if (loading) {
    return (
      <div id="preloader">
        <div className="loader" id="loader-1"></div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="invitation-error">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1>Invitation Not Found</h1>
              <p>The invitation you're looking for doesn't exist or has expired.</p>
              <button
                className="btn btn-main"
                onClick={() => navigate("/")}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background Wrapper */}
      <div className="bg-wraper overlay has-vignette">
        <div
          id="example"
          className="slider opacity-50 vegas-container"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${invitation.backgroundImage || '/images/invitations/default-bg.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '983px'
          }}
        ></div>
      </div>

      {/* Countdown Section */}
      <section className="countdown-timer">
        <div className="row pl-5">
          <a href="https://Our-Bride.com">
            <img src="/images/logoWeb.png" style={{ height: '60px' }} alt="OurBride" />
          </a>
        </div>

        <div className="container">
          <div className="row text-center">
            <div className="col-md-12 col-sm-12 col-xs-12">
              {/* Wedding Date */}
              <div className="text-lg md:text-2xl italic">
                {new Date(invitation.weddingDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <p id="date" style={{ display: 'none' }}>
                {invitation.weddingDate}
              </p>

              {/* Couple Names and Venue */}
              <div>
                <div className="p-4 w-full mx-5 md:w-1/2 mx-auto italic">
                  <h1 className="p-2 text-xl">
                    {invitation.groom} & {invitation.bride}
                  </h1>
                  <h2>{invitation.weddinghole}</h2>
                  <h4>{invitation.weddingAddress}</h4>
                  <h4>{invitation.area}</h4>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-sm-12 col-xs-12">
              {/* Countdown Timer */}
              <div className="row time-countdown justify-content-center">
                <div id="clock" className="time-count">
                  {!isExpired ? (
                    <div className="countdown-grid">
                      <div className="countdown-item">
                        <div className="countdown-number">{days}</div>
                        <div className="countdown-label">Days</div>
                      </div>
                      <div className="countdown-item">
                        <div className="countdown-number">{hours}</div>
                        <div className="countdown-label">Hours</div>
                      </div>
                      <div className="countdown-item">
                        <div className="countdown-number">{minutes}</div>
                        <div className="countdown-label">Minutes</div>
                      </div>
                      <div className="countdown-item">
                        <div className="countdown-number">{seconds}</div>
                        <div className="countdown-label">Seconds</div>
                      </div>
                    </div>
                  ) : (
                    <div className="expired-message">
                      <h3>The Wedding Day Has Arrived!</h3>
                    </div>
                  )}
                </div>
                <br />

                {/* Arabic Message */}
                <h5 id="expiredate">
                  .افراحنا مش هتكمل غير بيكم و بدعواتكم الجميله ووجودكم معانا يزيدنا سعادة
                </h5>

                {/* Action Buttons */}
                <div className="button-group col-12 justify-content-center">
                  <button
                    className="btn btn-border"
                    style={{ padding: '5px 8px', fontSize: '11px', margin: '0px !important' }}
                    onClick={copyLink}
                  >
                    Copy Link
                  </button>
                </div>

                {/* Share Buttons */}
                <div className="button-group col-12 justify-content-center">
                  <ShareBtns
                    url={`https://www.our-bride.com/Invitations/Invitation?slug=${slug}`}
                    title="Wedding Invitation"
                    description="افراحنا مش هتكمل الا بيكو ودعواتكم الجميله ووجودكم معانا تزيدنا سعاده"
                  />
                </div>

                {/* Map Button */}
                <div className="button-group col-12 justify-content-center">
                  <a
                    href={invitation.mapsLink}
                    className="btn btn-border"
                    style={{ padding: '5px 8px', fontSize: '11px', margin: '0px !important' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get On Map
                  </a>
                </div>

                {/* Social Media Links */}
                <div className="social mt-4">
                  <a className="facebook" href="https://www.facebook.com/OurBrideCom">
                    <i className="lni-facebook-filled"></i>
                  </a>
                  <a className="twitter" href="https://twitter.com/OurbrideCom">
                    <i className="lni-twitter-filled"></i>
                  </a>
                  <a className="instagram" href="https://www.instagram.com/ourbridecom">
                    <i className="lni-instagram-filled"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-top footer text-muted">
          <div className="container">
            &copy; 2021 - <a href="https://Our-Bride.com">OurBride</a> - <a href="/privacy">Privacy</a>
          </div>
        </footer>
      </section>

      {/* Preloader */}
      <div id="preloader">
        <div className="loader" id="loader-1"></div>
      </div>

      {/* Audio Play Trigger */}
      <div
        className="audio-trigger"
        onClick={handlePlayAudio}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        <i className="fas fa-music" style={{ color: 'white' }}></i>
      </div>
    </>
  );
}
