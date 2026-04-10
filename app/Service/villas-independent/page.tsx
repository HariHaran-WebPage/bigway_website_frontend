import ServicePageShell from '../ServicePageShell';
import { SERVICES } from '../../data/serviceData';

export const metadata = { title: 'Villas & Independent | Bigway Real Estate Coimbatore' };

export default function VillasIndependentPage() {
  return <ServicePageShell service={SERVICES[4]} />;
}