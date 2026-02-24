import { StatusBar} from "react-native";
import { ThemeProvider } from 'styled-components/native';
import { theme } from "./theme";
import Navigation from "./navigations";
import Toast from 'react-native-toast-message';

const App = () => {
    return (
        <ThemeProvider theme={theme}>

            <StatusBar barStyle="dark-content" />
            <Navigation />
            <Toast />
        </ThemeProvider>
    );
};

export default App;