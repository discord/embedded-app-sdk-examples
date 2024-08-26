import { indigo, indigoDark, slate, slateDark } from '@radix-ui/colors';
import { createStitches } from '@stitches/react';

export const {
	styled,
	css,
	globalCss,
	keyframes,
	getCssText,
	theme,
	createTheme,
	config,
} = createStitches({
	media: {
		small: '(max-width: 640px)',
		xsmall: '(max-width: 200px)',
	},
	theme: {
		colors: {
			...slate,
			...indigo,
		},
	},
});

export const darkTheme = createTheme({
	colors: {
		...slateDark,
		...indigoDark,
	},
});
