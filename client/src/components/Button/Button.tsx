import React, { FunctionComponent } from 'react'
import * as S from './button_style'
import { ButtonStyle } from './index'

const Button: FunctionComponent<ButtonStyle> = (props) => {
    return (
        <S.ButtonContainer backgroundColor={props.backgroundColor} width={props.width}>
            {props.children}
        </S.ButtonContainer>
    )
}

export default Button