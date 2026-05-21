export default function CatArmSvg() {
  return (
    <svg id="cat-arm-svg" width="160" height="340" viewBox="0 0 160 340" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="furGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8864a" />
          <stop offset="40%" stopColor="#e0a060" />
          <stop offset="70%" stopColor="#d09050" />
          <stop offset="100%" stopColor="#b07030" />
        </linearGradient>
        <linearGradient id="furGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9a6030" />
          <stop offset="50%" stopColor="#c07840" />
          <stop offset="100%" stopColor="#8a5020" />
        </linearGradient>
        <radialGradient id="padGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#e8a0b0" />
          <stop offset="100%" stopColor="#c06878" />
        </radialGradient>
        <radialGradient id="toeGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ebb0be" />
          <stop offset="100%" stopColor="#c87888" />
        </radialGradient>
        <pattern id="stripes" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(80)">
          <line x1="0" y1="0" x2="0" y2="20" stroke="#a06028" strokeWidth="3" strokeOpacity="0.35" />
        </pattern>
      </defs>
      <path d="M 20,0 Q 10,80 8,160 Q 6,240 18,290 Q 30,330 80,338 Q 130,330 142,290 Q 154,240 152,160 Q 150,80 140,0 Z" fill="url(#furGradDark)" />
      <path d="M 30,0 Q 22,80 20,160 Q 18,240 28,288 Q 40,328 80,334 Q 120,328 132,288 Q 142,240 140,160 Q 138,80 130,0 Z" fill="url(#furGrad)" />
      <path d="M 30,0 Q 22,80 20,160 Q 18,240 28,288 Q 40,328 80,334 Q 120,328 132,288 Q 142,240 140,160 Q 138,80 130,0 Z" fill="url(#stripes)" opacity="0.5" />
      <path d="M 55,0 Q 50,100 52,200 Q 54,270 62,310 Q 70,332 80,334 Q 90,332 98,310 Q 106,270 108,200 Q 110,100 105,0 Z" fill="#e8b070" opacity="0.35" />
      <g stroke="#a06028" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" fill="none">
        <line x1="22" y1="30" x2="14" y2="44" />
        <line x1="20" y1="60" x2="11" y2="74" />
        <line x1="18" y1="100" x2="10" y2="114" />
        <line x1="16" y1="140" x2="8" y2="155" />
        <line x1="138" y1="30" x2="146" y2="44" />
        <line x1="140" y1="60" x2="148" y2="74" />
        <line x1="142" y1="100" x2="150" y2="114" />
        <line x1="144" y1="140" x2="152" y2="155" />
        <path d="M 32,70 Q 50,65 68,70" strokeWidth="2.5" strokeOpacity="0.3" />
        <path d="M 92,70 Q 110,65 128,70" strokeWidth="2.5" strokeOpacity="0.3" />
        <path d="M 28,130 Q 50,123 72,130" strokeWidth="2.5" strokeOpacity="0.3" />
        <path d="M 88,130 Q 110,123 132,130" strokeWidth="2.5" strokeOpacity="0.3" />
        <path d="M 26,195 Q 50,186 74,195" strokeWidth="2.5" strokeOpacity="0.3" />
        <path d="M 86,195 Q 110,186 134,195" strokeWidth="2.5" strokeOpacity="0.3" />
      </g>
      <ellipse cx="80" cy="290" rx="52" ry="18" fill="#c07040" opacity="0.5" />
      <ellipse cx="80" cy="316" rx="36" ry="26" fill="url(#padGrad)" />
      <ellipse cx="72" cy="308" rx="14" ry="10" fill="white" opacity="0.18" />
      <path d="M 58,318 Q 80,326 102,318" stroke="#b05868" strokeWidth="1.5" fill="none" opacity="0.4" />
      <ellipse cx="42" cy="295" rx="13" ry="15" fill="url(#toeGrad)" />
      <ellipse cx="39" cy="290" rx="5" ry="4" fill="white" opacity="0.22" />
      <ellipse cx="62" cy="284" rx="14" ry="16" fill="url(#toeGrad)" />
      <ellipse cx="59" cy="279" rx="5" ry="4" fill="white" opacity="0.22" />
      <ellipse cx="98" cy="284" rx="14" ry="16" fill="url(#toeGrad)" />
      <ellipse cx="95" cy="279" rx="5" ry="4" fill="white" opacity="0.22" />
      <ellipse cx="118" cy="295" rx="13" ry="15" fill="url(#toeGrad)" />
      <ellipse cx="115" cy="290" rx="5" ry="4" fill="white" opacity="0.22" />
      <g fill="#d4a0a8" opacity="0.55">
        <path d="M 38,280 Q 34,272 36,266 Q 39,273 42,280 Z" />
        <path d="M 58,269 Q 55,260 57,254 Q 61,261 63,269 Z" />
        <path d="M 97,269 Q 99,260 103,254 Q 105,261 102,269 Z" />
        <path d="M 118,280 Q 122,272 124,266 Q 121,273 118,280 Z" />
      </g>
    </svg>
  );
}
