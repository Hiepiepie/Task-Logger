import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    *{
        box-sizing:border-box;
    }
    body,html {
        color:${(props) => props.theme.colors.fontColor};
        background-color: #ffa69e;
        background-image: linear-gradient(315deg, #ffa69e 0%, #5d4954 74%);
        background-attachment: fixed;
        font-family:sans-serif;
        margin:0;
        padding:0;
        height: 100%;
        width: 100%;
    }
`;
