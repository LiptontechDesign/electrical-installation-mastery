import Formula from './formula';
import { engineeringToTex } from './engineering-notation';

/** A measured or calculated value rendered with non-breaking, upright SI units. */
export default function EngineeringValue({ value, unit }: { value: string | number; unit: string }) {
  return <Formula tex={engineeringToTex(`${value} ${unit}`)} />;
}
