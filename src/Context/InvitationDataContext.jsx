import React, {useState, createContext} from 'react'

export let InvitationDataContext = createContext("");
function InvitationDataContextProvider(props) {

    const [invitaionData , setInvitaionData] = useState({
        "bride-name":"",
        "groom-name":"",
        "wedding-date": "",
        "engagement-date": "",
        "henna-date": "",
        "crown-date": "",
        "area": "",
        "wedding-hole": "",
        "adress": "",
        "img-src": "",
    });
  return <InvitationDataContext.Provider value={{invitaionData,setInvitaionData}}>
        {props.children}
  </InvitationDataContext.Provider>
}

export default InvitationDataContextProvider;