import React, { FunctionComponent } from 'react'
import * as S from './card_style'
import { CardStyle } from './index'

interface CardProps {
    title: string
}

type Props = CardProps & CardStyle

const Card: FunctionComponent<Props> = (props) => {
    return (
        <S.CardContainer backgroundColor={props.backgroundColor}>
            {props.title}
        </S.CardContainer>
    )
}

export default Card