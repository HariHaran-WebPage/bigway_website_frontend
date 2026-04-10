import ServicePageShell from '../ServicePageShell';
import { SERVICES } from '../../data/serviceData';

export const metadata = { title: 'Commercial | Bigway Real Estate Coimbatore' };

export default function CommercialPage() {
  return <ServicePageShell service={SERVICES[5]} />;
}