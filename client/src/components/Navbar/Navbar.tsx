import React, { useState } from 'react'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { SidebarData } from './SidebarData'
import * as S from './navbar_style'
import { Filter } from '../index'

function Navbar() {

	const [sidebar, setSidebar] = useState(false)

	const showSidebar = () => setSidebar(!sidebar) // toggle sidebar state

	return (
		<>
			<S.NavbarContainer>
				<S.MenuBars to='#' onClick={showSidebar}>
					<FaIcons.FaBars />
				</S.MenuBars>
				<br />

				<S.MenuBars to='#'>
					<Filter />
				</S.MenuBars>


			</S.NavbarContainer>

			<S.NavMenu active={sidebar ? true : false}>
				<S.NavMenuItems onClick={showSidebar}>
					<S.NavbarToggle>
						<S.MenuBars to='#'>
							<AiIcons.AiOutlineClose />
						</S.MenuBars>
					</S.NavbarToggle>

					{SidebarData.map((item, index) => {
						return (
							<S.NavText key={index}>
								<Link to={item.path}>
									{item.icon}
									<S.Title> {item.title} </S.Title>
								</Link>
							</S.NavText>
						)
					})}
				</S.NavMenuItems>
			</S.NavMenu>
		</>
	)
}

export default Navbar