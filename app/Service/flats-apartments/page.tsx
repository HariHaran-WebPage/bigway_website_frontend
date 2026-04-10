import ServicePageShell from '../ServicePageShell';
import { SERVICES } from '../../data/serviceData';

export const metadata = { title: 'Flats & Apartments | Bigway Real Estate Coimbatore' };

export default function FlatsApartmentsPage() {
  return <ServicePageShell service={SERVICES[3]} />;
}