import { useRoute } from '@react-navigation/native';
import { Button, TextInput, Text } from '../components'
import { useState, useRef } from 'react';
import styled from "styled-components/native";
import { Keyboard, TouchableWithoutFeedback, View, TextInput as RNTextInput } from 'react-native';
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

const ConfirmPW = () => {
    const route = useRoute<any>();
    const realPassword = route.params?.password;
    const navigation = useNavigation<any>();
    const [password, setPassword] = useState('');
    const inputRef = useRef<any>(null);

    const btnPressed = async () => {
        const deviceId = await DeviceInfo.getUniqueId();

        const masterKey = cryptoService.deriveKey(password, deviceId);

        try {
            const encryptedAuth = cryptoService.encrypt("success", masterKey);

            await EncryptedStorage.setItem(
                "user_auth",
                JSON.stringify({
                    iv: encryptedAuth.iv,
                    encryptedSuccess: encryptedAuth.ciphertext,
                    deviceId: deviceId
                })
            );

            navigation.reset({
                index: 0,
                routes: [{ name: 'Main', params: { masterKey: masterKey.toString('hex')} }],
            });
        } catch (e) {
            console.log("EncryptedStorage error", e);
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
                            placeholder='다시 한번 더 입력해 주세요.'
                            stroke={false}
                            fontSize={24}
                        />
                    </View>
                    <View style={{flex:1, paddingHorizontal: 32,}}>
                        <Text warning={true} text="꼭 기억해 주세요. 보안의 핵심입니다."/>
                    </View>
                    <View style={{flex:1}}/>
                    <Button 
                        text='확인'
                        activated={password == realPassword}
                        onPress={btnPressed}
                    />
                </Container>
            </TouchableWithoutFeedback>
    );
};

export default ConfirmPW;