export default function HomePage() {
  return (
    <main style={{
      fontFamily: "Arial, sans-serif",
      background: "#f7f5ef",
      color: "#183c2d",
      minHeight: "100vh",
      padding: "48px 24px"
    }}>
      <header style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>🌿 SajhaCart</h2>
        <a href="#deals" style={{
          background: "#183c2d",
          color: "white",
          padding: "12px 18px",
          borderRadius: "10px",
          textDecoration: "none"
        }}>Explore Deals</a>
      </header>

      <section style={{
        maxWidth: "1100px",
        margin: "70px auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
        gap: "36px",
        alignItems: "center"
      }}>
        <div>
          <p>YOUR NEIGHBOURHOOD, YOUR SAVINGS</p>
          <h1 style={{
            fontSize: "clamp(42px,6vw,68px)",
            lineHeight: 1.05,
            letterSpacing: "-2px"
          }}>
            Buy together.<br />Save together.
          </h1>
          <p style={{lineHeight: 1.8, color: "#59675e"}}>
            Join your neighbourhood to discover better group prices
            on everyday essentials.
          </p>
          <a href="#deals" style={{
            display: "inline-block",
            background: "#183c2d",
            color: "white",
            padding: "14px 20px",
            borderRadius: "10px",
            textDecoration: "none",
            marginTop: "12px"
          }}>Discover Group Deals →</a>
        </div>
        <div style={{
          background: "#e5ecdc",
          borderRadius: "28px",
          padding: "55px 20px",
          textAlign: "center",
          fontSize: "100px"
        }}>🛍️🥬🍅</div>
      </section>

      <section id="deals" style={{maxWidth: "1100px", margin: "0 auto"}}>
        <h2 style={{fontSize: "32px"}}>Popular Group Deals</h2>
        <p style={{color: "#59675e"}}>
          Sample offers for website preview — live pricing is not connected yet.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px",
          marginTop: "28px"
        }}>
          {[
            ["🍚","Premium Basmati Rice","5 kg","₹425"],
            ["🌾","Whole Wheat Atta","10 kg","₹315"],
            ["🫙","Mustard Oil","2 litre","₹285"]
          ].map(([emoji,name,unit,price]) => (
            <article key={name} style={{
              background: "#fffefa",
              border: "1px solid #e3e5dc",
              borderRadius: "18px",
              padding: "24px"
            }}>
              <div style={{fontSize: "48px"}}>{emoji}</div>
              <h3>{name}</h3>
              <p style={{color: "#657168"}}>{unit}</p>
              <strong style={{fontSize: "25px"}}>{price}</strong>
              <p style={{fontSize: "12px",color: "#7a847d"}}>
                Illustrative price, not a live offer
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer style={{
        maxWidth: "1100px",
        margin: "70px auto 0",
        borderTop: "1px solid #dfe3d9",
        paddingTop: "24px",
        color: "#657168"
      }}>
        © 2026 SajhaCart · Buy together, save together.
      </footer>
    </main>
  );
} 
