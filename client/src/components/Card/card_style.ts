import styled from 'styled-components'
import { CardStyle } from './index'

const CardContainer = styled('div') <CardStyle> `
    background-color: ${props => props.backgroundColor || '#c9c'};
`

export { CardContainer }