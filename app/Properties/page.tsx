// In your page file:
import PropertiesDesktopTablet from './Properties';
import PropertiesMobile from './Properties-mobile';

export default function Page() {
  return (
    <>
      <div className="hidden md:block"><PropertiesDesktopTablet /></div>
      <div className="md:hidden"><PropertiesMobile /></div>
    </>
  );
}