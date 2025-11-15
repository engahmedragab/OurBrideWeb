import React, { useState } from 'react';
import img1 from "../../Assets/أدوات المطبخ1.jpg";
import img2 from "../../Assets/أدوات المطبخ2.jpg";
import img3 from "../../Assets/أدوات المطبخ3.jpg";
import img4 from "../../Assets/أدوات المطبخ4.jpg";
import img5 from "../../Assets/أدوات المطبخ5.jpg";
import img6 from "../../Assets/أدوات المطبخ6.jpg";
import img7 from "../../Assets/أدوات المطبخ7.jpg";
import img8 from "../../Assets/أدوات المطبخ8.jpg";
import img9 from "../../Assets/أدوات المطبخ9.jpg";
import img10 from "../../Assets/أدوات المطبخ10.jpg";
import img11 from "../../Assets/أدوات المطبخ11.jpg";
import img12 from "../../Assets/الأجهزة الكهربائية1.jpg";
import img13 from "../../Assets/الأجهزة الكهربائية2.jpg";
import img14 from "../../Assets/الأجهزة الكهربائية3.jpg";
import img15 from "../../Assets/الأجهزة الكهربائية4.jpg";
import img16 from "../../Assets/الخزين1.jpg";
import img17 from "../../Assets/الخزين2.jpg";
import img18 from "../../Assets/الخزين3.jpg";
import img19 from "../../Assets/الخزين4.jpg";
import img20 from "../../Assets/الكماليات1.jpg";
import img21 from "../../Assets/الكماليات2.jpg";
import img22 from "../../Assets/المفروشات1.jpg";
import img23 from "../../Assets/المفروشات2.jpg";
import img24 from "../../Assets/مستلزمات الحمام1.jpg";
import img25 from "../../Assets/مستلزمات الحمام2.jpg";
 
  
 

export let imgsArray = [
    { id:1 , imgSrc:img1 , title:"أدوات المطبخ"},
    { id:2 , imgSrc:img2 , title:"أدوات المطبخ"},
    { id:3 , imgSrc:img3 , title:"أدوات المطبخ"},
    { id:4 , imgSrc:img4 , title:"أدوات المطبخ"},
    { id:5 , imgSrc:img5 , title:"أدوات المطبخ"},
    { id:6 , imgSrc:img6 , title:"أدوات المطبخ"},
    { id:7 , imgSrc:img7 , title:"أدوات المطبخ"},
    { id:8 , imgSrc:img8 , title:"أدوات المطبخ"},
    { id:9 , imgSrc:img9 , title:"أدوات المطبخ"},
    { id:10 , imgSrc:img10 , title:"أدوات المطبخ"},
    { id:11 , imgSrc:img11 , title:"أدوات المطبخ"},
    { id:12 , imgSrc:img12 , title:"الأجهزة الكهربائية"},
    { id:13 , imgSrc:img13 , title:"الأجهزة الكهربائية"},
    { id:14 , imgSrc:img14 , title:"الأجهزة الكهربائية"},
    { id:15 , imgSrc:img15 , title:"الأجهزة الكهربائية"},
    { id:16 , imgSrc:img16 , title:"الخزين"},
    { id:17 , imgSrc:img17 , title:"الخزين"},
    { id:18 , imgSrc:img18 , title:"الخزين"},
    { id:19 , imgSrc:img19 , title:"الخزين"},
    { id:20 , imgSrc:img20 , title:"الكماليات"},
    { id:21 , imgSrc:img21 , title:"الكماليات"},
    { id:22 , imgSrc:img22 , title:"المفروشات"},
    { id:23 , imgSrc:img23 , title:"المفروشات"},
    { id:24 , imgSrc:img24 , title:"مستلزمات الحمام"},
    { id:25 , imgSrc:img25 , title:"مستلزمات الحمام"},

]

;

