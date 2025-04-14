import { FC } from 'react';
import { Global, css } from '@emotion/react';

const GlobalStyles: FC = () => (
  <Global
    styles={css`
      @font-face {
        font-family: 'Doeat_Pretendard';
        src: url('/fonts/Pretendard-Thin.otf') format('opentype');
        font-weight: 100;
        font-style: normal;
      }

      @font-face {
        font-family: 'Doeat_Pretendard';
        src: url('/fonts/Pretendard-ExtraLight.otf') format('opentype');
        font-weight: 200;
        font-style: normal;
      }

      @font-face {
        font-family: 'Doeat_Pretendard';
        src: url('/fonts/Pretendard-Light.otf') format('opentype');
        font-weight: 300;
        font-style: normal;
      }

      @font-face {
        font-family: 'Doeat_Pretendard';
        src: url('/fonts/Pretendard-Regular.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
      }

      @font-face {
        font-family: 'Doeat_Pretendard';
        src: url('/fonts/Pretendard-Medium.otf') format('opentype');
        font-weight: 500;
        font-style: normal;
      }

      @font-face {
        font-family: 'Doeat_Pretendard';
        src: url('/fonts/Pretendard-SemiBold.otf') format('opentype');
        font-weight: 600;
        font-style: normal;
      }

      @font-face {
        font-family: 'Doeat_Pretendard';
        src: url('/fonts/Pretendard-Bold.otf') format('opentype');
        font-weight: 700;
        font-style: normal;
      }

      @font-face {
        font-family: 'Doeat_Pretendard';
        src: url('/fonts/Pretendard-ExtraBold.otf') format('opentype');
        font-weight: 800;
        font-style: normal;
      }

      @font-face {
        font-family: 'Doeat_Pretendard';
        src: url('/fonts/Pretendard-Black.otf') format('opentype');
        font-weight: 900;
        font-style: normal;
      }

      :focus-visible {
        outline: none;
      }

      *,
      div {
        box-sizing: border-box;
        font-family: Doeat_Pretendard;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      html {
        -webkit-tap-highlight-color: transparent;
      }

      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }

      input {
        margin: 0;
        padding: 0;
        border: none;
        &:focus {
          outline: none;
        }

        &:disabled {
          background-color: transparent;
          opacity: 1;
        }
      }

      textarea {
        margin: 0;
        padding: 0;
        border: none;
        resize: none;

        &:disabled {
          opacity: 1;
        }
      }

      select {
        margin: 0;
        padding: 0;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        outline: none;
      }

      button {
        background-color: transparent;
        margin: 0;
        padding: 0;
        border: none;
        &:focus {
          outline: none;
        }
      }

      b {
        font-weight: 700;
      }
    `}
  />
);

export default GlobalStyles;
