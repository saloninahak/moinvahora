import Link from 'next/link';
import { story } from '@content/story';

/** Contact block for normal-flow pages (the HUD "Contact" button scrolls here). */
export function ContactFooter() {
  const c = story.end;
  return (
    <footer id="end" className="contact">
      <p className="kicker">Contact</p>
      <p className="contact__line">{c.line}</p>
      <a className="contact__mail" href={c.links[0].href}>
        vahoramoin2896@gmail.com
      </a>
      <ul className="contact__links">
        {c.links.slice(1).map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="contact__foot">
        <span>{c.footer}</span>
        <Link href="/">Home</Link>
      </p>
    </footer>
  );
}
