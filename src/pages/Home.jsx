
import React, { useState } from 'react'
import SwitchButton from '../components/SwitchButton'
import BellButton from '../components/BellButton'
export default function Home(){
    return(
        <>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SwitchButton/>
        <BellButton/>
       </div>
       </>
     
    );
}