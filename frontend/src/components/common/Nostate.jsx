import React from 'react'

const Nostate = ({text = 'Record Not Found'}) => {
  return (
    <div className="text-center py-5">{text}</div>
  )
}

export default Nostate