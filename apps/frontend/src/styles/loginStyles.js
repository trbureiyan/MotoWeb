export const loginStyles = (T) => `
  .login-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; background: ${T.bg0}; }
  .login-image { min-height: 100vh; position: relative; display: flex; align-items: flex-end; padding: clamp(2rem, 7vw, 7rem); overflow: hidden; background: linear-gradient(0deg, rgba(8,8,8,.94), rgba(8,8,8,.08) 75%), linear-gradient(135deg, #312115, #121212 58%, #080808); }
  .login-image::before, .login-image::after { content: ''; position: absolute; pointer-events: none; }
  .login-image::before { inset: 0; opacity: .28; background: repeating-linear-gradient(135deg, transparent 0 42px, rgba(255,255,255,.035) 43px 44px); }
  .login-image::after { width: 55vw; height: 55vw; border: 1px solid rgba(255,98,0,.22); border-radius: 50%; right: -22vw; top: -12vw; box-shadow: 0 0 0 48px rgba(255,98,0,.025), 0 0 0 96px rgba(255,98,0,.02); }
  .login-image-copy { position: relative; z-index: 1; max-width: 560px; }
  .login-kicker { display: block; font: 500 .68rem ${T.mono}; color: ${T.orange}; letter-spacing: .18em; }
  .login-image-copy > p { margin: 1.5rem 0; font: 800 clamp(2.8rem, 5.4vw, 5.5rem)/.98 ${T.head}; letter-spacing: -.06em; color: #fff; }
  .login-image-copy > p span { color: ${T.orange}; }
  .login-image-line { height: 2px; width: 54px; background: ${T.orange}; margin: 2rem 0 1rem; }
  .login-image-note { font: 500 .64rem ${T.mono}; letter-spacing: .12em; color: rgba(255,255,255,.58); }
  .login-panel { min-height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; padding: 5rem clamp(1.5rem, 7vw, 7rem); }
  .login-back { position: absolute; top: 2.2rem; left: clamp(1.5rem, 4vw, 4rem); background: none; border: 0; color: ${T.muted}; font: 500 .65rem ${T.mono}; letter-spacing: .08em; cursor: pointer; transition: color .2s; }
  .login-back:hover { color: ${T.orange}; }
  .login-form-wrap { width: 100%; max-width: 430px; animation: slideUp .5s ease both; }
  .login-form-wrap h1 { font-size: clamp(2.3rem, 4vw, 3.4rem); line-height: 1.02; letter-spacing: -.04em; margin: 1rem 0 .9rem; }
  .login-form-wrap h1 em { color: ${T.orange}; font-style: normal; }
  .login-description { color: ${T.muted}; font-size: .9rem; margin-bottom: 2.5rem; }
  .login-form { display: flex; flex-direction: column; }
  .login-form label { margin: 0 0 .55rem; color: #aaa; font: 500 .62rem ${T.mono}; letter-spacing: .12em; }
  .login-form input { width: 100%; height: 54px; margin-bottom: 1.5rem; padding: 0 1rem; background: ${T.bg2}; border: 1px solid ${T.border}; color: ${T.text}; outline: none; font: .86rem ${T.body}; transition: border-color .2s, box-shadow .2s; }
  .login-form input:focus { border-color: ${T.orange}; box-shadow: 0 0 0 3px ${T.orangeGlow}; }
  .login-form input::placeholder { color: #606060; }
  .login-submit { min-height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 0 1.2rem; margin-top: .3rem; }
  .login-submit:disabled { opacity: .65; cursor: wait; }
  .login-submit span { font-size: 1.1rem; }
  .login-error { padding: .7rem .85rem; margin: -.3rem 0 1rem; color: #ffaaa0; background: rgba(180,50,38,.12); border-left: 2px solid #e85b4b; font-size: .8rem; }
  .login-footnote { margin-top: 1.5rem; text-align: center; color: ${T.muted}; font-size: .78rem; }
  .login-footnote a { color: ${T.orange}; text-decoration: none; }
  .login-footnote a:hover { text-decoration: underline; }
  .login-panel-mark { position: absolute; bottom: 1.8rem; left: clamp(1.5rem, 4vw, 4rem); right: clamp(1.5rem, 4vw, 4rem); display: flex; justify-content: space-between; color: #777; font: 500 .58rem ${T.mono}; letter-spacing: .1em; }
  .login-panel-mark span { color: #555; }
  @media (max-width: 800px) { .login-page { grid-template-columns: 1fr; } .login-image { display: none; } .login-panel { min-height: 100vh; padding: 6rem 1.5rem 5rem; } .login-back { top: 1.6rem; left: 1.5rem; } .login-panel-mark { left: 1.5rem; right: 1.5rem; bottom: 1.2rem; } }
`;
