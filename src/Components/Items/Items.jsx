import React from 'react'
import {imgsArray} from '../ItemsCard/ItemsCard';

export default function Items() {
  return <>
  <div className="contain m-5 w-100 d-flex flex-column justify-content-center align-items-center">
      <h2 className='text-main main-font fw-bolder fs-1'>WEDDING ITEMS</h2>
      <h2 className='fw-light'><span className='fw-semibold'>Items </span> Gallery.</h2>
    </div>
  <ul className="nav nav-pills d-flex justify-content-center my-2" id="pills-tab" role="tablist">
  <li className="nav-item" role="presentation">
    <button className="nav-link fw-normal active" id="pills-all-tab" data-bs-toggle="pill" data-bs-target="#pills-all" type="button" role="tab" aria-controls="pills-all" aria-selected="true">المطبخ</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link fw-normal" id="pills-electronic-tab" data-bs-toggle="pill" data-bs-target="#pills-electronic" type="button" role="tab" aria-controls="pills-electronic" aria-selected="false">الأجهزة الكهربائية</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link fw-normal" id="pills-store-tab" data-bs-toggle="pill" data-bs-target="#pills-store" type="button" role="tab" aria-controls="pills-store" aria-selected="false">الخزين</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link fw-normal" id="pills-complited-tab" data-bs-toggle="pill" data-bs-target="#pills-complited" type="button" role="tab" aria-controls="pills-complited" aria-selected="false">الكماليات</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link fw-normal" id="pills-clothing-tab" data-bs-toggle="pill" data-bs-target="#pills-clothing" type="button" role="tab" aria-controls="pills-clothing" aria-selected="false">المفروشات</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link fw-normal" id="pills-bathThings-tab" data-bs-toggle="pill" data-bs-target="#pills-bathThings" type="button" role="tab" aria-controls="pills-bathThings" aria-selected="false">مستلزمات الحمام</button>
  </li>
 
</ul>
<div className="tab-content" id="pills-tabContent">
  <div className="tab-pane fade show active" id="pills-all" role="tabpanel" aria-labelledby="pills-all-tab" tabindex="0">
    <div className="row g-5 p-5">{imgsArray.filter(x => x.title == "أدوات المطبخ").map(img => 
        (<div className='col-lg-4 '><img className='w-100 rounded' src={img.imgSrc}/></div>))}</div></div>
  <div className="tab-pane fade" id="pills-electronic" role="tabpanel" aria-labelledby="pills-electronic-tab" tabindex="0">
    <div className="row g-5 p-5">{imgsArray.filter(x => x.title == "الأجهزة الكهربائية").map(img => 
        (<div className='col-lg-4 '><img className='w-100 rounded' src={img.imgSrc}/></div>))}</div></div>
  <div className="tab-pane fade" id="pills-store" role="tabpanel" aria-labelledby="pills-store-tab" tabindex="0">
    <div className="row g-5 p-5">{imgsArray.filter(x => x.title == "الخزين").map(img => 
        (<div className='col-lg-4 '><img className='w-100 rounded' src={img.imgSrc}/></div>))}</div></div>
  <div className="tab-pane fade" id="pills-complited" role="tabpanel" aria-labelledby="pills-complited-tab" tabindex="0">
    <div className="row g-5 p-5">{imgsArray.filter(x => x.title == "الكماليات").map(img => 
        (<div className='col-lg-4 '><img className='w-100 rounded' src={img.imgSrc}/></div>))}</div></div>
  <div className="tab-pane fade" id="pills-clothing" role="tabpanel" aria-labelledby="pills-clothing-tab" tabindex="0">
    <div className="row g-5 p-5">{imgsArray.filter(x => x.title == "المفروشات").map(img => 
        (<div className='col-lg-4 '><img className='w-100 rounded' src={img.imgSrc}/></div>))}</div></div>
  <div className="tab-pane fade" id="pills-bathThings" role="tabpanel" aria-labelledby="pills-bathThings-tab" tabindex="0">
    <div className="row g-5 p-5">{imgsArray.filter(x => x.title == "مستلزمات الحمام").map(img => 
        (<div className='col-lg-4 '><img className='w-100 rounded' src={img.imgSrc}/></div>))}</div></div>
</div>
</>
}
