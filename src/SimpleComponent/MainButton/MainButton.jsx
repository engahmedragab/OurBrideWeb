import React from 'react';
import { Link } from 'react-router-dom';


export default function MainButton({title, link ,classes ,...rest}) {
  return <>
        <Link className='text-center' to={link}><button {...rest} className={'btn px-5 rounded-pill fw-semibold p-2 '+ classes}>{title}</button></Link>
</>
}
