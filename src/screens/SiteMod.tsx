import { useState, useEffect, useRef } from 'react';
import { useRoute } from "@react-navigation/native";
import { cryptoService } from '../utils/cryptoService';
import EncryptedStorage from 'react-native-encrypted-storage';
import { TextInput, Button } from '../components';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Buffer } from '@craftzdog/react-native-buffer';

const Container = styled.View`
    flex: 1;

`;

const InputContainer = styled.View`
    flex: 1;
    margin-top: 48px;
    padding: 32px;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
`;

const SiteMod = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { masterKey, item} = route.params;
    const keyBuffer = Buffer.from(masterKey, 'hex');
    const [ siteName, setSiteName ] = useState('');
    const [ accountId, setAccountId ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ memo, setMemo ] = useState('');

    const accountIDRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);
    const memoRef = useRef<any>(null);

    useEffect(() => {
        if(!!item) {
            try {
                const decrypted = cryptoService.decrypt(item.payload, keyBuffer, item.iv);
                const data = JSON.parse(decrypted);
                setSiteName(item.siteName || '');
                setAccountId(data.accountId || '');
                setPassword(data.password || '');
                setMemo(data.memo || '');
            } catch(e) {
                console.log("데이터 로드 에러: ", e);
                Toast.show({type:'error', text1:'데이터 로드 오류'})
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main', params: { masterKey: masterKey} }],
                });
            }
        }
    }, []);

    const handleSave = async () => {
        if (!siteName || !accountId) {
            Toast.show({
                type: 'error',
                text1: '사이트 이름, ID는 필수사항입니다.',
            });
            return;
        }
        try {
            const storedData = await EncryptedStorage.getItem("vault_list");
            let vaultList = storedData ? JSON.parse(storedData) : [];

            const payload = JSON.stringify({
                accountId,
                password,
                memo
            });
            const encrypted = cryptoService.encrypt(payload, keyBuffer);
            const currentTime = Date.now().toString();

            const newItem = {
                siteId: !!item ? item.siteId : currentTime,
                siteName: siteName,
                updatedAt: currentTime,
                iv: encrypted.iv,
                payload: encrypted.ciphertext,
            };

            if (!!item) {
                vaultList = vaultList.map((v: any) => v.siteId === item.siteId ? newItem : v);
            } else {
                vaultList.push(newItem);
            }

            await EncryptedStorage.setItem("vault_list", JSON.stringify(vaultList));

            Toast.show({
                type: 'success',
                text1: '저장 완료'
            });

            navigation.reset({
                index: 0,
                routes: [{ name: 'Main', params: { masterKey: masterKey} }],
            });

        } catch (e) {
            console.log('저장 실패: ', e);
        }
    };

    return (
        <Container>
            <InputContainer>
                <TextInput
                    value={siteName}
                    onChangeText={setSiteName}
                    placeholder='사이트 이름 (설명)'
                    stroke={true}
                    fontSize={16}
                    height={56}
                    returnKeyType="next"
                    onSubmitEditing={() => accountIDRef.current?.focus()}
                    blurOnSubmit={false}
                    multiline={false}
                />
                <TextInput
                    ref={accountIDRef}
                    value={accountId}
                    onChangeText={setAccountId}
                    placeholder='ID'
                    stroke={true}
                    fontSize={16}
                    height={56}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    blurOnSubmit={false}
                    multiline={false}
                />
                <TextInput
                    ref={passwordRef}
                    value={password}
                    onChangeText={setPassword}
                    placeholder='비밀번호'
                    stroke={true}
                    fontSize={16}
                    height={56}
                    returnKeyType="next"
                    onSubmitEditing={() => memoRef.current?.focus()}
                    blurOnSubmit={false}
                    multiline={false}
                />
                <TextInput
                    ref={memoRef}
                    value={memo}
                    onChangeText={setMemo}
                    placeholder='메모'
                    stroke={true}
                    fontSize={16}
                    height={120}
                />
            </InputContainer>
            <ButtonContainer>
                <View style={{ flex: 1 }}>
                    <Button 
                        activated={false} 
                        text='취소'
                        disabled={false}
                        onPress={() => navigation.reset({
                            index: 0,
                            routes: [{ name: 'Main', params: { masterKey: masterKey} }],
                            })
                        }
                    />
                </View>
                <View style={{ flex: 1 }} >
                    <Button 
                        text='완료'
                        onPress={handleSave}
                    />
                </View>
            </ButtonContainer>
        </Container>
    );
};

export default SiteMod;