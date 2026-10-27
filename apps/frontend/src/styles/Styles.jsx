import { T } from './tokens';
import { baseStyles } from './baseStyles';
import { navStyles } from './navStyles';
import { heroStyles } from './heroStyles';
import { contentStyles } from './contentStyles';
import { galleryPageStyles } from './galleryPageStyles';
import { responsiveStyles } from './responsiveStyles';
import { loginStyles } from './loginStyles';

export const Styles = () => (
  <style>{[
    baseStyles(T),
    navStyles(T),
    heroStyles(T),
    contentStyles(T),
    galleryPageStyles(T),
    responsiveStyles(T),
    loginStyles(T),
  ].join('\n')}</style>
);
