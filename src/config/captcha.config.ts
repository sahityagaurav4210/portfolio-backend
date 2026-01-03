export function getCaptchaImgConfig(captchaLen: number): Record<string, any> {
  return {
    size: captchaLen,
    noise: captchaLen + 4,
    color: false,
    background: '#475569',
    ignoreChars: '(){}[]/',
    width: 200,
    height: 65,
    fontSize: 48,
  };
}
