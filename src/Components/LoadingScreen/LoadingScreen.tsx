import React from 'react'

export default function LoadingScreen() {
  return (
    <div className='position-fixed top-0 bottom-0 start-0 end-0 bg-light d-flex justify-content-center align-items-center'>        
        <i className='fas fa-spinner  fa-spin fa-5x text-main'></i>
    </div>
  )
}
