// import original module declarations
import "styled-components";
// and extend them!
declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            backgroundColor: string;
            fontColor: string;
            secondaryFontColor: string;
            shadowColor: string;
            listBackgroundColor: string;
            primary: string;
            danger: string;
        };
    }
}
