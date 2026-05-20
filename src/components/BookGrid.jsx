import { useEffect, useState } from "react";
import BookCard from "./BookCard";

function BookGrid({ books, onAdd, onRemove, cart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, [books.length]);

  const getQty = (id) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    return item ? item.qty : 0;
  };

  return (
    <div style={{ padding: "0 2rem 4rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "2rem",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "#534AB7",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: "500",
          }}
        >
          {books.length} {books.length === 1 ? "resultado" : "titulos"}
        </span>
        <div
          style={{
            flex: 1,
            height: "0.5px",
            background: "rgba(255,255,255,0.06)",
          }}
        />
      </div>

      {books.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            color: "#a7a9be",
            fontSize: "15px",
          }}
        >
          No encontramos titulos con esos filtros.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {books.map((book, index) => (
            <div
              key={book.id}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s`,
              }}
            >
              <BookCard
                book={book}
                onAdd={onAdd}
                onRemove={onRemove}
                qty={getQty(book.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookGrid;
