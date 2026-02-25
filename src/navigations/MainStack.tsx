import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Signup, ConfirmPW, Main, SiteMod, Login, Site } from "../screens";
import { MainStackParamList } from "./type";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import EncryptedStorage from "react-native-encrypted-storage";
import { AppState, AppStateStatus } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator<MainStackParamList>();

const MainStack = () => {
    const theme = useContext(ThemeContext);
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
    const appState = useRef(AppState.currentState);
    const navigation = useNavigation<any>();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authData = await EncryptedStorage.getItem("user_auth");
                if (authData) {
                    setIsRegistered(true);
                } else {
                    setIsRegistered(false);
                }
            } catch (e) {
                console.log('데이터 조회 실패:', e);
                setIsRegistered(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                if (isRegistered === true) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }
            }
            appState.current = nextAppState;
        });
        
        return () => {
            subscription.remove();
        };
    }, [navigation, isRegistered]);

    return (
        <Stack.Navigator
            initialRouteName={isRegistered ? "Login" :"Signup"}
            screenOptions={{
                    headerTitleAlign: 'center',
                    headerTitle: '비밀번호 저장소',
                    headerTitleStyle: {
                        fontFamily: theme?.fonts.bold,
                        fontSize: 24,
                    },
                    
                    headerTitleContainerStyle: {
                        marginHorizontal: 0,
                        left: 0,
                        right: 0,
                    },
                    headerLeftContainerStyle: { 
                        width: 48,
                        paddingLeft: 16,
                    },
                    headerRightContainerStyle: {
                        paddingRight: 16,
                    },
                }}
        >
            {isRegistered ? (
                <>
                    <Stack.Screen name="Login" component={Login} options={{
                        gestureEnabled: false
                    }}/>
                    <Stack.Screen name="Main" component={Main} />
                    <Stack.Screen name="SiteMod" component={SiteMod} />
                    <Stack.Screen name="Site" component={Site} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Signup" component={Signup} options={{
                        gestureEnabled: false
                    }}/>
                    <Stack.Screen name="ConfirmPW" component={ConfirmPW} />
                    <Stack.Screen name="Main" component={Main} />
                </>
            )}
            
        </Stack.Navigator>
    );
};

export default MainStack;

/*
options={{
                    headerLeft: () => (
                        <MaterialCommunityIcons
                            name="chevron-left"
                            size={24}
                            onPress={() => {}}
                        />
                    ),
                    headerRight: () => (
                        <MaterialCommunityIcons
                            name="menu"
                            size={24}
                            onPress={() => {}}
                        />
                    ),
                }}   
*/                    