import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function DeepLinkHandler() {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
      async function resolveDeepLink() {
          //https://app.our-bride.com/share
          //https://app.our-bride.com/share
      try {
        const res = await axios.get(`http://161.35.32.218/api/v1/deep-links/${shortCode}`);
        const { fullURL } = res.data;
        console.log("Full URL:", res.data);
       window.location.href = res.data;
        const url = new URL(fullURL);
        const path = url.searchParams.get("path");
        const referralCode = url.searchParams.get("referralCode");
        const source = url.searchParams.get("source");
        const sourceId = url.searchParams.get("sourceId");

        // Store referral info
        if (referralCode) localStorage.setItem("referralCode", referralCode);
        if (source) localStorage.setItem("referralSource", source);
        if (sourceId) localStorage.setItem("referralSourceId", sourceId);

        // Redirect to internal path
        navigate(`/${path}`);
      } catch (err) {
        console.error("Invalid or expired deep link.");
        navigate("/");
      }
    }

    resolveDeepLink();
  }, [shortCode, navigate]);

  return <p>Redirecting...</p>;
}
