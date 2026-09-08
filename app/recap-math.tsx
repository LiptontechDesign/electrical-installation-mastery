import Formula from './formula';

// Explicit typesetting, not an automatic prose-to-equation guesser.
export const recapEquations:Record<string,string>={
 'I = Q ÷ t':String.raw`I=\frac{Q}{t}`,
 'Q = I × t':String.raw`Q=It`,
 '1 A = 1 C/s':String.raw`1\,\mathrm{A}=1\,\mathrm{C/s}`,
 'V = I × R':String.raw`V=IR`, 'I = V ÷ R':String.raw`I=\frac{V}{R}`, 'R = V ÷ I':String.raw`R=\frac{V}{I}`,
 'R = ρ × L ÷ A':String.raw`R=\frac{\rho L}{A}`,
 'L = R × A ÷ ρ':String.raw`L=\frac{RA}{\rho}`,
 'ρ = R × A ÷ L':String.raw`\rho=\frac{RA}{L}`,
 'Circular wire: A = πd² ÷ 4':String.raw`A=\frac{\pi d^2}{4}`,
 'Series: Rtotal = R₁ + R₂ + …':String.raw`R_{\mathrm{total}}=R_1+R_2+\cdots`,
 'Parallel: 1/Rtotal = 1/R₁ + 1/R₂ + …':String.raw`\frac{1}{R_{\mathrm{total}}}=\frac{1}{R_1}+\frac{1}{R_2}+\cdots`,
 'Parallel current: Itotal = I₁ + I₂ + …':String.raw`I_{\mathrm{total}}=I_1+I_2+\cdots`,
 'P = VI = I²R = V²/R':String.raw`P=VI=I^2R=\frac{V^2}{R}`,
 'Energy (kWh) = power (kW) × hours':String.raw`E\,(\mathrm{kWh})=P\,(\mathrm{kW})\times t\,(\mathrm{h})`,
 '3 kW for 1 hour = 3 kWh':String.raw`3\,\mathrm{kW}\times1\,\mathrm{h}=3\,\mathrm{kWh}`,
 'f = 1 ÷ T':String.raw`f=\frac{1}{T}`,
 '50 Hz → T = 0.02 s = 20 ms':String.raw`f=50\,\mathrm{Hz}\;\Rightarrow\;T=0.02\,\mathrm{s}=20\,\mathrm{ms}`,
 'Xᴸ = 2πfL':String.raw`X_L=2\pi fL`,
 'Xᶜ = 1 ÷ (2πfC)':String.raw`X_C=\frac{1}{2\pi fC}`,
 'Series R–L: V = √(Vᴿ² + Vᴸ²)':String.raw`V=\sqrt{V_R^2+V_L^2}`,
 'Series R–L: Z = √(R² + Xᴸ²)':String.raw`Z=\sqrt{R^2+X_L^2}`,
 'I = V ÷ Z':String.raw`I=\frac{V}{Z}`,
 'S² = P² + Q²':String.raw`S^2=P^2+Q^2`,
 'Power factor = P ÷ S':String.raw`\mathrm{PF}=\frac{P}{S}`,
 'P: W   Q: var   S: VA':String.raw`P:\mathrm{W}\qquad Q:\mathrm{var}\qquad S:\mathrm{VA}`,
 'Xᴸ = √(Z² − R²)':String.raw`X_L=\sqrt{Z^2-R^2}`,
 'L = Xᴸ ÷ (2πf)':String.raw`L=\frac{X_L}{2\pi f}`,
 'cos φ = R ÷ Z':String.raw`\cos\varphi=\frac{R}{Z}`,
 'P = 5 kW; Q = 3 kvar':String.raw`P=5\,\mathrm{kW},\quad Q=3\,\mathrm{kvar}`,
 'S = √(5² + 3²) ≈ 5.83 kVA':String.raw`S=\sqrt{5^2+3^2}\approx5.83\,\mathrm{kVA}`,
 'Power factor ≈ 5/5.83 ≈ 0.857':String.raw`\mathrm{PF}\approx\frac{5}{5.83}\approx0.857`,
 'Zs ≈ Ze + (R₁ + R₂)':String.raw`Z_s\approx Z_e+(R_1+R_2)`,
 'Fault current ≈ U₀ ÷ Zs':String.raw`I_{\mathrm{fault}}\approx\frac{U_0}{Z_s}`,
 'Star: Vline = √3 Vphase; Iline = Iphase':String.raw`\begin{aligned}V_L&=\sqrt3\,V_{\mathrm{ph}}\\I_L&=I_{\mathrm{ph}}\end{aligned}`,
 'Delta: Vline = Vphase; Iline = √3 Iphase':String.raw`\begin{aligned}V_L&=V_{\mathrm{ph}}\\I_L&=\sqrt3\,I_{\mathrm{ph}}\end{aligned}`,
 'Simple resistive load: I = P ÷ V':String.raw`I=\frac{P}{V}`,
 '9000 W ÷ 230 V ≈ 39.13 A':String.raw`I=\frac{9000\,\mathrm{W}}{230\,\mathrm{V}}\approx39.13\,\mathrm{A}`,
 'Simple resistive path: ΔV = I × Rpath':String.raw`\Delta V=I R_{\mathrm{path}}`,
 'E = I ÷ d²':String.raw`E=\frac{I}{d^2}`,
 '1000 cd ÷ (2 m)² = 250 lx':String.raw`E=\frac{1000\,\mathrm{cd}}{(2\,\mathrm{m})^2}=250\,\mathrm{lx}`,
 'E = I cos θ ÷ d²':String.raw`E=\frac{I\cos\theta}{d^2}`,
 'd² = h² + x²':String.raw`d^2=h^2+x^2`,
 'cos θ = h ÷ d (horizontal receiving surface)':String.raw`\cos\theta=\frac{h}{d}`,
 'N = E × A ÷ (F × UF × MF)':String.raw`N=\frac{EA}{F\times\mathrm{UF}\times\mathrm{MF}}`,
 'F = lumens per complete luminaire':String.raw`F=\text{lumens per complete luminaire}`,
 'Epoint = E₁ + E₂ + …':String.raw`E_{\mathrm{point}}=E_1+E_2+\cdots`,
 'Each Eᵢ = Iᵢ cos θᵢ ÷ dᵢ²':String.raw`E_i=\frac{I_i\cos\theta_i}{d_i^2}`,
};
export function RecapLine({line}:{line:string}){
 const tex=recapEquations[line];
 const label=tex&&line.includes(':')&&!line.startsWith('P:')?line.split(':')[0]:null;
 return <>{label&&<span className="recap-equation-label">{label}</span>}{tex?<Formula tex={tex} block/>:line}</>;
}

