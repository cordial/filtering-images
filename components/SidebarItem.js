import React from 'react'

export default function SidebarItem({ value, name, active, handleClick }) {
  return (
    <>
      <p className="sidebar-value">{value}</p>
    <button
      className={`sidebar-item ${active ? 'active' : ''}`}
      onClick={handleClick}
    >
      {name}
    </button>
    </>
  )
}
