import ProjectsDesktop from './Projects';
import ProjectsMobile from './Projects-mobile';

export default function Page() {
  return (
    <>
      <div className="hidden md:block"><ProjectsDesktop /></div>
      <div className="md:hidden"><ProjectsMobile /></div>
    </>
  );
}