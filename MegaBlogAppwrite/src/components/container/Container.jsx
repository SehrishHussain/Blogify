
// this defines styling properties. Just like a container
import React from 'react'

function Container({children}) {
  return <div className='w-full max-w-full  rounded-lg p-4  '>{children}</div>;
  
}

export default Container