import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      @font-face {
  font-family: 'Sarabun';
  src: url('./Sarabun-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Sarabun';
  src: url('./Sarabun-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Sarabun';
  src: url('./Sarabun-Italic.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
}

@font-face {
  font-family: 'Sarabun';
  src: url('./Sarabun-BoldItalic.ttf') format('truetype');
  font-weight: 700;
  font-style: italic;
}
    `}
  />
);

export default Fonts;