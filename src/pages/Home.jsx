
import React, { useState } from 'react'
import SwitchButton from '../components/SwitchButton'
import './home.css'
export default function Home() {
    return (
        <div>

<div className="grid grid-cols-4 grid-rows-4 gap-4">

    
    <div className="row-span-2 ">1</div>
    <div className="row-span-2">2</div>
    <div className="col-span-2 col-start-2 row-start-3 flex-container">3

    <h2 className="text-red-500">If this is red, Tailwind is working!</h2>

<h1>Home works!8</h1>
<SwitchButton />


    </div>
    <div className="row-span-2 col-start-4 row-start-1">4</div>
    <div className="col-start-4 row-start-3">5</div>
    <div className="col-start-1 row-start-3">6</div>
    <div className="row-span-2 col-start-3 row-start-1">7</div>
    <div className="col-span-4 row-start-4">8</div>
</div>
    



          
        </div>
    );
}