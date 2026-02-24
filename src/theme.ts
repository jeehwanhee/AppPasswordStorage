const colors = {
    white: '#ffffff',
    black: '#000000',
    red: '#FF3C3C',
    blue: '#69A8FF',
    gray_0: '#EAEAEA',
    gray_1: '#D9D9D9',
    gray_2: '#BDBDBD',
    gray_3: '#5E5E5E',
};

const fonts = {
  light: 'kohi_nanum_light', 
  bold: 'kohi_nanum_bold',
};

export const theme = {
    fonts,
    colors,
    errorText: colors.red,
    text: colors.black,
    checkText: colors.gray_3,

    buttonBackground: colors.gray_0,
    buttonBackgroundActivated: colors.blue,
    buttonText: colors.black,
    buttonTextRed: colors.red,
    buttonTextdeactivated: colors.gray_3,
    
    textInputStroke: colors.black,
    textInputNonStroke: colors.white,
    textInputText: colors.black,
    textInputPlaceholder: colors.gray_2,
};