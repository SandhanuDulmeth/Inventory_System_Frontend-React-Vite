import { useState } from 'react';


export default function SwitchButton() {

  return (
    <>

    
      <input
        type="checkbox"
        className="toggle border-blue-500 bg-blue-500 [--tglbg:yellow] hover:bg-blue-700"
        defaultChecked />
      <h1>Switch works!8</h1>
      <button className="btn">Button</button>
<button className="btn btn-neutral">Neutral</button>
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-link">Link</button>
    

    </>

  );
}
