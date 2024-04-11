import { createTheme } from '@mui/material/styles';

// Function to get CSS variable values
const getCssVariableValue = (variableName) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};

const theme = createTheme({
  palette: {
    primary: {
      main: getCssVariableValue('--nav-background-color'),
    },
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: getCssVariableValue('--nav-background-color'),
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: getCssVariableValue('--nav-background-color'),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: getCssVariableValue('--nav-background-color'),
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: getCssVariableValue('--nav-background-color'),
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: getCssVariableValue('--nav-background-color'),
            },
          },
        },
      },
    },
  },
});

export default theme;
