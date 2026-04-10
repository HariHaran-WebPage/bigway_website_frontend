import ServicePageShell from '../ServicePageShell';
import { SERVICES } from '../../data/serviceData';

export const metadata = { title: 'Property Selling | Bigway Real Estate Coimbatore' };

export default function PropertySellingPage() {
  return <ServicePageShell service={SERVICES[0]} />;
}