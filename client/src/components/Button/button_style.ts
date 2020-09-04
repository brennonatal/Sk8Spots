import styled from 'styled-components'
import { ButtonStyle } from './index'

const ButtonContainer = styled('button') <ButtonStyle> `
    background-color: ${props => props.backgroundColor || '#7B2CBF'};
    height: min-content;
    width: ${props => props.width || 'min-content'};
    padding: 8px;
    color: #FFF;
    border-radius: 8px;
    outline: none;
`

export { ButtonContainer }