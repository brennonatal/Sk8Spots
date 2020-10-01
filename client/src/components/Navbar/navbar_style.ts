import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface NavMenuProps {
  active: boolean;
}

const NavbarContainer = styled.div`
  background-color: transparent;
  height: 80px;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
`

const NavMenu = styled('nav') <NavMenuProps>`
  background-color: #060b26;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  z-index: 3;
  top: 0;
  left: ${props => props.active ? 0 : '-100%'};
  transition: ${props => props.active ? '350ms' : '850ms'};
`

const NavText = styled.li`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 8px 0px 8px 16px;
  list-style: none;
  height: 60px;

    a {
      text-decoration: none;
      color: #f5f5f5;
      font-size: 18px;
      width: 95%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-radius: 4px;

      &:hover {
        background-color: #1a83ff;
      }
    }
`

const MenuBars = styled(Link)`
  padding: 1rem;
  display: inline-block;
  font-size: 2rem;
  background: none;
`

const NavMenuItems = styled.ul`
  width: 100%;
`

const NavbarToggle = styled.li`
  background-color: #060b26;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: start;
  align-items: center;
`

const Title = styled.div`
  margin-left: 16px;
`

export { NavbarContainer, NavbarToggle, NavMenu, NavMenuItems, NavText, MenuBars, Title }