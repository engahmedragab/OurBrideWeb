import React from 'react';
import {FacebookShareButton ,WhatsappShareButton ,TwitterShareButton} from "react-share";

export default function ShareBtns() {

return <>
    <div className="btns">
    <button className='btn text-primary'>
      <FacebookShareButton url={"http://www.ourbride.com"}
           quote={"افراحنا مش هتكمل الا بيكو ودعواتكم الجميله ووجودكم معانا تزيدنا سعاده , ده دعوة الفرح فيها العنوان مستنينكم"}
           hashtag="#Our_Bride">
           <i className='fa-brands fa-facebook'></i> Share </FacebookShareButton></button>
    <button className='btn text-green '>
      <WhatsappShareButton url={"http://www.ourbride.com"}
           quote={"افراحنا مش هتكمل الا بيكو ودعواتكم الجميله ووجودكم معانا تزيدنا سعاده , ده دعوة الفرح فيها العنوان مستنينكم"}
           hashtag="#Our_Bride"><i className='fa-brands fa-whatsapp'></i> Share</WhatsappShareButton></button>
    <button className='btn text-primary'>
      <TwitterShareButton url={"http://www.ourbride.com"}
           quote={"افراحنا مش هتكمل الا بيكو ودعواتكم الجميله ووجودكم معانا تزيدنا سعاده , ده دعوة الفرح فيها العنوان مستنينكم"}
           hashtag="#Our_Bride"><i className='fa-brands fa-twitter'></i> Share</TwitterShareButton></button>
</div>
</>
 
};
