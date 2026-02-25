import styled from "styled-components/native";
import { TextInput as RNTextInput } from 'react-native';

interface TextInputProps {
    stroke?: boolean,
    fontSize?: number,
    placeholder?: string,
    value?: string,
    onChangeText?: (text:string) => void,
    ref?: React.RefObject<RNTextInput>,
    height ?: number,
    returnKeyType ?: string,
    onSubmitEditing?: () => void,
    blurOnSubmit?: boolean,
    multiline?: boolean,
};

const StyledInput = styled.TextInput.attrs<TextInputProps>(({ theme }) => ({
    placeholderTextColor: theme.textInputPlaceholder,
}))<TextInputProps>`
    width: 100%;
    padding: 16px;
    border-width: 1px;
    border-color: ${({ theme, stroke}) => stroke ? theme.textInputStroke : theme.textInputNonStroke};
    font-size: ${({fontSize}) => fontSize}px;
    include-font-padding: false;
    text-align-vertical: top;
    height: ${({height}) => height}px;
`;


const TextInput = ({stroke=true, fontSize=16, placeholder, value, onChangeText, ref, height=100, returnKeyType, onSubmitEditing, blurOnSubmit, multiline=true}: TextInputProps ) => {
    return (
        <StyledInput
            stroke={stroke}
            fontSize={fontSize}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            ref={ref}
            height={height}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit}

        />
    );
};

export default TextInput;

