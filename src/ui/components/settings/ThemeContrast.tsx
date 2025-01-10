import { ReactNode, useMemo } from 'react';
// @mui
import { CssBaseline } from '@mui/material';
import { alpha, ThemeOptions, ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import useSettings from 'src/hooks/useSettings';
import componentsOverride from '../../../theme/overrides';

// hooks
//

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function ThemeContrast({ children }: Props) {
  const defaultTheme = useTheme();

  const { themeContrast } = useSettings();

  const isLight = defaultTheme.palette.mode === 'light';

  const shadowColor = isLight ? defaultTheme.palette.grey[500] : defaultTheme.palette.common.black;

  const styles = {
    bgDefault: defaultTheme.palette.background.default,
    bgBold: isLight ? defaultTheme.palette.grey[100] : defaultTheme.palette.grey[900],
    cardDefault: defaultTheme.components?.MuiCard?.styleOverrides?.root,
    cardBold: {
      zIndex: 0,
      position: 'relative',
      borderRadius: Number(defaultTheme.shape.borderRadius) * 2,
      boxShadow: `0 0 1px 0 ${alpha(shadowColor, 0.48)}, 0 2px 4px -1px ${alpha(
        shadowColor,
        0.24
      )}`,
    },
  } as const;

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      ...defaultTheme,
      palette: {
        ...defaultTheme.palette,
        background: {
          ...defaultTheme.palette.background,
          default: themeContrast === 'bold' ? styles.bgBold : styles.bgDefault,
        },
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: themeContrast === 'bold' ? styles.cardBold : styles.cardDefault,
          },
        },
      },
    }),

    [
      defaultTheme,
      themeContrast,
      styles.bgBold,
      styles.bgDefault,
      styles.cardBold,
      styles.cardDefault,
    ]
  );

  const theme = createTheme(themeOptions);

  theme.components = {
    ...componentsOverride(theme),
    MuiCard: themeOptions.components?.MuiCard,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
