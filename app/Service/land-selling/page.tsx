import ServicePageShell from '../ServicePageShell';
import { SERVICES } from '../../data/serviceData';

export const metadata = { title: 'Land Selling | Bigway Real Estate Coimbatore' };

export default function LandSellingPage() {
  return <ServicePageShell service={SERVICES[1]} />;
}