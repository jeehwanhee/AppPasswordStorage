import styled from "styled-components/native";

interface ContainerProps {
    activated: boolean,
};
const Container = styled.TouchableOpacity<ContainerProps>`
    background-color: ${({ theme, activated }) => activated ? theme.buttonBackgroundActivated : theme.buttonBackground};
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px
`;

interface TextProps {
    activated: boolean,
    type: boolean,
};
const Text = styled.Text<TextProps>`
    font-size: 16px;
    font-family: ${({ theme }) => theme.fonts.bold};
    color: ${({ theme, activated, type}) => activated ? (type ? theme.buttonText : theme.buttonTextRed) : (type ? theme.buttonTextdeactivated : theme.buttonTextRed)};
`;

interface ButtonProps {
    text?: string,
    onPress?: () => void,
    activated?: boolean,
    type?: boolean,
    disabled?: boolean,
}
const Button = ({ text, onPress, activated=true, type=true, disabled=!activated }: ButtonProps) => {
    return (
        <Container
            onPress={onPress}
            activated={activated}
            disabled={disabled}
        >
            <Text activated={activated} type={type}>{text}</Text>
        </Container>
    );
};

export default Button;