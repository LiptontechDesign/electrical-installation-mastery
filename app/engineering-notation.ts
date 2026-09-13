const symbols: [RegExp, string][] = [
  [/\bIΔn\b/g, 'I_{\\Delta n}'], [/\bR1\s*\+\s*R2\b/g, 'R_1 + R_2'],
  [/\bIph\b/g, 'I_{\\mathrm{ph}}'], [/\bVph\b/g, 'V_{\\mathrm{ph}}'],
  [/\bIL\b/g, 'I_L'], [/\bVL\b/g, 'V_L'], [/\bIA\b/g, 'I_A'], [/\bIB\b/g, 'I_B'],
  [/\bIb\b/g, 'I_b'], [/\bIn\b/g, 'I_n'], [/\bIz\b/g, 'I_z'], [/\bIt\b/g, 'I_t'],
  [/\bNs\b/g, 'N_s'], [/\bNr\b/g, 'N_r'], [/\bfr\b/g, 'f_r'], [/\bQc\b/g, 'Q_c'],
  [/\bCa\b/g, 'C_a'], [/\bCg\b/g, 'C_g'], [/\bCi\b/g, 'C_i'],
  [/\bRt\b/g, 'R_t'], [/\bZs\b/g, 'Z_s'], [/\bZe\b/g, 'Z_e'], [/\bU0\b/g, 'U_0'], [/\bVd\b/g, '\\Delta V'],
  [/\bpf\b/gi, '\\mathrm{pf}'], [/\bsqrt\s*\(\s*3\s*\)/gi, '\\sqrt{3}'], [/√\s*3/g, '\\sqrt{3}'],
  [/\bcos\s*\^\s*-?1/gi, '\\cos^{-1}'], [/\btan\b/gi, '\\tan'],
  [/<=|≤/g, ' \\le '], [/>=|≥/g, ' \\ge '], [/~=|≈/g, ' \\approx '], [/->|→/g, ' \\to '],
  [/(?<=\d|\))\s*[x×]\s*(?=\d|\()/g, ' \\times '], [/Δ/g, '\\Delta '], [/φ/g, '\\varphi '],
  [/²/g, '^2'], [/³/g, '^3'],
];

const unitPatterns: [RegExp, string][] = [
  [/\b(\d+(?:\.\d+)?)\s*mm2\b/gi, '$1\\,\\mathrm{mm^2}'],
  [/\b(\d+(?:\.\d+)?)\s*M(?:ohm|Ω)\b/gi, '$1\\,\\mathrm{M\\Omega}'],
  [/\b(\d+(?:\.\d+)?)\s*(?:ohm|Ω)\b/gi, '$1\\,\\Omega'],
  [/\b(\d+(?:\.\d+)?)\s*(kVAr|kVA|kWh|kW|mV\/A\/m|r\/min|Hz|ms|V|A|W|h)\b/g, '$1\\,\\mathrm{$2}'],
];

/** Converts the bank's constrained ASCII engineering notation into KaTeX input. */
export function engineeringToTex(value: string) {
  let tex = value.trim();
  for (const [pattern, replacement] of symbols) tex = tex.replace(pattern, replacement);
  for (const [pattern, replacement] of unitPatterns) tex = tex.replace(pattern, replacement);
  return tex.replace(/(?<!\\)%/g, '\\%');
}
