export function getCaptchaImgConfig(captchaLen: number): Record<string, any> {
  return { size: captchaLen, noise: captchaLen + 1, color: true, background: "#bfdbfe", ignoreChars: "(){}[]/", width: 200, height: 50, fontSize: 64 };
}