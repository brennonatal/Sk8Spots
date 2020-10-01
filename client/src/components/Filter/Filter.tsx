import React from 'react'
import { BiFilter } from 'react-icons/bi'

function Filter() {
  return (
    <div className="dropdown">
      <button className="btn btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <BiFilter size='2rem'/>
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a className="dropdown-item" href="#">Skate Parks</a>
        <a className="dropdown-item" href="#">Bowls</a>
        <a className="dropdown-item" href="#">Street Spots</a>
        <a className="dropdown-item" href="#">Downhill</a>
        <a className="dropdown-item" href="#">Skate Shops</a>
      </div>
    </div>
  )
}

export default Filter