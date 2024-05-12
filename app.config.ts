const colorSchemes = {
  gray: {
    400: 'text-gray-400 bg-gray-900',
    500: 'text-gray-500 bg-gray-900',
    600: 'text-gray-600 bg-gray-900',
    700: 'text-gray-700 bg-gray-900',
    800: 'ring-1 ring-gray-800',
    900: 'bg-gray-900',
    1000: 'text-gray-100 bg-gray-900',
  },
  green: {
    400: 'text-green-400 bg-gray-900',
    500: 'text-green-500 bg-gray-900',
    600: 'text-green-600 bg-gray-900',
    700: 'text-green-700 bg-gray-900',
    800: 'ring-1 ring-green-800',
    900: 'bg-gray-900',
    1000: 'text-green-100 bg-gray-900',
  },
  red: {
    400: 'text-red-400 bg-gray-900',
    500: 'text-red-500 bg-gray-900',
    600: 'text-red-600 bg-gray-900',
    700: 'text-red-700 bg-gray-900',
    800: 'ring-1 ring-red-800',
    900: 'bg-gray-900',
    1000: 'text-red-100 bg-gray-900',
  },
};

const buttonStyles = {
  base: 'text-gray-100 rounded-full hover:text-gray-200 transition-hover duration-200',
  ghost: {
    gray: colorSchemes.gray[400],
    green: colorSchemes.green[400],
    red: colorSchemes.red[400],
  },
};

const tooltipStyles = {
  base: 'bg-gray-900 text-gray-200 ring-1 ring-gray-800',
};

const slideoverStyles = {
  base: 'flex-1 flex flex-col w-full focus:outline-none',
  overlay: {
    base: 'bg-gray-200/75 dark:bg-gray-800/50 backdrop-blur-md',
  },
};

const rangeStyles = {
  thumb: {
    base: 'text-gray-100',
  },
  progress: {
    base: 'bg-gray-500 dark:bg-gray-100 rounded-s-lg',
    filled: {
      base: 'bg-gray-600 dark:bg-gray-300',
    },
  },
};

export default defineAppConfig({
  ui: {
    primary: 'white',
    colorSchemes,
    button: buttonStyles,
    tooltip: tooltipStyles,
    slideover: slideoverStyles,
    range: rangeStyles,
  },
});
