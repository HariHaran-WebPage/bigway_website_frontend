import ServicePageShell from '../ServicePageShell';
import { SERVICES } from '../../data/serviceData';

export const metadata = { title: 'Construction | Bigway Real Estate Coimbatore' };

export default function ConstructionPage() {
  return <ServicePageShell service={SERVICES[2]} />;
}