import { useRoute } from '@react-navigation/native';
import { Button, TextInput, Text } from '../components'
import { useState, useRef } from 'react';
import styled from "styled-components/native";
import { Keyboard, TouchableWithoutFeedback, View, TextInput as RNTextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { cryptoService } from '../utils/cryptoService';
import EncryptedStorage from 'react-native-encrypted-storage';

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

const Login = () => {
    const route = useRoute<any>();
    const realPassword = route.params?.password;
    const navigation = useNavigation<any>();
    const [password, setPassword] = useState('');
    const inputRef = useRef<any>(null);

    const btnPressed = async () => {

        try {
            const deviceId = await DeviceInfo.getUniqueId();
            const masterKey = cryptoService.deriveKey(password, deviceId);

            const authData = await EncryptedStorage.getItem("user_auth");
            if (authData) {
                const parsedData = JSON.parse(authData);
                const decryptedSuccess = cryptoService.decrypt(
                    parsedData.encryptedSuccess,
                    masterKey,
                    parsedData.iv
                );

                if (deviceId == parsedData.deviceId && decryptedSuccess == "success") {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main', params: { masterKey: masterKey.toString('hex')} }],
                    });
                } else {
                    Alert.alert("비밀번호가 일치하지 않습니다.");
                }
            }
        } catch (e) {
            Alert.alert("비밀번호가 일치하지 않습니다.");
            console.log("Decryption failed", e);
        };

        
    };

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
                        <TextInput 
                            ref={inputRef}
                            value={password}
                            onChangeText={(text) => {
                                const filter = text.replace(/[^A-Za-z0-9@$!%*#?&]/g, '');
                                setPassword(filter);
                            }}
                            placeholder='비밀번호를 입력해 주세요.'
                            stroke={false}
                            fontSize={24}
                        />
                    </View>
                    <View style={{flex:2}}/>
                    <Button 
                        text='확인'
                        activated={pwConfirm(password)}
                        onPress={btnPressed}
                    />
                </Container>
            </TouchableWithoutFeedback>
    );
};

export default Login;