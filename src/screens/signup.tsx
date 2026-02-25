import { Button, TextInput, Text } from '../components'
import { useState, useRef } from 'react';
import styled from "styled-components/native";
import { Keyboard, TouchableWithoutFeedback, View, TextInput as RNTextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
`;

const pwConfirm = (pw: string) => {
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,16}$/;
    
    return pwRegex.test(pw);
};

const Signup = () => {
    const navigation = useNavigation<any>();
    const [password, setPassword] = useState('');
    const inputRef = useRef<any>(null);

    const handleFocusOut = () => {
        Keyboard.dismiss();
        inputRef.current?.blur();
    };

    return (
        <TouchableWithoutFeedback onPress={handleFocusOut} accessible={false} >
            <Container>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 32,
                        justifyContent: 'center'
                    }}>
                        
                    <Text warning={true} text="추후에 변경할 수 없습니다!!!"/>
                    <TextInput 
                        ref={inputRef}
                        value={password}
                        onChangeText={(text) => {
                            const filter = text.replace(/[^A-Za-z0-9@$!%*#?&]/g, '');
                            setPassword(filter);
                        }}
                        placeholder='앱에서 사용할 비밀번호를 입력해 주세요.'
                        stroke={false}
                        fontSize={24}
                    />
                </View>
                <View style={{flex:1, paddingHorizontal: 32,}}>
                    <Text done={false} text="* 6 ~ 16자리"/>
                    <Text done={false} text="* 알파벳, 숫자, 특수기호 모두 포함"/>
                    <Text warning={true} text="꼭 기억해 주세요. 보안의 핵심입니다."/>
                </View>
                <View style={{flex:1}}/>
                <Button 
                    text='확인'
                    activated={pwConfirm(password)}
                    onPress={() => navigation.navigate('ConfirmPW', {password: password})}
                />
            </Container>
        </TouchableWithoutFeedback>
    );
};

export default Signup;