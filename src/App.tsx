import { useTranslation } from 'react-i18next';
import './App.css';
import { changeLanguage, currentLang } from './utils/i18n/i18n';
import { useEffect } from 'react';
import { axiosInstance } from './lib/axios';


function App() {
  const {t} = useTranslation();
  console.log({currentLang});

  useEffect( ()=>{
    const callApi = async():Promise<void> =>{
      const res = await axiosInstance.post('/api/v1/cart' , {"productId": "6428eb43dc1175abc65ca0b3"});
      console.log({res})
    }
    
    callApi();
  } ,[])
  return (
    <div className=' text-start bg-slate-300'>
      <h1>{t('shrouq')}</h1>
      <button onClick={()=>changeLanguage(currentLang === 'en' ? 'ar' : 'en')} >{t('sara')}</button>
    </div>
  )
  ;
}

export default App;
