import styled from "styled-components/native";
import{ Button } from "../components";
import { View, Alert } from "react-native";
import { useState, useEffect, useCallback } from 'react';
import { useRoute } from "@react-navigation/native";
import { cryptoService } from '../utils/cryptoService';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Buffer } from '@craftzdog/react-native-buffer';

const Container = styled.View`
    flex: 1;

`;

const TextContainer = styled.View`
    flex: 1;
    margin-top: 48px;
    padding: 48px;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
`;

interface TextProps {
    bold?: boolean,
    text?: string
};

const StyledText = styled.Text<TextProps>`
    font-size: 20px;
    color: ${({ theme }) => theme.text };
    font-family: ${({ theme, bold }) => bold ? theme.fonts.bold : theme.fonts.light};
    paddingVertical: 8px;
`;

const StyledMemo = styled.Text<TextProps>`
    height: 160px;
    font-size: 20px;
    color: ${({ theme }) => theme.text };
    font-family: ${({ theme, bold }) => bold ? theme.fonts.bold : theme.fonts.light};
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.gray_0};
`;
const EmptyMemo = styled.Text<TextProps>`
    margin-top: 16px;
    height: 160px;
    font-size: 20px;
    color: ${({ theme }) => theme.text };
    font-family: ${({ theme, bold }) => bold ? theme.fonts.bold : theme.fonts.light};
    padding: 16px;
    background-color: ${({ theme }) => theme.colors.gray_0};
    text-align: center;
    line-height: 128px;
`;

const Site = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { masterKey, item } = route.params;
    const keyBuffer = Buffer.from(masterKey, 'hex');

    const [ siteName, setSiteName ] = useState('');
    const [ accountId, setAccountId ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ memo, setMemo ] = useState('');

    
        
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

    const _handleDelete = () => {
        Alert.alert("정말 삭제하시겠습니까?", "삭제된 데이터는 복구할 수 없습니다.",
            [
                {
                    text: "취소",
                    onPress: () => console.log("취소됨"),
                    style: "cancel"
                },
                {
                    text: "삭제하기",
                    onPress: () => confirmDelete(),
                    style: "destructive"
                }
            ],
            { cancelable: false }
        );
    };

    const confirmDelete = async () => {
        try {
            const storedData = await EncryptedStorage.getItem("vault_list");
            const vaultList = storedData ? JSON.parse(storedData) : [];
            const newList = vaultList.filter((v: any) => v.siteId !== item.siteId);
            await EncryptedStorage.setItem("vault_list", JSON.stringify(newList));

            Toast.show({
                type: 'success',
                text1: '삭제 완료'
            });

            navigation.reset({
                index: 0,
                routes: [{ name: 'Main', params: { masterKey: masterKey} }],
            });

        } catch (e) {
            console.log("삭제 실패: ", e)
        }
    };

    return (
        <Container>
            <TextContainer>
                <StyledText bold={true}>{siteName}</StyledText>
                <StyledText bold={false}>ID: {accountId}</StyledText>
                <StyledText bold={false}>PW: {password}</StyledText>
                {!!memo ? <StyledMemo bold={false}>{memo}</StyledMemo> :
                    <EmptyMemo bold={false}>메모가 없습니다.</EmptyMemo> }
            </TextContainer>
            <ButtonContainer>
                            <View style={{ flex: 1 }}>
                                <Button 
                                    activated={false} 
                                    text='삭제'
                                    disabled={false}
                                    onPress={_handleDelete}
                                    type={false}
                                />
                            </View>
                            <View style={{ flex: 1 }} >
                                <Button 
                                    text='수정하기'
                                    onPress={() => navigation.navigate('SiteMod', {masterKey, item})}
                                />
                            </View>
                        </ButtonContainer>
        </Container>
    );
};

export default Site;