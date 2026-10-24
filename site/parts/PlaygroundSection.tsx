import { Playground } from "./Playground";

export function PlaygroundSection() {
  return (
    <section className="block" id="playground" aria-labelledby="playground-title">
      <div className="container wide">
        <header className="block-head center reveal">
          <h2 id="playground-title">A page is just JSON</h2>
          <p className="muted">
            Edit it and the store re-renders and re-validates as you type. Links in the preview work: open a product, filter the
            catalogue, fill the cart.
          </p>
        </header>
        <div className="reveal">
          <Playground />
        </div>
      </div>
    </section>
  );
}