export function RecapDiagram({chapterId}:{chapterId:string}){
 const impedance=['p01-l24','supp-ac-theory-24'].includes(chapterId);
 const worked=chapterId==='p06-l14';
 if(!impedance&&!worked&&chapterId!=='supp-ac-theory-23')return null;
 const horizontal=impedance?'R':worked?'P = 5 kW':'P (W)';
 const vertical=impedance?'Xₗ':worked?'Q = 3 kvar':'Q (var)';
 const diagonal=impedance?'Z':worked?'S ≈ 5.83 kVA':'S (VA)';
 return <figure className="recap-triangle">
   <svg viewBox="0 0 480 240" role="img" aria-label={`${impedance?'Inductive impedance':'Inductive power'} triangle: ${horizontal} horizontal, ${vertical} vertical, ${diagonal} hypotenuse.`}>
    <path d="M45 190 H345 V10 Z" fill="#e6f4f6" stroke="#097a8e" strokeWidth="3"/>
    <path d="M325 190 V170 H345" fill="none" stroke="#526b78" strokeWidth="2"/>
    <path d="M95 190 A50 50 0 0 0 90 168" fill="none" stroke="#b96620" strokeWidth="2"/>
    <text x="103" y="179" fill="#92501b">φ</text>
    <text x="195" y="220" textAnchor="middle">{horizontal}</text>
    <text x="355" y="106" fontSize="14">{vertical}</text>
    <text x="181" y="87" textAnchor="middle" transform="rotate(-30.964 181 87)">{diagonal}</text>
   </svg>
   <figcaption>{impedance?'Ideal series R–L model; diagram is schematic.':worked?'The 5:3 component lengths use a common scale.':'Positive Q illustrates an inductive load; a capacitive Q points downward. Schematic, not a numerical plot.'}</figcaption>
 </figure>;
}
