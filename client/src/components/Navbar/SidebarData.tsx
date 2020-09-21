import React from 'react'
import { FaPlus, FaStar } from 'react-icons/fa'
import { AiFillHome } from 'react-icons/ai'
import { IoMdSettings } from 'react-icons/io'

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiFillHome />,
        class: 'nav-text'
    },
    {
        title: 'Add Spot',
        path: '/add-spot',
        icon: <FaPlus />,
        class: 'nav-text'
    },
    {
        title: 'Favorites',
        path: '/favorites',
        icon: <FaStar />,
        class: 'nav-text'
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <IoMdSettings />,
        class: 'nav-text'
    },
]