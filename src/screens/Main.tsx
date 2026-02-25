import { useState, useCallback, useEffect } from "react";
import { Text, View, FlatList } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Buffer } from '@craftzdog/react-native-buffer';
import { Button } from "../components";
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';

const Container = styled.View`
    flex: 1;

`;

const HeaderContainer = styled.View`
    width: 100%;
    flex-direction: column;
    padding: 32px;
`;

const AddButton = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.buttonBackgroundActivated};
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin-left: 32px;
`;

const ButtonText = styled.Text`
    font-size: 32px;
    color: ${({ theme }) => theme.colors.white};
    font-family: ${({ theme }) => theme.fonts.bold};
`;

const SiteListContainer = styled.View`
    flex: 1;
    padding: 16px;
    gap: 40px;
`;

const SiteContainer = styled.TouchableOpacity`
    padding-vertical: 32px;
    padding-horizontal: 16px;
    border-bottom-width: 1px;
    border-bottom-color: #000;
`;

const formatDate = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
};

const Main = () => {
    const route = useRoute<any>();
    const masterKey = Buffer.from(route.params.masterKey, 'hex');
    const [sort, setSort] = useState(true); //true: 날짜순, false: 이름순
    const navigation = useNavigation<any>();
    const [vaultList, setVaultList] = useState([]);
    const theme = useTheme();

    useFocusEffect(
        useCallback(() => {
            loadVaultList();
        }, [])
    );

    useEffect(() => {
        loadVaultList();
    }, [sort]);

    const loadVaultList = async () => {
        try {
            const data = await EncryptedStorage.getItem("vault_list");
            if (data) {
                const paresd = JSON.parse(data);
                const sorted = sort ? 
                    paresd.sort((a: any, b: any) => Number(b.updatedAt) - Number(a.updatedAt)) : 
                    paresd.sort((a: any, b: any) => a.siteName.localeCompare(b.siteName, 'ko', { sensitivity: 'base' }));
                setVaultList(sorted)
            }
        } catch(e) {
            console.log("목록 로드 실패: ",e);
        }
    }

    return (
        <Container>
            <HeaderContainer>
                <View style={{ width: 120, flexDirection: 'row'}}>
                    <Button 
                        text="날짜순" 
                        activated={sort} 
                        onPress={() => setSort(true)} 
                        disabled={false}
                    />
                    <Button 
                        text="이름순" 
                        activated={!sort} 
                        onPress={() => setSort(false)}
                        disabled={false}
                    />
                    <AddButton
                        onPress={() => navigation.navigate('SiteMod', { masterKey: masterKey.toString('hex')})}
                    >
                        <ButtonText>+</ButtonText>
                    </AddButton>
                </View>

            </HeaderContainer>
            <SiteListContainer>
                <FlatList
                    data={vaultList}
                    keyExtractor={(item: any) => item.siteId}
                    renderItem={({ item }) => (
                        <SiteContainer
                            onPress={() => navigation.navigate('Site', {masterKey: masterKey.toString('hex'), item})}
                        >
                            <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{fontSize:20, fontFamily: theme.fonts.bold, }}>{item.siteName}</Text>
                                <Text style={{fontSize:16, fontFamily: theme.fonts.light, }}>{formatDate(item.updatedAt)}</Text>
                            </View>
                        </SiteContainer>  
                    )}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 50}}>
                            저장된 데이터가 없습니다.
                        </Text>
                    }
                />
            </SiteListContainer>
        </Container>
    );
};

export default Main;